import React from 'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import CriarQuestao from './criarExercicio'
import AtualizarQuestao from './atualizarExercicio'
import Exercicios from './listaExercicios'
import Exercicio from './exercicio'


export default () => 
	<BrowserRouter>
		<Switch>
			[
				<Route exact
					path=  '/' 
					component = {Exercicios} 
				/>,
				<Route exact
					path=  '/questao/:id' 
					component = {Exercicio} 
				/>,
				<Route exact
					path=  '/questaoCriar' 
					component = {CriarQuestao} 
				/>,
				<Route exact
					path=  '/atualizarQuestao/:id' 
					component = {AtualizarQuestao} 
				/>
			]
			
		</Switch>
	</BrowserRouter>

