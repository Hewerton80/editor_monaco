import React from 'react'
import imgLoading1 from '../assets/loading1.gif'

export default (props) =>{
	const {changeLanguage,changeTheme,executar,loadingReponse} = props
	return(
          <div className="form-row">
            <div className="form-group col-md-3">
              <select className="form-control" onChange={changeLanguage}>
                <option value = 'javascript'>JavaScript</option>
                <option value = 'cpp'>C++</option>
              </select>
             </div>
            <div className="form-group col-md-3">
              <select className="form-control" onChange={changeTheme}>
                <option value = 'vs-dark'>Visual Studio Dark</option>
                <option value = 'hc-black'>High Contrast Dark</option>
                <option value = 'vs'>Visual Studio</option>
              </select>
            </div>
            <div className="form-group col-md-3">
              {loadingReponse?
                <button className="btn btn-primary" disabled>
                   Executando <img src={imgLoading1} width="20px" /> 
                </button>
                :
                <button className="btn btn-primary" onClick={executar}>
                  Executar
                </button>
              }
            </div>
          </div>

	)
}