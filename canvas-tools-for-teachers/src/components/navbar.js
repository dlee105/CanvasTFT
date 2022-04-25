import React, {Component} from "react";
import {Link} from "react-router-dom";
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import './navbar.css';


class Navbar extends Component {

    defaultAverageByGrader() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            window.location.assign("/averageByGrader");
        }
        else {
            window.location.assign("/login");
        }
    }

    defaultPeerReviewAnalytics() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            window.location.assign("/peerReview");
        }
        else {
            window.location.assign("/login");
        }
    }

    defaultDiscussionFinder() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            window.location.assign("/discussionSummary");
        }
        else {
            window.location.assign("/login");
        } 
    }

    defaultStudentGroupGenerator() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            window.location.assign("/studentGroupGenerator");
        }
        else {
            window.location.assign("/login");
        } 
    }

    connectToCanvas() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            // canvasURL is type 'str' so remove quotation marks before setting the URL to the browser window
            window.location = 'https://' + (sessionStorage.getItem('canvasURL')).replaceAll('"', '');
        }
        else {
            window.location.assign("/login");
        }
    }

    render() {
        return (
            <div className="Navbar">

                <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#FFFFFF"}}>                        
                        <Link to="/home" className="navbar-brand" id="logo">canvas <span style={{color:'#E4060F'}}>tools for teachers</span></Link>
                        
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".navbar-collapse" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navBarDropdown">
                            <ul className="navbar-nav">

                                <li className="nav-item dropdown">
                                    <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <p>Browse Tools <ArrowDownLineIcon></ArrowDownLineIcon></p>
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                        <Link to="#" className="dropdown-item" onClick={() => this.defaultAverageByGrader()}><p>Average By Grader</p></Link>
                                        <Link to="#" className="dropdown-item" onClick={() => this.defaultPeerReviewAnalytics()}><p>Peer Review Analytics</p></Link>
                                        <Link to="#" className="dropdown-item" onClick={() => this.defaultDiscussionFinder()}><p>Discussion Finder</p></Link>
                                        <Link to="#" className="dropdown-item" onClick={() => this.defaultStudentGroupGenerator()}><p>Student Group Generator</p></Link>
                                    </div>  
                                </li>

                                {/* <li className="nav-item">
                                    <Link to="#" className="nav-link"><p>Suggest a Tool</p></Link>
                                </li> */}

                                <li className="nav-item">
                                    <Link to="#" className="nav-link" onClick={() => this.connectToCanvas()}><p>My Canvas</p></Link>
                                </li>

                            </ul>
                        </div>

                </nav>

            </div>
        )

    }

}


export default Navbar;