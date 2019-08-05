import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from './services/api'
//import * as monaco from 'monaco-editor'
//import styleEditor from './style/Editor.css'
//import imgLoading from './style/loading.gif'
export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      editorRes:'',
      content:"//code here...",
      contentRes:"//Resposta\n",
      language:'javascript',
      theme:'vs-dark',
      response:[],
      msgSavedSucess:false,
      msgSavedFailed:false,
      loadingReponse:false,
      savingQuestion:false,
      loadingEditor:true,
      title:'',
      description:'',
      inputs:'',
      outputs:'',
      redirect:''
    }
  }
  async changeLanguage(e){
    const language = e.target.value;
    const content = this.state.editor.getValue()
    const contentRes = this.state.editorRes.getValue()
    //console.log(' e.target.value: '+language)
    await this.setState({
      language,
      contentRes,
      content
    })
    //console.log('language: '+this.state.language);
    this.handleMount()
  }
  async changeTheme(e){
    const theme = e.target.value;
    const content = this.state.editor.getValue()
    const contentRes = this.state.editorRes.getValue()
    await this.setState({
      theme,
      content,
      contentRes
    })
    this.handleMount()
  }
  async executar(e){
    //console.log(e.target.value);
    const request = {
      codigo : this.state.editor.getValue(),
      linguagem : this.state.language,
      results : this.getResults()
    }
    this.setState({loadingReponse:true})
    try{
      const response = await api.post('/',request)
      this.setState({loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
        this.state.editorRes.setValue('//Respostas...\n'+response.data.info)
        this.setState({response:response.data.results})
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      alert('erro na conexão com o servidor')
    }
    
  }
  getResults(){
    const {inputs,outputs} = this.state
    const entradas = inputs.split('\n')
    const saidas = outputs.split('\n')
    const resultados = []
    for(let i=0 ; i<entradas.length ; i++ ){
      resultados.push({
        inputs: (entradas[i].split(',').map(inp => inp+'\n')).join(''),
        output: saidas[i]
      })
    }
    //console.log(resultados);
    return resultados
  }
  async saveQuestion(e){
    const request = {
      title : this.state.title,
      description : this.state.description,
      results : this.getResults()
    }
    try{
      this.setState({savingQuestion:true})
      const response = await api.post('/question/store',request)
      console.log(response.data)
      if(response.status===200){
        this.setState({
            msgSavedSucess:true,
            savingQuestion:false
        })
      }
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
      this.setState({
        msgSavedFailed:true,
        savingQuestion:false
      })
    }
  }
  async goToQuestions(e){
    e.preventDefault()
    this.setState({redirect:'/'})
  }
  componentDidMount() {
    this.handleLoad();
    //this.handleMount()
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
    console.log('editor montado');
    await this.setState({loadingEditor:false})

    const elementEditor = document.getElementById('monacoEditor')
    elementEditor.innerHTML = ''

    const elementEditorRes = document.getElementById('monacoEditorRes')
    elementEditorRes.innerHTML = ''

    const { language,theme,content,contentRes } = this.state;
    //editor de codigo
    const editor = window.monaco.editor.create(elementEditor, {
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
    //teste
    const editorRes = window.monaco.editor.create(elementEditorRes, {
      value: contentRes,
      language:'javascript',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      scrollBeyondLastColumn:false,
      selectOnLineNumbers:false,
      minimap:{enabled:false},
      overviewRulerBorder:false,
      readOnly:true,
    });
    await this.setState({
      editor:editor,
      editorRes:editorRes

    })
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
    const {response,redirect,msgSavedSucess,savingQuestion,msgSavedFailed ,loadingEditor,loadingReponse,title,description,inputs,outputs} = this.state
    if(redirect){
      return <Redirect to={'/'} exact={true} />
    }
    return (
    <Fragment>
      
          {loadingEditor?<img className="col-6" src={imgLoading} width="70px" />:
        <Fragment>
          <div className='row'>
            <div className ="col-12">
              <div className="form-row">
                <div className="form-group col-md-3">
                  <select className="form-control" onChange={e => this.changeLanguage(e)}>
                    <option value = 'javascript'>JavaScript</option>
                    <option value = 'cpp'>C++</option>
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <select className="form-control" onChange={e => this.changeTheme(e)}>
                    <option value = 'vs-dark'>Visual Studio Dark</option>
                    <option value = 'hc-black'>High Contrast Dark</option>
                    <option value = 'vs'>Visual Studio</option>
                  </select>
                </div>
                <div className="form-group col-md-3">
                  {loadingReponse?
                    <button className="btn btn-primary" disabled>
                      Executando <img src={imgLoading} width="20px" /> 
                    </button>
                    :
                    <button className="btn btn-primary" onClick={e => this.executar(e)}>
                      Executar
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className ="col-12" id='monacoEditor' style={{height:"400px", width:"100%"}}/>
          
            <div className ="col-12" id='monacoEditorRes' style={{height:"400px", width:"100%"}}/>
          </div>
        </Fragment>
        }
        <div className='row'>
          <div id="response" className='col-12'>
                  {response.map((teste,i)=>{
                    return(
                      <table key={i} className="table">
                        <thead >{`${i+1}° Teste`} {teste.isMatch?<span style={{color:'green'}}>certo</span>:<span style={{color:'red'}}>errado</span>}</thead>
                        <tbody>
                          <tr>
                             <td>Entrada(s) para teste</td>
                             <td>Saída esperada</td>
                             <td>Saída do seu programa</td>
                          </tr>
                          <tr>
                            <td>{teste.inputs}</td>
                            <td>{teste.output}</td>
                            <td>{teste.saidaResposta}</td>
                          </tr>
                        </tbody>
                      </table>
                    )
                  })}
          </div>
        </div>
    </Fragment>
    );
  }
}