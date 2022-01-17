import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.css';
import './Login.css';

export default class Login extends React.Component { 
  
  constructor(props) {
    super(props);
    
    
    //Binding des evenements
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (event) => {
    
    event.preventDefault()

    let user = {
      id: 1,
      lastName: "CHATELLIER",
      firstName: "Clément",
      role: {
        id: 1,
        libelle: "admin"
      }
    }

    localStorage.setItem("user", JSON.stringify(user));

  }  

  render() {      
    return (
      <>
        <div className='container'>
          <div className="wrapper fadeInDown">
            <div id="formContent">
              <div id="formHeader">
                <span>Connexion</span>
              </div>
              <form onSubmit={this.handleSubmit}>  
                <input type="text" id="login" className="second" name="login" placeholder="login"/>
                <input type="text" id="password" className="third" name="login" placeholder="password"/>                            
                <input type="submit" className="btn btn-primary" value="Se connecter" />
              </form>

              <div id="formFooter">
                <a className="underlineHover" href="#">Forgot Password?</a>
              </div>
            </div>
          </div>
        </div>
      </>
    );    
  }  
}
