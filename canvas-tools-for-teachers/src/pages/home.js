import React, {Component} from "react";
import {Link} from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";


import "./home.css";

// import components in home page 
import Navbar from "../components/navbar";
import headlineImg from "../assets/header-bkg.png";
import titleCard1 from "../assets/averageByGrader.png";
import titleCard2 from "../assets/peerReviewAnalytics.png";
import titleCard3 from "../assets/discussionFinder.png";
import titleCard4 from "../assets/groupGenerator-full.png"

class Home extends Component {

  // the following functions display conditional links:
    // case 1: if the user has connected to their Canvas account (i.e. successfully logged in), then they will be directed to the tools page
    // case 2: if the user is just exploring the platform and has not connected to their Canvas account, then they will be directed to the login and prompted to enter credentials
    // case 2 prevents users from viewing a 404 error page bc without first connecting their account, we cannot run api calls on our backend
  // a new conditional link must be created for every new title card displayed on the home page

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
  


  render() {
    return (

      <div>
        <Navbar></Navbar>


        <div className="Home">

          {/* primary page headline */}
          <div className="container">
            <div className="row">
              <div className="col my-auto text-center">
                <h2>Canvas made <b><em>simpler.</em></b></h2>
              </div>
            </div>
          </div>

          <br></br>
          <br></br>

          {/* secondary headline w/ img */}
          <div className="container">
            <div className="row">
              <div className="col my-auto">

                <div className="card border-0" style={{backgroundImage:"URL("+ headlineImg +")",
                                                      backgroundPosition: 'center',
                                                      backgroundSize: 'cover',
                                                      backgroundRepeat: 'no-repeat',
                                                      paddingTop: "10%",
                                                      paddingBottom: "10%"}}>
                  <div class="container-fluid">
                    <div class="row align-items-start">
                      
                      <div class="col-md-8 my-auto">
                        <h3 style={{color:"white"}}>
                          Tools designed for flexibility & convenience. 
                          Browse our curated collection below and find what best fits your teaching needs.
                        </h3>
                      </div>

                    </div>
                  </div>
                </div>


                {/* Average By Grader title card */}
                <div className="card border-0">
                  <div className="card-header">
                    <Link to="javascript:void(0)" onClick={() => this.defaultAverageByGrader()}><h2>Average By Grader <FiArrowUpRight></FiArrowUpRight></h2></Link>
                  </div>
                    <div className="card-body">
                        <br></br>
                        <p>Compare the average grade given by each course grader or teacher assistant.
                          This data visualization tool displays a interactive boxplot, a standardized way of displaying the distribution of data based on a five number summary. 
                          Uncover instances of outliers and determine if each educator is grading across the same level of difficulty.  
                        <br></br>
                        <br></br>
                        </p>
                        <img src={titleCard1} alt={"Box and whisker plot displaying average of grades produced by total course readers"}/>
                    </div>
                </div>

                {/* Peer Review Analytics title card */}
                <div className="card border-0">
                  <div className="card-header">
                    <Link to="javascript:void(0)" onClick={() => this.defaultPeerReviewAnalytics()}><h2>Peer Review Analytics <FiArrowUpRight></FiArrowUpRight></h2></Link>
                  </div>
                    <div className="card-body">
                        <br></br>
                        <p>View how many peer reviewers have been assigned to each assignment submission. With our organized list summaries, 
                          easily track the completion rate of each submission and the statuses of the assigned peer reviews.  
                        <br></br>
                        <br></br>
                        </p>
                        <img src={titleCard2} alt={"Table depicting student submissions for peer review assignments"}/>
                    </div>
                </div>

                {/* Discussion Finder title card */}
                <div className="card border-0">
                  <div className="card-header">
                    <Link to="javascript:void(0)" onClick={() => this.defaultDiscussionFinder()}><h2>Discussion Finder <FiArrowUpRight></FiArrowUpRight></h2></Link>
                  </div>
                    <div className="card-body">
                        <br></br>
                        <p>See how you can speed-grade course discussions in bulk 
                          by assessing each student’s overall interaction levels and idea exchanges among their peers.  
                        <br></br>
                        <br></br>
                        </p>
                        <img src={titleCard3} alt={"Table depicting student submissions for discussion assignments"}/>
                    </div>
                </div>

                {/* Student Group Generator title card */}
                <div className="card border-0">
                  <div className="card-header">
                    <Link to="javascript:void(0)" onClick={() => this.defaultStudentGroupGenerator()}><h2>Student Group Generator <FiArrowUpRight></FiArrowUpRight></h2></Link>
                  </div>
                    <div className="card-body">
                        <br></br>
                        <p>Automate the creation of student groups for any and all of your published courses. 
                            Generate, export, and modify all groups under one view. 
                        <br></br>
                        <br></br>
                        </p>
                        <img src={titleCard4} alt={"Table depicting student groups for a course"}/>
                    </div>
                </div>

                {/* to add new tools, copy the template of one of the sections above and replace text and title card img */}

              </div>
            </div>
          </div>

        </div>
        


      </div>
    )
  }

}


export default Home;