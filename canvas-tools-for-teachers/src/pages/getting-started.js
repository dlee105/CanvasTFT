import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./onboarding.css"


class GettingStarted extends Component {

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
            <div className="GettingStarted">

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
                <br></br>

 
                <div className="container">
                    <div className="row">
                        <div className="col text-center my-auto">
                            <h2>Find solutions that enhance your teaching experience</h2>
                        </div>
                    </div>
                </div>


                <br></br>
                <br></br>

                <div id="cards">

                    <div className="container">
                        <div className="row">
                            <div className="col my-auto">

                            <form onSubmit={this.handleSubmit}>
                                <div className="card border-0">
                                    <div className="card-header text-center">
                                        <p>Getting Started</p>
                                    </div>

                                    <div className="card-body">
                                        <br></br>
                                        <p>Returning user? Skip the steps and connect <Link to='/login'>here</Link>
                                        <br></br>
                                        <br></br>
                                        Welcome to Canvas Tools For Teachers! Our learning technology hub works to serve instructors by providing tools that improve the efficiency of their Canvas workflows & processes. From measuring student performance across various metrics to minimizing the time and effort of grading course discussions, our mission strives to alleviate common pain points in the teaching model. 
                                        <br></br>
                                        <br></br>
                                        Ready to get started? Complete the steps below to connect to Canvas and unlock special  integrations with our platform.
                                        </p>
                                    </div>
                                </div>

                                <div className="card border-0">
                                    <div className="card-header text-center">
                                        <p>01 — Connect to Canvas</p>
                                    </div>

                                    <div className="card-body">
                                        <br></br>
                                        <p>Paste your institution’s Canvas link below. Note that your institution’s Canvas URL may follow one of following structures:
                                        <br></br>
                                        <br></br>
                                        <ul>
                                        <li>[your institution’s name].instructure.com</li>
                                        <li>canvas.[your institution’s domain]</li>
                                        </ul>          
                                        <br></br>
                                        <em>(example) https://myschool.instructure.com/</em>                             
                                        </p>
                                    </div>

                                    <br></br>

                                    <div className="input-group input-group-lg">
                                        <input required type="url" 
                                                placeholder="Your institution's Canvas URL" 
                                                value={this.state.inputCanvasURL} 
                                                onChange={this.handleCanvasURL}>
                                        </input>
                                    </div>
                                </div>


                                <div className="card border-0">
                                    <div className="card-header text-center">
                                        <p>02 — Verify authorization to unlock app integration</p>
                                    </div>

                                    <div className="card-body">
                                        <br></br>
                                        <p>Generate a new access token by visiting your Canvas settings
                                        <br></br>
                                        <br></br>
                                        If you are simply testing out our product’s features, we recommend that you set an expiration date on your token for added security purposes.
                                        </p>
                                    </div>

                                    <br></br>

                                    <div className="input-group input-group-lg">
                                        <input required type="text" 
                                                placeholder="Unique access token" 
                                                value={this.state.inputAuthToken} 
                                                onChange={this.handleAuthToken}>
                                        </input>
                                    </div>
                                </div>


                                <div className="card border-0">
                                    <div className="card-header text-center">
                                        <p>03 — Review our data privacy policy</p>
                                    </div>

                                    <div className="card-body">
                                        <br></br>
                                        <p>By clicking “Activate my access”, you are permitting our system to have open access to your Canvas data, which includes information related to your Canvas profile and all of your registered courses. This further authorizes permission to view and collect published content, including your assignments, discussions, student profiles (“people”), grades, modules, syllabi, files, and quizzes. 
                                        <br></br>
                                        <br></br>
                                        We process the content you generate through the Canvas API, in order to activate the tools on our platform.
                                        <br></br>
                                        <br></br>
                                        Unlike most site operators, our application does not store data over a period of time, and only logs data for each browser session. Once you close out of your browser window, you will be terminating the connection between our platform and your Canvas account, and you will be prompted to re-enter the keys (i.e. your institution’s Canvas URL and unique access token) for user authorization if you choose to use the tools provided.  
                                        </p>
                                    </div>
                                </div>


                                <div>
                                    <button type="submit" 
                                            class="btn btn-primary btn-lg btn-block">
                                        Activate my access</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

            </div>


        </div>
        )
    }
}

export default GettingStarted;