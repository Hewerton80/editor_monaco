import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from './services/api'
//import * as monaco from 'monaco-editor'
import styleEditor from './assets/Editor.css'
import imgLoading from './assets/loading.gif'
import imgLoading1 from './assets/loading1.gif'
import imgLoading2 from './assets/loading2.gif'
export default class Editor extends Component {
  // @todo: Use typescript to handle propTypes via monaco.d.ts
  // (https://github.com/Microsoft/monaco-editor/blob/master/monaco.d.ts):
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      editorRes:'',
      content:"//code here...",
      contentRes:"",
      language:'javascript',
      theme:'vs-dark',
      response:[],
      percentualAcerto:'',
      loadingReponse:false,
      loadingEditor:true,
      title:'',
      description:'',
      results:'',
      inputs:'',
      outputs:'',
      redirect:'',
      showErro:false
    }
  }
  componentWillMount(){
    this.mountScreen()
  }

  componentDidMount() {
    this.handleLoad();
    //this.handleMount()
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
    }
    const id = this.props.match.params.id
    this.setState({loadingReponse:true})
    try{
      const response = await api.post(`/submission/${id}`,request)
      this.setState({loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
       
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          contentRes:response.data.info,
          showErro:response.data.showErro,
          content: this.state.editor.getValue()
        })
        this.handleMount()
        
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      this.setState({
        content: this.state.editor.getValue()
      })
      this.handleMount()
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


  async mountScreen(){
    const id = this.props.match.params.id
    try{
      const response = await api.get(`/question/${id}`)
      console.log(response.data);
      this.setState({
        title:response.data.title,
        description:response.data.description,
        results:response.data.results,
      })
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
    }
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

    const { language,theme,content,contentRes,showErro } = this.state;
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
    await this.setState({editor:editor})

    if(showErro){
      const elementEditorRes = document.getElementById('monacoEditorRes1')
      elementEditorRes.innerHTML = ''
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
      await this.setState({editorRes:editorRes})
    }
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
    const {response,redirect,showErro,percentualAcerto,loadingEditor,loadingReponse,title,description,inputs,outputs,results} = this.state
    if(redirect){
      return <Redirect to={'/'} exact={true} />
    }
    if(loadingEditor){
      return(
        <div className="container text-center">
          <br/><br/><br/><img src={imgLoading} width="300px" />
        </div>
      )
    }
    else{
    return (
    <div className="container">
        <div className='row'>
          <div className ="col-12">
            <div className="card">
              <div className="card-header">
                <h3>{title}</h3>
              </div>
              <div className="card-body">
                <p className="card-text">{description}</p>
              </div>
              <div className="card-footer">
                <div className="form-row">
                  <div className="form-group col-md-3">
                    <h4>Exemplos</h4>
                  </div>
                  <div className="form-group col-md-9 text-right">
                    <a href={`/atualizarQuestao/${this.props.match.params.id}`}>Editar questão</a>
                  </div>
                </div>
                
                  <table className="table">
                   <tbody>
                     <tr>
                       <td><b>Exemplo de entrada</b></td>
                       <td><b>Exemplo de saída</b></td>                       </tr>
                        {results.map((result,i)=>                          <tr key={i}>
                          <td>{result.inputs.split('\n').map((v,i) => <Fragment key={i}>{v}<br/></Fragment>)}</td>
                          <td>{result.output.split('\n').map((v,i) => <Fragment key={i}>{v}<br/></Fragment>)}</td>
                        </tr>
                      ).filter((result,i) => i<3)}
                    </tbody>
                  </table>
              </div>
            </div>
          </div>
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
               <div className="form-group col-md-3 ">
                 {loadingReponse?
                   <button className="btn btn-primary btn-block" disabled>
                    Executando <img src={imgLoading1} width="20px" /> 
                   </button>
                   :
                   <button className="btn btn-primary btn-block" onClick={e => this.executar(e)}>
                     Executar
                   </button>
                 }
               </div>
               <div className="form-group col-md-3">
                  <button className="btn btn-primary btn-block" disabled>
                     Submeter 
                   </button>
               </div>
             </div>
           </div>
         </div>
         <div className='row'>
           <div className="card" className ="col-12">
             <div  id='monacoEditor' style={{height:"400px", width:"100%"}}/>
           </div>


         </div>
        <div className='row'>
          <div className="card" className ="col-12">
            <h3>Resultados:</h3>
          </div>
          {loadingReponse?
           <div className="card" className ="col-12 text-center">
              <img src={imgLoading2} width="300px" />           
           </div>:
           <Fragment>
            {showErro?
              <div className="card" className ="col-12">
                <div id='monacoEditorRes1' style={{height:"200px", width:"100%"}}/>
              </div>
            :''
            }
            {response.length>0?
            <div className="card" className ="col-12">
              <table className="table" wrap="off">
                <tbody>
                  <tr>
                    <td>Percentual de acerto: {percentualAcerto + ' %'}</td>
                  </tr>
                  <tr>
                    <td><b>N° teste</b></td>
                    <td><b>Resposta</b></td>
                    <td><b>Entrada(s) para teste</b></td>
                    <td><b>Saída do seu programa</b></td>
                    <td><b>Saída esperada</b></td>            
                  </tr>
                  {response.map((teste,i)=>
                    <tr key={i}>
                      <td>{`${i+1}° Teste`} </td>
                      <td>{teste.isMatch?<span style={{color:'green'}}>Correta</span>:<span style={{color:'red'}}>Errado</span>}</td>
                      <td>{teste.inputs.split('\n').map((v,i) => <Fragment key={i}>{v}<br/></Fragment>)}</td>
                      <td>{teste.saidaResposta.split('\n').map((v,i) => <Fragment key={i}>{v}<br/></Fragment>)}</td>
                      <td>{teste.output.split('\n').map((v,i) => <Fragment key={i}>{v}<br/></Fragment>)}</td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            :''}
          </Fragment>
          }
        </div>
    </div>
    );
    }
  }
}