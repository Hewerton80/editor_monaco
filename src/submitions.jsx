import React,{Component,Fragment} from 'react'


//https://microsoft.github.io/monaco-editor/
//https://blog.expo.io/building-a-code-editor-with-monaco-f84b3a06deaf?gi=2ca51a1183
//https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/32
import * as monaco from 'monaco-editor';
import MonacoEditor from 'react-monaco-editor';
import '../node_modules/monaco-editor/min/vs/editor/editor.main.css'
export default class Monaco extends Component{
	constructor(props){
		super(props)
		this.state = {
			content : ["function hello(){\n\tconsole.log('ola mundo')}","#include <iostream>"].join('\n'),
			language:'javascript'
		}
	}

	componentDidMount(editor, monaco) {
	    console.log('editorDidMount', editor);
	    //editor.focus();
		/*console.log(this.props);
		const IEditorConstructionOptions = {
			value: "// First line\nfunction hello() {\n\talert('Hello world!');\n}\n// Last line",
			language: "javascript",
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
			theme: "vs-dark",
	    	
		}
		const model = monaco.editor.createModel('//ola', 'javascript', this.props.path);
    	this._editor = monaco.editor.create(document.getElementById('monacoEditor'),IEditorConstructionOptions)
    	this._editor.setModel(model)*/
 	}
 	handlerLanguage(e){
 		console.log(e.target.value);
 		const language = e.target.value
 		this.setState({language:language})

 	}
	editorDidMount(editor, monaco) {
    	console.log('editorDidMount', editor);
    	editor.focus();
	}
	handlerContent(newValue, e) {
    	//console.log('handlerContent', newValue, e);
    	this.setState({content:newValue})
    	console.log(this.state.content);
	}

	render() {
    	const {content,language} = this.state;
	    const options = {
			roundedSelection: false,
			scrollBeyondLastLine: false,
			readOnly: false,
	    };
	    return (
	
	    	<Fragment>
	    		<select onChange={e => this.handlerLanguage(e)}>
	    			<option value = 'javascript'>javascript</option>
	    			<option value = 'cpp'>cpp</option>
	    		</select>
	    		{/*<div id='monacoEditor' style={{height: '500px',width:'500px'}}>
	    		</div>*/}
		    	<MonacoEditor
		        	width="800"
		        	height="600"
		        	language={language}
		        	theme="vs-dark"
		        	value={content}
		        	options={options}
		        	onChange={(newVal,e) => this.handlerContent(newVal,e)}
		        	editorDidMount={this.editorDidMount}
		      	/>
	    	</Fragment>
   	 	)
 	}
}
