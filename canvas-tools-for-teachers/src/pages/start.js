import React, {Component} from "react";
import pageImg from '../assets/start-img.png';
import {Link} from "react-router-dom";

import "./onboarding.css";


class Start extends Component {

    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
     }
    
     componentDidMount() {
        window.addEventListener('load', this.handleLoad);
     }
    
     componentWillUnmount() { 
       window.removeEventListener('load', this.handleLoad)  
     }
    
     handleLoad() {
        sessionStorage.clear();
        sessionStorage.setItem('loggedIn', false);
    }

    render() {
        return (
            <div className="Start">

                <div className="introduction">

                    <div className="container">
                        <div className="row">
                            <div className="col text-center my-auto">
                                <div id="logo">canvas <span style={{color:'#E4060F'}}>tools for teachers</span></div>

                                <br></br>

                                <div id="headline">
                                    Power your success in the learning ecosystem
                                </div>

                                <br></br>

                                <h4>
                                    Canvas Tools For Teachers provides solutions that make teaching within the Canvas LMS more efficient and intuitive.
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                <br></br>
                <br></br>

                    <img id="img" src={pageImg} alt={"3D graphics showcasing data visualizations"}/>

                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <div className="container">
                    <div className="row">
                        <div className="col text-center my-auto">
                            <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => window.location.assign("/getting-started")}>
                                How do I get started?
                            </button>
                        </div>
                        <div className="col text-center my-auto">
                            <button type="button" class="btn btn-outline-primary btn-lg btn-block" onClick={() => window.location.assign("/login")}>
                                I'm a returning user
                            </button>
                        </div>
                    </div>
                </div>

                <br></br>

                <div className="container">
                    <div className="row">
                        <div className="col text-center my-auto">
                            <Link to="#" onClick={() => window.location.assign("/home")}><h4>Just exploring, I want to see what's available to me</h4></Link>
                        </div>
                    </div>
                </div>

            <br></br>



            </div>
        )
    }
}

export default Start;