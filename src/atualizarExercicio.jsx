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
      percentualAcerto:'',
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
      const response = await api.post('/submission/test',request)
      this.setState({loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          contentRes:'//Respostas...\n'+response.data.info,
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
        output: saidas[i].split('|').join('\n')
      })
    }
    //console.log(resultados);
    return resultados
  }
  getInputsAndOutpus(results){
    let inputs=[]
    let output=[]
    for(let i=0 ; i<results.length ; i++ ){
      console.log(results[i]);
      inputs.push(results[i].inputs.split('\n').join(','))
      output.push(results[i].output.split('\n').join('|'))
    }
    
    console.log('----');
    inputs = inputs.join('\n')
    output = output.join('\n')
    console.log(inputs);
    /*console.log('----');
    console.log(output);*/
    return [inputs,output]
  }

  async updateQuestion(e){
    const request = {
      title : this.state.title,
      description : this.state.description,
      results : this.getResults()
    }
    try{
      const id = this.props.match.params.id
      this.setState({savingQuestion:true})
      const response = await api.put(`/question/update/${id}`,request)
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
  async mountScreen(){
    const id = this.props.match.params.id
    try{
      const response = await api.get(`/question/${id}`)
      console.log(response.data);
      const [inputs,outputs] = this.getInputsAndOutpus(response.data.results)
      this.setState({
        title:response.data.title,
        description:response.data.description,
        inputs:inputs,
        outputs:outputs
      })
    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
    }
  }
  componentWillMount(){
    this.mountScreen()
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
    const {percentualAcerto,response,redirect,msgSavedSucess,savingQuestion,msgSavedFailed ,loadingEditor,loadingReponse,title,description,inputs,outputs} = this.state
    /*if(redirect){
      return <Redirect to={'/'} exact={true} />
    }*/
    
    if(loadingEditor){
      return(
        <div className="container text-center">
          <br/><br/><br/><img src={imgLoading} width="300px" />
        </div>
      )
    }
    else
    return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h4><a href='/' >Ir para tela de exercícios</a></h4>
        </div>
        <div className="col-12 text-center">
          <h2>Atualização de questão</h2>
        </div>
      </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label>Título: </label>
              <input onChange={e => {this.setState({title:e.target.value})}} className="form-control" placeholder="Digite o título da questão..." value={title}/>
            </div>
            <div className="form-group col-md-12">
              <label>Enunciado:  </label>
              <textarea onChange={e => {this.setState({description:e.target.value})}} style={{height:'150px'}} className="form-control" value={description}></textarea> 
            </div>
            <div className="form-group col-md-12">
              <label>Entradas para testes: </label>
              <textarea onChange={e => {this.setState({inputs:e.target.value})}} style={{height:'150px'}} className="form-control" wrap="off" value={inputs}></textarea> 
            </div>
            <div className="form-group col-md-12">
              <label>Saídas para testes: </label>
              <textarea onChange={e => {this.setState({outputs:e.target.value})}} style={{height:'150px'}} className="form-control" wrap="off" value={outputs}></textarea> 
            </div>
          </div>
        <Fragment>
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
                   Executando <img src={imgLoading1} width="20px" /> 
                </button>
                :
                <button className="btn btn-primary" onClick={e => this.executar(e)}>
                  Executar
                </button>
              }
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <div id='monacoEditor' style={{height:"400px", width:"100%"}}/>
            </div>
           {loadingReponse?
           <div className="card" className ="col-6 text-center">
              <img src={imgLoading2} width="300px" />           
           </div>:
           <div className="card" className ="col-6">
             <div id='monacoEditorRes' style={{height:"400px", width:"100%"}}/>
           </div>
           }
          </div>
        </Fragment>
        <div className='row'>
          {response.length>0?
          <div className="card" className ="col-12">
            <table className="table">
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
                    <td>{teste.inputs.split('\n').map(v => <Fragment>{v}<br/></Fragment>)}</td>
                    <td>{teste.saidaResposta.split('\n').map(v => <Fragment>{v}<br/></Fragment>)}</td>
                    <td>{teste.output.split('\n').map(v => <Fragment>{v}<br/></Fragment>)}</td>
                  </tr>
                  )}
              </tbody>
            </table>
          </div>
          :''}
        </div>

        {msgSavedSucess?
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Questão salva com sucesso :)
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>:''}

        {msgSavedFailed?
        <div className="alert alert-warning  alert-dismissible fade show" role="alert">
          Questão não Pôde ser salva :(
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>:''}

        {savingQuestion?
          <button id="save" type="button" className="btn btn-primary btn-lg btn-block" disabled>Salvando</button>
        :
          <button id="save" onClick={e => this.updateQuestion(e)} type="button" className="btn btn-primary btn-lg btn-block">Atualizar</button>        
        }
    </div>
    );
  }
}