import React,{Component} from 'react'
import {Redirect} from 'react-router-dom'
import api from './services/api'
import imgLoading from './assets/loading.gif'
import imgLoading1 from './assets/loading1.gif'
import imgLoading2 from './assets/loading2.gif'

export default class Exercicios extends Component{

	state = {
		questions : [],
		redirect:'',
		loadingQuestions:false,
	}
	async componentWillMount(){
		this.getQuestions()
	}
	async getQuestions(){
		try{
			this.setState({loadingQuestions:true})
			const response = await api.get('/question')
			console.log(response.data);
			this.setState({
				questions:response.data,
				loadingQuestions:false
			})
		}
		catch(err){
			this.setState({loadingQuestions:false})
			console.log(err);
		}
		
	}
	async goToQuestion(e,id){
		e.preventDefault()
		this.setState({redirect:`/questao/${id}`})
	}
	/*async goToCreateQuestion(e){
		e.preventDefault()
		this.setState({redirect:'/questaoCriar'})
	}*/
	render(){
		const {questions,redirect,loadingQuestions} = this.state
		/*if(redirect){
			return <Redirect to={redirect} exact={true} />
		}*/
		if(loadingQuestions){
			return(
		        <div className="container text-center">
		          <br/><br/><br/><img src={imgLoading} width="300px" />
		        </div>
            )
        }
        else
		return(
			<div className="container">
				<div className='row'>
					<div className="col-8 text-left">
		                <table className="table">
		  					<tbody>
			                    <tr>
			                    	<td>
			                    		<p><a href='/questaoCriar' ><b>Criar exercício</b></a></p>
			                    	</td>
			                    </tr>
			                    <tr>
			                    	<td>
			                    		<h1>Exercícios</h1>
			                    	</td>
			                    </tr>
		                    	{questions.map((question,i) =>
									<tr key={i}>
										<td>
				                            <a href={`/questao/${question._id}`}> 
				                            	<p>{` ${i+1} - ${question.title}`}</p>
				                            </a>
			                            </td>
			                        </tr>
		                    	)}
		                    </tbody>
		                </table>
		            </div>
		        </div>
			</div>

		)
	}
}