import React, {Component} from "react";
import pageImg from '../assets/welcome-back-img.png';
import {Link} from "react-router-dom";
import "./onboarding.css"


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canvasURL: '',
            authToken: ''
        };

        this.handleCanvasURL = this.handleCanvasURL.bind(this);
        this.handleAuthToken = this.handleAuthToken.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCanvasURL(event) {
        this.setState({canvasURL : event.target.value});
        sessionStorage.setItem('canvasURL', JSON.stringify(event.target.value));
    }

    handleAuthToken(event) {
        this.setState({authToken : event.target.value});
        sessionStorage.setItem('token', JSON.stringify(event.target.value));
    }

    handleSubmit(event) {
        try {
            event.preventDefault();

            // make an API call here that tests if the enrollment object of a user is type 'TeacherEnrollment'
            // if it runs without any errors, the system will automatically log the user's Canvas URL and access token into session storage
            // if an error occurs, the error will be caught and the user will be auto redirected to the invalid login page

            var removeProtocol = sessionStorage.getItem('canvasURL').replace(/\s+/g,'').trim().replace("https://", '');
            sessionStorage.removeItem('canvasURL');
            sessionStorage.setItem('canvasURL', removeProtocol);

            sessionStorage.removeItem('loggedIn');
            sessionStorage.setItem('loggedIn', true);
            window.location.assign("/home");
        }

        catch (e) {
            // syntax for try/catch: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch 
            
            sessionStorage.clear()
            window.location.assign("/invalid-login");
        }

    }


    render() {

        return (
            <div className="Login">

                {/* display product logo and link it back to current page */}
                <div className="container-fluid">
                    <div id="top-nav">
                        <Link to="/start"><div id="logo">canvas <span style={{color:'#E4060F'}}>tools for teachers</span></div></Link>
                    </div>
                </div>

                <br></br>

                {/* split pane (image on left, text on right) */}
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md my-auto">
                            <img id="side-img" src={pageImg} alt={"Person waving with confetti in the background"}/>
                        </div>
                        
                        <div className="col-md text-center my-auto">
                            <div id="introTxt">
                                <h2>
                                    Connect to Canvas
                                </h2>
                                
                                <br></br>

                                <h4>
                                    Verify user authorization and unlock special integrations with our platform by connecting your Canvas account
                                </h4>

                                <br></br><br></br>

                                <form onSubmit={this.handleSubmit}>
                                    <div className="input-group input-group-lg">
                                        <input required type="url" 
                                                placeholder="Your institution's Canvas URL" 
                                                value={this.state.inputCanvasURL} 
                                                onChange={this.handleCanvasURL}>
                                        </input>
                                    </div>

                                    <div className="input-group input-group-lg">
                                        <input required type="text" 
                                                placeholder="Unique access token" 
                                                value={this.state.inputAuthToken} 
                                                onChange={this.handleAuthToken}>
                                        </input>
                                    </div>

                                    <div>
                                        <button type="submit" 
                                                className="btn btn-primary btn-lg btn-block">
                                            Activate my access</button>
                                    </div>
                                </form>

                                <br></br>
                                <br></br>

                                <h4>
                                    New to Canvas Tools For Teachers?
                                    <br></br>
                                    <Link to='/getting-started'>Learn how to get started</Link>
                                </h4>

                            </div>
                        </div>
                    </div>
                </div>

                <br></br><br></br><br></br>

            </div>
        )
    }
}

export default Login;