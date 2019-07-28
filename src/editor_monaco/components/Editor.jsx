import React, { Component,Fragment} from "react";
import PropTypes from "prop-types";
import api from '../../services/api'
import styleEditor from './style/Editor.css'
import imgLoading from './style/loading.gif'
export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      content:"//code here...",
      language:'javascript',
      theme:'vs-dark',
      response:'',
      loadingReponse:false
    }
  }
  async changeLanguage(e){
    const language = e.target.value;
    const content = this.state.editor.getValue()
    console.log(' e.target.value: '+language)
  
    await this.setState({
      language,
      content
    })
    console.log('language: '+this.state.language);
    this.handleMount()
  }
  async changeTheme(e){
    const theme = e.target.value;
    const content = this.state.editor.getValue()
    await this.setState({
      theme,
      content
    })
    this.handleMount()
  }
  async submit(e){
    console.log(e.target.value);
    const request = {
      codigo:this.state.editor.getValue(),
      linguagem:this.state.language
    }
    this.setState({loadingReponse:true})
    try{
      const response = await api.post('/',request)
      this.setState({loadingReponse:false})
      console.log(response.data.result.toString('hex'));
      if(response.status===200){
        this.setState({response:response.data.result})
      }
    }
    catch(err){
      alert('ERRO')
    }
    
  }

  componentDidMount() {
    this.handleLoad();
  }
  
  handleLoad() {
    // @note: safe to not check typeof window since it'll call on componentDidMount lifecycle:
    if (!window.require) {
      const loaderScript = window.document.createElement("script");
      loaderScript.type = "text/javascript";
      // @note: Due to the way AMD is being used by Monaco, there is currently no graceful way to integrate Monaco into webpack (cf. https://github.com/Microsoft/monaco-editor/issues/18):
      loaderScript.src = "https://unpkg.com/monaco-editor/min/vs/loader.js";
      loaderScript.addEventListener("load", this.didLoad);
      window.document.body.appendChild(loaderScript);
    } else {
      this.didLoad();
    }
  }
  async handleMount() {
    const element = document.getElementById('monacoEditor')
    element.innerHTML = ''
    const { language,theme,content } = this.state;
    //console.log('language: '+language)
    const editor = window.monaco.editor.create(element, {
      value: content,
      language,
      theme,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      scrollBeyondLastColumn:false,
      selectOnLineNumbers:false,
      minimap:{enabled:false},
      overviewRulerBorder:false,
      


    });
    await this.setState({editor})
    return this.state.editor;
  }
  didLoad = e => {
    
    window.require.config({
      paths: { vs: "https://unpkg.com/monaco-editor/min/vs" }
    });
    window.require(["vs/editor/editor.main"], () => {
      this.handleMount();
    });

    if (e) {
      e.target.removeEventListener("load", this.didLoad);
    }
  }

  render() {
    const {response,loadingReponse} = this.state
    return (
    <Fragment>
      <select onChange={e => this.changeLanguage(e)}>
        <option value = 'javascript'>JavaScript</option>
        <option value = 'cpp'>C++</option>
      </select>
      <select onChange={e => this.changeTheme(e)}>
        <option value = 'vs-dark'>Visual Studio Dark</option>
        <option value = 'hc-black'>High Contrast Dark</option>
        <option value = 'vs'>Visual Studio</option>
      </select>
      <button onClick={e => this.submit(e)}>Submeter </button>
        <div className='row'>
          
          <div className ="col-6" id='monacoEditor' style={{height:"500px", width:"100%"}}></div>
          
          <div id="response" className='col-6'>
            <p>Resposta: </p>

              {loadingReponse?
                <img className="text-center" src={imgLoading}/>:
                [<p><b>stderr</b>: {response.stderr}</p>,
                <p><b>stdout</b>: {response.stdout}</p>,
                <p><b>exitCode</b>: {response.exitCode}</p>,
                <p><b>memoryUsage</b>: {response.memoryUsage}</p>,
                <p><b>cpuUsage</b>: {response.cpuUsage}</p>,
                <p><b>errorType</b>: {response.errorType}</p>]
              }
          </div>
        </div>
    </Fragment>
    
    );
  }
}