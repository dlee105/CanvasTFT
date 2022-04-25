
// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom";
import {Route, Routes} from "react-router-dom";




// IMPORT PAGES
import Start from "./pages/start";
import Home from "./pages/home";
import AverageByGrader from './pages/averageByGrader';
import PeerReview from './pages/peerReview';
import StudentGroupGenerator from './pages/studentGroupGenerator';
import Login from "./pages/login";
import GettingStarted from './pages/getting-started';
import InvalidLogin from './pages/invalid-login';
import DiscussionSummary from './pages/discussionSummary';

function App() {

  return (

      // All of your Routes have to be wrapped with a Router root component 
      // where this component accepts only one single child 
      // so if you are trying to render something alongside your routes 
      // it will give you an error.

      // everything that you want to render onto the webpage must be placed in the topmost div
      // can only have one parent element (one div)

      // uses react router v6
      // use Routes instead of Switch (same thing, but Routes is used in the new ver of React)

    <Router>
    {/*All Routes goes here for a multi-page app*/}
      <Routes>
        <Route exact path="/" element={<Start/>} />
        <Route exact path="/home" element={<Home/>}/>
        <Route exact path="/start" element={<Start/>} />
          <Route exact path="/login" element={<Login/>} />
          <Route exact path="/getting-started" element={<GettingStarted/>} />
          <Route exact path="/invalid-login" element={<InvalidLogin/>} />
        <Route exact path="/averageByGrader" element={<AverageByGrader/>} />
        <Route exact path="/peerReview" element={<PeerReview/>} />
        <Route exact path="/discussionSummary" element={<DiscussionSummary/>}/>
        <Route exact path="/studentGroupGenerator" element={<StudentGroupGenerator/>} />
        {/* add more here */}
      </Routes>
   </Router>
    // </div>



  );
}

export default App;
