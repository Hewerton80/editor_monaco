import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import api from '../services/api'
import imgLoading from '../assets/loading.gif'
import TemplateSistema from "../componentes/templates/sistema.template";
import NavPagination from "../componentes/navPagination";
import Swal from 'sweetalert2'

const botao = {
    borderRadius: "50%",
    fontSize: "50px",
    height: "100px",
    width: "100px",
    border: "solid 1px"
}

const botaoV = {
    float: "right"
}

const estilo = {
    justifyContent: 'center',
    alignItems: 'center',
    background: "0",
    border: "0",
    display: "flex",
    position: "relative"
}
export default class Aluno extends Component{
	constructor(props){
		super(props)
		this.state = {
			minhasTurmas:[],
			turmas : [],
			numPageTurmasAbertas:1,
			totalTumasAbertas:0,
			totalPages:0,
			solicitando:'',
			redirect:false,
			loadingMinhasTurmas:false,
			turmasSolicitadas:[],
			loadingTurmas:false,
			idTurma:''
		}
		this.handlePage=this.handlePage.bind(this)

	}
	componentWillMount(){
		this.getInfoUser()
		this.getTurmas()
	}
	async getInfoUser(){
		try{
			//this.setState({loadingMinhasTurmas:true})
			const response = await api.get('/user/info/profile')
			console.log('user:');
			console.log(response.data)
			this.setState({
				minhasTurmas:response.data.classes,
				turmasSolicitadas:response.data.requestedClasses,
				//loadingMinhasTurmas:false
			})
		}
		catch(err){
			this.setState({loadingMinhasTurmas:false})
			console.log(err);
		}
	}
	async getTurmas(){
		try{
			//this.setState({loadingTurmas:true})
			const response = await api.get(`/class/open/page/${this.state.numPageTurmasAbertas}`)
			console.log(response.data);
			let totalTurmasAbertas = response.data.totalDocs
			let turmas = response.data.docs
			let turmasProv = []
			let isInclude = false

			this.setState({
				turmas:turmas,
				totalTumasAbertas:totalTurmasAbertas,
				totalPages:response.data.totalPages
				//loadingTurmas:false
			})
		}
		catch(err){
			this.setState({loadingTurmas:false})
			console.log(err);
		}
	}
	async handlePage(e,numPage){
		e.preventDefault()
		console.log(numPage);
		await this.setState({numPageTurmasAbertas:numPage})
		this.getTurmas()
	}
	async solicitarAcesso(id){
		console.log('evento');

		try{
			//this.setState({solicitando:'disabled'})
			Swal.fire({
				title:'Processando solicitação',
				allowOutsideClick:false,
				allowEscapeKey:false,
				allowEnterKey:false
			})
			Swal.showLoading()
			const response = await api.put(`/user/request/class/${id}`)
			console.log(response);
			this.getTurmas()
			this.getInfoUser()
			Swal.hideLoading()
			Swal.fire({
			  	type: 'success',
			  	title: 'Solicitação feita com sucesso!',
			})
			//this.setState({solicitando:''})
		}
		catch(err){
			Swal.hideLoading()

			Swal.fire({
			  	type: 'error',
			  	title: 'ops... Falha ao tentar fazer solicitação',
			})
			//this.setState({solicitando:''})

		}
	}
	async cancelarSolicitacao(id){
		console.log(id);
		try{
			//this.setState({solicitando:'disabled'})
			Swal.fire({
				title:'Cancelando Solicitação',
				allowOutsideClick:false,
				allowEscapeKey:false,
				allowEnterKey:false
			})
			Swal.showLoading()
			const response = await api.put(`/user/removeRequest/class/${id}`)
			Swal.hideLoading()
			Swal.fire({
			  	type: 'success',
			  	title: 'Solicitação cancelada!',
			})
			console.log(response);
			this.getInfoUser()
			this.getTurmas()
			await this.setState({solicitando:''})
		}
		catch(err){
			Swal.hideLoading()
			Swal.fire({
			  	type: 'error',
			  	title: 'ops... Erro ao cancelar solicitação',
			})
			//this.setState({solicitando:''})

		}	
	}
	render(){
		const {solicitando,totalPages,numPageTurmasAbertas,totalTumasAbertas,turmasSolicitadas} = this.state
		const {minhasTurmas,turmas,redirect,loadingTurmas,loadingMinhasTurmas} = this.state

		if(loadingTurmas || loadingMinhasTurmas){
			return(
		        <div className="container text-center">
		          <br/><br/><br/><img src={imgLoading} width="300px" />
		        </div>
            )
        }
        else
		return(
		<TemplateSistema>
			<div className="row">
            	<div className="col-12">
            		<h1>Minhas Turmas ({minhasTurmas.length})</h1>
				</div>
                {minhasTurmas.map((turma, index) => (
                    <div key={index} className="col-6">
                        <div className="card">
                            <h5 className="card-header">Nome: {turma.name}</h5>
                            <div className="card-body">
                                <h5 className="">Ano: {turma.year}.2{turma.semester}</h5>
                                <hr></hr>
                                <p className="card-text">Descrição: {turma.description}</p>
                                <a href={`/sistema/aluno/turma/${turma._id}`} style={botaoV} className="btn btn-primary">Entrar</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

			<div className="row">
            	<div className="col-12">
            		<h1>Turmas abertas ({totalTumasAbertas})</h1>
				</div>
                {turmas.map((turma, index) => {
                	let jaSolicitou = false
                	let jaParticipa = false
                	for(let i=0;i<turmasSolicitadas.length;i++){
                		if(turmasSolicitadas[i]._id===turma._id){
                			jaSolicitou = true
                			break;
                		}
                	}
                	for(let i=0;i<minhasTurmas.length;i++){
                		if(minhasTurmas[i]._id===turma._id){
                			jaParticipa = true
                			break;
                		}
                	}
                	return(
                    <div key={index} className="col-6">
                        <div className="card">
                            <h5 className="card-header">Nome: {turma.name}</h5>
                            <div className="card-body">
                                <h5 className="">Ano: {turma.year}.2{turma.semester}</h5>
                                <hr></hr>
                                <p className="card-text">Descrição: {turma.description}</p>
                                {jaParticipa?
                                <button style={botaoV} className="btn btn-success" disabled>Já sou participante</button>
                                :
                                jaSolicitou?
                                <button style={botaoV} onClick={()=>this.cancelarSolicitacao(turma._id)} className="btn btn-danger" >Cancelar solicitação</button>
                                :
                                <button style={botaoV} onClick={()=>this.solicitarAcesso(turma._id)} className="btn btn-primary">Solicitar Acesso</button>
                            	}
                            </div>
                        </div>
                    </div>
                    )

                })}
            </div>
            <NavPagination
            	totalPages={totalPages}
            	pageAtual={numPageTurmasAbertas}
            	handlePage={this.handlePage}
            />
        </TemplateSistema>
		)
	}
}