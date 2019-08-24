import React from 'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'

import teste from './screens/teste'

import SistemaAluno from './screens/sistemaAluno'
import SistemaAlunoTurma from './screens/sistemaAlunoTurma'
import SistemaAlunoTurmaLista from './screens/sistemaAlunoTurmaLista'
import SistemaAlunoTurmaListaExecicio from './screens/sistemaAlunoTurmaListaExecicio'

import SistemaProfessorExercicioCriar from './screens/sistemaProfessorExercicioCriar'
import SistemaProfessorExercicioAtualizar from './screens/sistemaProfessorExercicioAtualizar'

export default () => 
	<BrowserRouter>
		<Switch>
			[
				<Route exact
					path=  '/' 
					component = {teste} 
				/>,
				<Route exact
					path=  '/sistema/aluno' 
					component = {SistemaAluno} 
				/>,
				<Route exact
					path=  '/sistema/aluno/turma/:id' 
					component = {SistemaAlunoTurma} 
				/>,
				<Route exact
					path=  '/sistema/aluno/turma/:idTurma/lista/:idLista' 
					component = {SistemaAlunoTurmaLista} 
				/>,
				<Route exact
					path=  '/sistema/aluno/turma/:idTurma/lista/:idLista/exercicio/:idExercicio' 
					component = {SistemaAlunoTurmaListaExecicio} 
				/>,
				<Route exact
					path=  '/sistema/professor/exercicio/criar' 
					component = {SistemaProfessorExercicioCriar} 
				/>,
				<Route exact
					path=  '/sistema/professor/exercicio/:id/atualizar' 
					component = {SistemaProfessorExercicioAtualizar} 
				/>
			]
		</Switch>
	</BrowserRouter>

