import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import api from '../services/api'
import imgLoading from '../assets/loading.gif'
import TemplateSistema from "../componentes/templates/sistema.template";

export default class Aluno extends Component{

	state = {
		minhasTurmas:[],
		turmas : [],
		redirect:false,
		loadingMinhasTurmas:false,
		loadingTurmas:false,
		idTurma:''
	}
	componentWillMount(){
		this.getInfoUser()
		this.getTurmas()

	}
	async getInfoUser(){
		try{
			this.setState({loadingMinhasTurmas:true})
			const response = await api.get('/user/info/profile')
			console.log('user:');
			console.log(response.data)
			this.setState({
				minhasTurmas:response.data.classes,
				loadingMinhasTurmas:false
			})
		}
		catch(err){
			this.setState({loadingMinhasTurmas:false})
			console.log(err);
		}
	}
	async getTurmas(){
		try{
			this.setState({loadingTurmas:true})
			const response = await api.get('/class')
			//console.log(response.data);
			this.setState({
				turmas:response.data,
				loadingTurmas:false
			})
		}
		catch(err){
			this.setState({loadingTurmas:false})
			console.log(err);
		}
	}
	render(){
		let {minhasTurmas,turmas,redirect,loadingTurmas,loadingMinhasTurmas} = this.state
		let turmasProv = []
		let isInclude = false
		for(let i=0;i<turmas.length;i++){
			for(let j=0;j<minhasTurmas.length;j++){
	            if(turmas[i]._id===minhasTurmas[j]._id) 
	            	isInclude=true;
	        }
	        if(!isInclude) 
	        	turmasProv.push(turmas[i]) ;
	        isInclude= false
        }
        turmas = turmasProv;
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
		console.log(loadingTurmas,loadingMinhasTurmas);
		if(''/*loadingTurmas || loadingMinhasTurmas*/){
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
            		<h1>Turmas abertas ({turmas.length})</h1>
				</div>
                {turmas.map((turma, index) => 
                    <div key={index} className="col-6">
                        <div className="card">
                            <h5 className="card-header">Nome: {turma.name}</h5>
                            <div className="card-body">
                                <h5 className="">Ano: {turma.year}.2{turma.semester}</h5>
                                <hr></hr>
                                <p className="card-text">Descrição: {turma.description}</p>
                                <a href="#" style={botaoV} className="btn btn-primary">Solicitar Acesso</a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TemplateSistema>
		)
	}
}