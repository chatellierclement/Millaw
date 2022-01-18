import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Calendar from "../Calendar/Calendar";
import Login from "../Login/Login";
import { Button } from "react-bootstrap";

export default class App extends React.Component { 

  closeMenuToggle = () => {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("content").classList.toggle("active");
  }  
  
  render() {      
    return (         
        <>  
        <Router>
            <div className="container-fluid">
                <div className="row"> 
                    <div>
                        <div className="vertical-nav" id="sidebar">
                            <div className="py-4 px-3 mb-4 bg-light">
                                <div className="media d-flex align-items-center">
                                    <div className="media-body">
                                        <h2 className="m-0">Millaw</h2>
                                        <h4 className="m-0">Clément Chatellier</h4>
                                        <p className="font-weight-light text-muted mb-0">Web developer</p>
                                    </div>
                                </div>
                            </div>

                            <ul className="nav flex-column mb-0">
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/">
                                        <i className="fa fa-th-large mr-3 text-primary fa-fw"></i>
                                        Calendrier
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">
                                        <i className="fa fa-th-large mr-3 text-primary fa-fw"></i>
                                        Login
                                    </Link>
                                </li>
                            </ul>          
                        </div>
                    </div>
                    
                    <div className="page-content nopadding" id="content">
                        <Button variant="danger" onClick={this.closeMenuToggle}>Menu</Button>
                        <div className="container container_custom">
                            <Routes>
                                <Route path="/" element={<Calendar/>} />
                                <Route path="/login" element={<Login/>} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
        </>
    );
  }
}
