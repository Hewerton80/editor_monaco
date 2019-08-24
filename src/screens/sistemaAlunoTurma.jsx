import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import api from '../services/api'
import imgLoading from '../assets/loading.gif'
import TemplateSistema from "../componentes/templates/sistema.template";

export default class AlunoTurma extends Component{


	constructor(props){
		super(props)
		this.state = {
			listas : [],
			turma:'',
			redirect:false,
			loadingLists:false,
		}
		this.idTurma = this.props.match.params.id
	}
	async componentWillMount(){
		
		try{
			this.setState({loadingLists:true})
						
			const response = await api.get(`/class/${this.idTurma}`)
			console.log(response.data);
			this.setState({
				turma:response.data,
				listas:response.data.listsQuestions,
				loadingLists:false
			})
		}
		catch(err){
			this.setState({loadingLists:false})
			console.log(err);
		}
	}

	render(){
		const {turma,listas,redirect,loadingLists} = this.state
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
		if(loadingLists){
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
            		<h1>listas</h1>
				</div>
                {listas && listas.map((lista, index) => (
                    <div key={index} className="col-6">
                        <div className="card">
                            <h5 className="card-header">{lista.title}</h5>
                            <div className="card-body">
                                <p className="card-text">{listas.length} {listas.length==1?'Questão':'Questões'}</p>
                                <a href={`/sistema/aluno/turma/${this.idTurma}/lista/${lista._id}`} style={botaoV} className="btn btn-primary">Ver questões</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TemplateSistema>
		)
	}
}