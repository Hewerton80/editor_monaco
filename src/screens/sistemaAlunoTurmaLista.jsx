import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import api from '../services/api'
import imgLoading from '../assets/loading.gif'
import TemplateSistema from "../componentes/templates/sistema.template";

export default class AlunoTurmaLista extends Component{


	constructor(props){
		super(props)
		this.state = {
			questions : [],
			turma:'',
			redirect:false,
			loadingQuestions:false,
		}
		this.idTurma = this.props.match.params.idTurma
		this.idLista = this.props.match.params.idLista
	}
	async componentWillMount(){
		
		try{
			this.setState({loadingQuestions:true})
						
			const response = await api.get(`/listQuestion/${this.idLista}`)
			console.log(response.data);
			this.setState({
				listQuestion:response.data,
				questions:response.data.questions,
				loadingQuestions:false
			})
		}
		catch(err){
			this.setState({loadingQuestions:false})
			console.log(err);
		}
	}

	render(){
		const {turma,questions,redirect,loadingQuestions} = this.state
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
		if(loadingQuestions){
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
            	<div className="col-12 text-center">
            		<h1>Exercícios</h1>
				</div>
                {questions && questions.map((question, index) => (
                    <div key={index} className="col-6">
                        <div className="card">
                            <h5 className="card-header">{question.title}</h5>
                            <div className="card-body">
                                <p className="card-text">{question.description}</p>
                                <a href={`/sistema/aluno/turma/${this.idTurma}/lista/${this.idLista}/exercicio/${question._id}`} style={botaoV} className="btn btn-primary">Visualizar</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TemplateSistema>
		)
	}
}