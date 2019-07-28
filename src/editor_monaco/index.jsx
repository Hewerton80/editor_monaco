// https://codesandbox.io/s/zlmv909m2x

import React,{Component,Fragment} from "react";
import Editor from "./components/Editor";

export default class MonacoEditor extends Component{

  render(){
    return(
    	<div  className="container">
          <Editor 
            didLoad={this.didLoad} 
            didMount={this.didMount}
          />
        </div>
    )
  }
}

