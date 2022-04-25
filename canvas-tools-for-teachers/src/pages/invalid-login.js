import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./onboarding.css"

// This page will be rendered if the user enters invalid input for login reqs in "Getting Started" and "Login"

class InvalidLogin extends Component {

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
        // if(this.state.loggedIn){
        //     return <Navigate   to="/home" />
        // }
        
        return (
            <div className="InvalidLogin">

                {/* display product logo and link it back to current page */}
                <div className="container-fluid">
                    <div id="top-nav">
                        <Link to="/start"><div id="logo">canvas <span style={{color:'#E4060F'}}>tools for teachers</span></div></Link>
                    </div>
                </div>

                <br></br>
                <br></br>
                <br></br>
                <br></br>

                <div className="container">
                    <div className="row">
                        <div className="col my-auto text-center">

                                <h2>
                                    Connect to Canvas
                                </h2>
                                
                                <br></br>

                                <h4>
                                    Verify user authorization and unlock special integrations with our platform by connecting your Canvas account
                                </h4>

                                <br></br><br></br>

                        </div>
                    </div>
                </div>
                

                <div className="container">
                    <div className="row">
                        <div className="col my-auto">

                                <div className="card border-0">
                                    <div className="card-body">
                                        <p>
                                            Sorry, looks like the Canvas URL and/or access token you entered is invalid.
                                            <Link to='#' data-toggle="modal" data-target="#exampleModalCenter" style={{color: "black"}}> <u>Can we help you recover these items?</u></Link>
                                        
                                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                <div class="modal-dialog modal-dialog-centered" role="document">
                                                    <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="exampleModalLongTitle">Recover your access keys</h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p>
                                                            Oops! Looks like you entered an invalid Canvas URL and/or access token. To resolve this issue, consider the following cases:
                                                            <br></br>

                                                            <hr></hr>
                                                            <b>Your inputted Canvas URL must follow one of the two structures (and be sure to include the 'https://" header):</b>
                                                            <br></br>
                                                            <br></br>
                                                            <ul>
                                                                <li>
                                                                    [your institution’s name].instructure.com
                                                                </li>
                                                                <li>
                                                                    canvas.[your institution’s domain]
                                                                </li>
                                                            </ul>
                                                            (example) https://myschool.instructure.com/

                                                            <br></br>
                                                            <hr></hr>
                                                            <b>
                                                            Your access token may have expired. 
                                                            Please visit your Canvas profile settings (scroll to "Approved Integrations") to generate a new token.
                                                            </b>

                                                            <br></br>
                                                            <hr></hr>
                                                            Note that our system's features only support instructors who manage student learning within the Canvas learning management system. 
                                                            Please consult the departmental IT staff at your school to confirm the role and permissions level of your Canvas account. 
                                                            Your role must be registered as 'Teacher' under your Canvas account in order to access the tools provided on our platform.

                                                        </p>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        
                                        </p>
                                    </div>
                                </div>

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
                                            Log in</button>
                                    </div>
                                </form>

                                <br></br>
                                <br></br>

                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col text-center my-auto">

                                <h4>
                                    New to Canvas Tools For Teachers?
                                    <br></br>
                                    <Link to='/getting-started'>Learn how to get started</Link>
                                </h4>


                        </div>
                    </div>
                </div>

                <br></br>
                <br></br>

            </div>
        )
    }
}

export default InvalidLogin;