import React from "react";
export default props => {
    return (
        <div className="page">
          <div className="page-main">
            <div className="header py-4">
            </div>
            <div className="my-3 my-md-5">
              <div className="container">
                <div className="page-header">
                  <h1 className="page-title"> </h1>
                </div>
                {props.children}
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="container">
              <div style={{ textAlign: "center" }}>
                Plataforma LOP. Universidade Federal do Rio Grande do Norte
                2019.
              </div>
            </div>
          </footer>
        </div>
    );
  }