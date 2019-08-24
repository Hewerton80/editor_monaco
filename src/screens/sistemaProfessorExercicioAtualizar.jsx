import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
//import PropTypes from "prop-types";
import api from '../services/api'
import apiCompiler from '../services/apiCompiler'

//import * as monaco from 'monaco-editor'
import TableResults from '../componentes/tableResults'
import FormExercicio from '../componentes/formExercicio'
import FormSelect from '../componentes/formSelect'
import styleEditor from '../assets/Editor.css'
import imgLoading from '../assets/loading.gif'
import imgLoading1 from '../assets/loading1.gif'
import imgLoading2 from '../assets/loading2.gif'

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
  async componentWillMount(){
    console.log('---will mount-----');
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
  componentDidMount() {
    this.handleLoad();
    //this.handleMount()
  }
  //-----------------funções para carregar o editor---------------------//
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
  //--------------------------------------------------------------//
  async handleTitleChange(e){
      this.setState({
        title:e.target.value
      })
  }
  async handleDescriptionChange(e){
      this.setState({
        description:e.target.value
      })
  }
  async handleInputsChange(e){
      this.setState({
        inputs:e.target.value
      })
  }
  async handleOutputsChange(e){
      this.setState({
        outputs:e.target.value
      })
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
      const response = await apiCompiler.post('/submission/exec',request)
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
     console.log('results');
    for(let i=0 ; i<results.length ; i++ ){

      console.log(results[i]);
      inputs.push(results[i].inputs.slice(0,-1).split('\n').join(','))
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
          <h4><a href='/sistema/professor/exercicio/criar' >Criar novo exercicio</a></h4>
        </div>
        <div className="col-12 text-center">
          <h2>Atualização de questão</h2>
        </div>
      </div>
      <FormExercicio
        title={title}
        description={description}
        inputs={inputs}
        outputs={outputs}
        handleTitleChange={this.handleTitleChange.bind(this)}
        handleDescriptionChange={this.handleDescriptionChange.bind(this)}
        handleInputsChange={this.handleInputsChange.bind(this)}
        handleOutputsChange={this.handleOutputsChange.bind(this)}
      />
      <FormSelect
        loadingReponse={loadingReponse}
        changeLanguage={this.changeLanguage.bind(this)}
        changeTheme={this.changeTheme.bind(this)}
        executar={this.executar.bind(this)}
      />
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
        <div className='row'>
          <div className="card" className ="col-12">
              <TableResults 
                response={response}
                percentualAcerto={percentualAcerto}
              />
            </div>
        </div>

        {msgSavedSucess?
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Questão atualizada com sucesso :)
          <button onClick={e => this.setState({msgSavedSucess:false})} type="button" className="close" data-dismiss="alert">
            <span >&times;</span>
          </button>
        </div>:''}

        {msgSavedFailed?
        <div className="alert alert-warning  alert-dismissible fade show" role="alert">
          Questão não pôde ser atualizada :(
          <button onClick={e => this.setState({msgSavedFailed:false})} type="button" className="close" data-dismiss="alert">
            <span>&times;</span>
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