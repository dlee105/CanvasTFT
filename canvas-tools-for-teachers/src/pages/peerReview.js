import Navbar from "../components/navbar";
import { BsChevronBarDown, BsChevronBarUp } from "react-icons/bs";
import titleCard1 from "../assets/peerReview-full.png";
import {Link} from "react-router-dom";
import './tools.css';

import { useState, useEffect, React} from 'react';
import {  SelectPicker} from 'rsuite';
import {Table} from 'rsuite';
import { Cell, Column, HeaderCell} from 'rsuite-table';
import { IconButton } from 'rsuite';
import { Input } from 'rsuite';
import { Plus, Minus, Search } from '@rsuite/icons';
import CsvDownload from 'react-json-to-csv'


function PeerReview(){
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [selectedCourseId, setSelectedCourseId] = useState(0);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(0);

    const styles = { width: "100%", display: 'block', marginBottom: 10 };

    const [peerReviewData, setPeerReviewData] = useState([]);

    // state variables for building the table
    const [expandedHeight, setExpandedHeight] = useState(70)
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();



    useEffect(() => {
      let courseBody;
  
      const getCourseBody = async () => {
        const cResponse = await fetch(`http://localhost:9000/canvasAPI/courses?canvasURL=${sessionStorage.getItem('canvasURL')}`, {
            method: "get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
          })
        courseBody = await cResponse.json()
        parseCourses(courseBody)
        }
  
      getCourseBody()
    }, [])  // only get courses once when page reloads 

    useEffect(() => {
      let assignmentBody; 
  
      const getAssignmentBody = async () => {
          const aResponse = await fetch(`http://localhost:9000/canvasAPI/assignments?id=${selectedCourseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,{
              method: "get",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
              }
            })
          assignmentBody = await aResponse.json()
          parseAssignments(assignmentBody);
      }
  
      getAssignmentBody();
  
    }, [selectedCourseId])


    useEffect(() => {
      const getPeerReviewData = async () => {

          let peerReviewBody; 

          if (selectedCourseId && selectedAssignmentId){
          const response = await fetch(`http://localhost:9000/canvasAPI/peer_reviews?canvasURL=${sessionStorage.getItem('canvasURL')}&course_id=${selectedCourseId}&assignment_id=${selectedAssignmentId}`, {
            method: "get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
          })
          peerReviewBody = await response.json()
          buildPeerReviewDataStructure(peerReviewBody);
        }
        // for loop for pages 
      }
      getPeerReviewData();
     
    }, [selectedAssignmentId])
 
    
    const parseCourses = (courseBody) => {
      let parsed = []
          for(let i = 0; i < courseBody.length; i++){
          
            let item = courseBody[i]
  
            if("name" in item && "id" in item){
              parsed.push({"label" : item.name, "value" : item.id})
            }
      }
      setCourses(parsed)
    }
  
    const parseAssignments = (assignmentBody) => {
      let parsed = []
      for(let i = 0; i < assignmentBody.length; i++){
          let item = assignmentBody[i]
  
          if("name" in item && "id" in item){
            parsed.push({"label" : item['name'], "value" : item['id']})
          }
      }
      setAssignments(parsed)
    }
    
    const buildPeerReviewDataStructure = (peerReviewBody) => {
        let parsedPeerReviewData = []; // peer review data structure 

        for(const item of peerReviewBody){
          
          // find if current user id in the response exists in parsedPeerReviewData
          const foundUserId = parsedPeerReviewData.findIndex(element => element.student_id === item.user_id);

          // find if current assessor id in the response exists as a user in parsedPeerReviewData
          const foundAssessorId = parsedPeerReviewData.findIndex(element => element.student_id === item.assessor_id)

          // find assessor's submission comment
          const foundAssessorCommentIndex = item.submission_comments.findIndex(element => element.author_id === item.assessor_id)
          if(foundUserId === -1) { // not in data structure 
            parsedPeerReviewData.push({
              "student_id": item.user_id,
              "student_name" : item.user.display_name,
              "actual_received": (foundAssessorCommentIndex !== -1) ? 1 : 0,
              "total_received": 1,
              "actual_submitted": 0,
              "total_submitted": 0,
              "percentage_received" : (foundAssessorCommentIndex !== -1) ? 100 : 0,
              "percentage_submitted" : 0,
              "submitted_reviews": [],
              "received_reviews": [{
                "assessor_name": item.assessor.display_name, 
                "assessor_comment": (foundAssessorCommentIndex !== -1) ? item.submission_comments[foundAssessorCommentIndex].comment : "N/A"
              }]
            })
          }

          else {
            parsedPeerReviewData[foundUserId].total_received += 1
            parsedPeerReviewData[foundUserId].actual_received = (foundAssessorCommentIndex === -1) ? parsedPeerReviewData[foundUserId].actual_received : parsedPeerReviewData[foundUserId].actual_received += 1

            parsedPeerReviewData[foundUserId].percentage_received = Math.floor((parsedPeerReviewData[foundUserId].actual_received / parsedPeerReviewData[foundUserId].total_received) * 100)
            parsedPeerReviewData[foundUserId].received_reviews.push({
              "assessor_name": item.assessor.display_name, 
              "assessor_comment": (foundAssessorCommentIndex !== -1) ? item.submission_comments[foundAssessorCommentIndex].comment : "N/A"
            })
          }


          if (foundAssessorId === -1){
            parsedPeerReviewData.push({
              "student_id": item.assessor_id,
              "student_name" : item.assessor.display_name,
              "actual_received": 0,
              "total_received": 0,
              "actual_submitted": (foundAssessorCommentIndex !== -1)? 1 : 0,
              "total_submitted": 1,
              "percentage_received" : 0,
              "percentage_submitted" : (foundAssessorCommentIndex !== -1) ? 100 : 0,
              "submitted_reviews": [{
                "submitted_for": item.user.display_name,
                "submitted_comment": (foundAssessorCommentIndex !== -1) ? item.submission_comments[foundAssessorCommentIndex].comment : "N/A"
              }],
              "received_reviews": []
            })
          } else {
            parsedPeerReviewData[foundAssessorId].total_submitted += 1
            parsedPeerReviewData[foundAssessorId].actual_submitted = (foundAssessorCommentIndex === -1) ? parsedPeerReviewData[foundAssessorId].actual_submitted : parsedPeerReviewData[foundAssessorId].actual_submitted+= 1

            parsedPeerReviewData[foundAssessorId].percentage_submitted = Math.floor((parsedPeerReviewData[foundAssessorId].actual_submitted / parsedPeerReviewData[foundAssessorId].total_submitted) * 100)

            parsedPeerReviewData[foundAssessorId].submitted_reviews.push({
                  "submitted_for": item.user.display_name,
                  "submitted_comment": (foundAssessorCommentIndex !== -1) ? item.submission_comments[foundAssessorCommentIndex].comment : "N/A"
              })
          }
        }

        setPeerReviewData(parsedPeerReviewData);
    }
 

    //the customized cell (the collapse and expand button column)
    const rowKey = 'student_id';
    const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
      <Cell {...props}>
        <IconButton
          size="xs"
          appearance="ghost"
          
          onClick={() => {
            onChange(rowData);
          }}
          icon={
            expandedRowKeys.some((key) => key === rowData[rowKey]) ? <Minus/>:<Plus/>
          }
        />
      </Cell>
    );
    

    //returns the items to be displayed inside the expanded cell
    const renderRowExpanded = (rowData) => {
      let received_color
      let submitted_color
      let notSubmittedFor = (rowData.actual_submitted===rowData.total_submitted)? "": "Not submitted for: "
      let notReceivedFrom = (rowData.actual_received===rowData.total_received)? "": "Not received from: "
      let submittedComments =''
      let receivedComments = ''
      
      if(rowData.actual_received !== rowData.total_received){
        received_color = "red"
      }
      else{
        received_color = "ForestGreen"
      }

      if(rowData.actual_submitted !== rowData.total_submitted){
        submitted_color = "red"
      }
      else{
        submitted_color = "ForestGreen"
      }

      let i = 1
      for(const item of rowData.submitted_reviews){
        if(item.submitted_comment==="N/A"){
          notSubmittedFor+=item.submitted_for+", "
        }
        else{
          submittedComments +='<span style="color:DodgerBlue"><u>Submitted #' + i.toString()+" (for " + item.submitted_for+"):</span></u><br>" + item.submitted_comment + "<br><br>"
          i+=1
        }
      }
      notSubmittedFor=notSubmittedFor.slice(0,-2)

      let j = 1
      for(const item of rowData.received_reviews){
        if(item.assessor_comment === "N/A"){
          notReceivedFrom+=item.assessor_name+", "
        }
        else{
          receivedComments+='<span style="color:DodgerBlue"><u>Received #' + j.toString()+" (from " + item.assessor_name+"):</span></u><br>" + item.assessor_comment + "<br><br>"
          j+=1
        }
      }
      notReceivedFrom=notReceivedFrom.slice(0,-2)
     
     let submittedLength = 70
     let receivedLength = 70
      for (const item of rowData.submitted_reviews){
        submittedLength+=item.submitted_comment.length
      }
      for(const item of rowData.received_reviews){
        receivedLength+=item.assessor_comment.length
      }
      if(submittedLength>=receivedLength && submittedLength>300){
        setExpandedHeight(Math.floor(submittedLength/3))
      }
      else if(receivedLength>=submittedLength && receivedLength >300){
        setExpandedHeight(Math.floor(receivedLength/3))
      }

      console.log(expandedHeight)
      return (
        <div>
          <table width="1200" rules = "cols" style = {{marginLeft:"85px"}}>
            <tr valign="top">
              <td width = "500" align = "justify" style = {{"paddingRight":"15px"}}><p><strong># of Submitted / # of Assigned: <span style={{color:submitted_color}}>{rowData.actual_submitted}/{rowData.total_submitted}</span></strong></p>
                <p style={{color:"FireBrick"}}> {notSubmittedFor}</p>
                <p dangerouslySetInnerHTML={{__html: submittedComments}}/>
              </td>
              <td width = "500" align="justify" style = {{"paddingLeft":"15px"}}><p><strong># of Received / # of Assigned: <span style={{color:received_color}}>{rowData.actual_received}/{rowData.total_received}</span></strong></p>
                <p style={{color:"FireBrick"}}>{notReceivedFrom}</p>
                <p dangerouslySetInnerHTML={{__html: receivedComments}}/>
              </td>     
            </tr>
          </table>
        </div>
      );
    };


    const searchResults = peerReviewData.filter(item=>item["student_name"].toLowerCase().includes(searchTerm))
    const data = searchResults;
    

    const handleExpanded = (rowData, dataKey) => {
    let open = false;
    const nextExpandedRowKeys = [];
    expandedRowKeys.forEach((key) => {
        if (key === rowData[rowKey]) {
          open = true;
        } else {
          nextExpandedRowKeys.push(key);
        }
      });
     
      if (!open) {
        nextExpandedRowKeys.push(rowData[rowKey]);
      }
      
      setExpandedRowKeys(nextExpandedRowKeys);
  };
  
    const handleAllExpanded = () => {
      const allExpanded=[]
      for(const cell of searchResults){
        allExpanded.push(cell.student_id)

      }
      setExpandedRowKeys(allExpanded)
    }

    const collapseAll = ( )=> {
      setExpandedRowKeys([])
    }
  

  //sort function for the table
  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string' && typeof y === 'string') {
          x = x.split(" ")[x.split(" ").length-1];
          y = y.split(" ")[y.split(" ").length-1];
          if (sortType === 'asc') {
            return (x.localeCompare(y));
          } else {
            return (y.localeCompare(x));
          }
        }
        if (sortType === 'asc') {
          return (x - y);

        } else {
          return (y - x);
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    //setLoading(true);
    // setTimeout(() => {
      //setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    // }, 0);
  };
  

      return(

        <div>
          <Navbar></Navbar>
          <div className="PeerReview">
            
            <img src={titleCard1} alt={"A sortable table that displays information about which students have completed their discussion posts on Canvas"}></img>              

            {/* tool description */}
            <div className="container">
              <div className="row align-items-start">
                <div className="col-md-6">
                  <h2>Peer Review Analytics</h2>
                </div>
                <div className="col-md-6">
                  <p>View how many peer reviewers have been assigned to each assignment submission. With our organized list summaries, 
                          easily track the completion rate of each submission and the statuses of the assigned peer reviews.</p>
                </div>
              </div>
            </div>




            {/* select course and corresponding assignment */}
            <div className="card border-0">
              <div className="container">
                <div className="row">

                <div className="col-md-6">
                  <p>1. &ensp;Select a course</p>
                      <div>
                          <SelectPicker size="lg" 
                                        placeholder="--" 
                                        data={courses} 
                                        style={styles} 
                                        onChange = {value=>{setSelectedCourseId(value)
                                                            setSelectedAssignmentId() }} />
                      </div>
                </div>
      
                <div className="col-md-6">
                  <p>2. &ensp;Select an assignment</p>
                      <div>
                          <SelectPicker size="lg" 
                                        placeholder="--" 
                                        defaultValue = {''} 
                                        data={assignments} 
                                        style={styles} 
                                        onChange = {value=>setSelectedAssignmentId(value)}/>
                      </div>
                </div>
              </div>
            </div>  
          </div>



            {/* search bar, expand/collapse buttons */}
            <div className="container">
              <div className="row align-items-start">
                <div className="col">
                    <Input size = "lg" placeholder="Search for students..." icon = {<Search/>} type = "text" style={styles} onChange = {value=> setSearchTerm(value)}/>                          
                </div>
              </div>
            </div>

            <div className="container">
              <div className="d-flex justify-content-end">
                  <div className="p-2">
                      <Link to="#" onClick={handleAllExpanded}><p>Expand all <BsChevronBarDown></BsChevronBarDown></p></Link>
                  </div>
                  <div className="p-2">
                      <Link to="#" onClick={collapseAll}><p>Collapse all <BsChevronBarUp></BsChevronBarUp></p></Link>
                  </div>
                  <div className="p-2">
                      <CsvDownload  style={{backgroundColor:"#FFFFFF"}} data={peerReviewData} filename="PeerReviewData.csv"> 
                        <p>Export all as CSV</p>
                      </CsvDownload>
                  </div>
                </div>
              </div>

          {/* div spacer */}
          <br></br>
          <br></br>
              


          <div className="container">
                {/* data display */}
                <Table
                  wordWrap
                  autoHeight
                  virtualized
                  rowExpandedHeight={expandedHeight}
                  rowKey={rowKey}
                  expandedRowKeys={expandedRowKeys}
                  data={getData()}
                  sortColumn={sortColumn}
                  sortType={sortType}
                  onSortColumn={handleSortColumn}
                  renderRowExpanded={renderRowExpanded}
                >
                  <Column width={85} align="center">
                    <HeaderCell></HeaderCell>
                    <ExpandCell dataKey="student_id" expandedRowKeys={expandedRowKeys} onChange={handleExpanded}/>
                  </Column>

                  <Column width={170} sortable>
                    <HeaderCell><p>Student Name</p></HeaderCell>
                    <Cell dataKey="student_name" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell><p>Student ID</p></HeaderCell>
                    <Cell dataKey="student_id" />
                  </Column>

                  <Column width={220} sortable>
                    <HeaderCell><p>Submitted Reviews (%)</p></HeaderCell>
                    <Cell dataKey="percentage_submitted" />
                  </Column>

                  <Column width={220} sortable>
                    <HeaderCell><p>Received Reviews (%)</p></HeaderCell>
                    <Cell dataKey="percentage_received"/>
                  </Column>

                </Table>
          </div>



          </div>
        </div>

    )
}

export default PeerReview
