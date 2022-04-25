import Navbar from "../components/navbar";
import titleCard1 from "../assets/discussionFinder-full.png";
import './tools.css';


import { useState, useEffect, Fragment } from 'react'
import { SelectPicker } from 'rsuite';
import { Nav } from 'rsuite';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

import { UserBadge, Peoples, Message} from '@rsuite/icons';
import { Button, ButtonToolbar } from 'rsuite';
import { Input, InputGroup } from 'rsuite';

const DiscussionSummary = () => {

    const [courseResponse, setCourseResponse] = useState({});
    const [discussionResponse, setDiscussionResponse] = useState({});
    const [groupResponse, setGroupResponse] = useState({});
    const [groupTopicsResponse, setGroupTopicsResponse] = useState({});

    const [selectedCourseId, setSelectedCourseId] = useState();
    const [selectedDiscussionTopicId, setSelectedDiscussionTopicId] = useState();
    const [selectedGroupId, setSelectedGroupId] = useState();
    const [selectedCourseGroupTopicId, setSelectedCourseGroupTopicId] = useState();

    const [discussionViewData, setDiscussionViewData] = useState([]);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');

    const [active, setActive] = useState('student');
    const [searchTerm, setSearchTerm] = useState("");
    const [studentSearchTerm, setStudentSearchTerm] = useState("");
    const [studentData, setStudentData] = useState([])
    let studentDataStructure = []

    
    useEffect(() => {
        // when course id changes, get discussion topics + discussion groups 
        // maybe separate these (dropdowns cannot have selections at the same time?)
        let discussionBody;
        let groupBody;

        const getDiscussionBody = async () => {
            const dResponse = await fetch(`http://localhost:9000/canvasAPI/discussion_topics?canvasURL=${sessionStorage.getItem('canvasURL')}&course_id=${selectedCourseId}`, {
                method: "get",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                }
              })
            discussionBody = await dResponse.json()
            setDiscussionResponse(discussionBody)
            }
    
        const getGroupBody = async () => {
            const gResponse = await fetch(`http://localhost:9000/canvasAPI/course_groups?canvasURL=${sessionStorage.getItem('canvasURL')}&course_id=${selectedCourseId}`, {
                method: "get",
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                }
            })
            groupBody = await gResponse.json()
            setGroupResponse(groupBody)
        }

        if (selectedCourseId !== undefined){
          getDiscussionBody()
          getGroupBody()

          if(active==="student"){
            getStudentData()
            console.log(studentData)}
          
        }
        
        // if(active === "student" && selectedCourseId !== undefined){
        //   for(const topic of discussionTopics){ // for course level discussion topics
        //     console.log(topic)
        //     studentDataStructure = addCourseLevelDiscussionsByStudent(topic, studentDataStructure);
        //   }
    
        //   for(const group of courseGroups){
        //     studentDataStructure = addGroupLevelDiscussionsByStudent(group, studentDataStructure);
           
        //   }
        //   console.log(studentDataStructure)
        //   setStudentData(studentDataStructure)
        // }

    }, [selectedCourseId])

    useEffect(()=>{
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
        setCourseResponse(courseBody)
        }

        getCourseBody()
    },[])  // only get courses once



    useEffect(() => {
        let groupTopicsBody;
        
        const getGroupDiscussionTopics = async () => {
            const gTopicsResponse = await fetch(`http://localhost:9000/canvasAPI/group_discussion_topics?canvasURL=${sessionStorage.getItem('canvasURL')}&group_id=${selectedGroupId}`, {
                method: "get",
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                }
            })
            groupTopicsBody = await gTopicsResponse.json()
            setGroupTopicsResponse(groupTopicsBody)
        }
        
        if (selectedGroupId !== undefined){
          getGroupDiscussionTopics()
        }
    }, [selectedGroupId])

    useEffect(()=>{
      setDiscussionViewData([])
      setSelectedCourseId()
      setSelectedDiscussionTopicId()
      setSelectedCourseGroupTopicId()
      setSelectedGroupId()
      
    }, [active])

    useEffect(() => { 

        // reset data structure when discussion topic id changes 
        setDiscussionViewData([])
        let viewBody;

        // using separate useEffect to avoid unnecessary API calls: https://stackoverflow.com/questions/55724642/react-useeffect-hook-when-only-one-of-the-effects-deps-changes-but-not-the-oth 
        const getDiscussionView = async () => {
            const vResponse = await fetch(`http://localhost:9000/canvasAPI/discussion_view?canvasURL=${sessionStorage.getItem('canvasURL')}&course_id=${selectedCourseId}&topic_id=${selectedDiscussionTopicId}`, {
            method: "get",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
            })

            viewBody = await vResponse.json()
            createDataStructure(viewBody) 
        }

        if (selectedCourseId !== undefined && selectedDiscussionTopicId !== undefined){
          getDiscussionView()
        }

    }, [selectedDiscussionTopicId])

    useEffect(() => {
       
        setDiscussionViewData([]) // reset data structure when discussion topic id changes 
       
        let viewBody;

        const getDiscussionView = async () => {
            const vResponse = await fetch(`http://localhost:9000/canvasAPI/group_discussion_view?canvasURL=${sessionStorage.getItem('canvasURL')}&group_id=${selectedGroupId}&topic_id=${selectedCourseGroupTopicId}`, {
            method: "get",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
            })

            viewBody = await vResponse.json()
            createDataStructure(viewBody)
        }

        if (selectedGroupId !== undefined && selectedCourseGroupTopicId !== undefined){
          getDiscussionView()
        }

    }, [selectedCourseGroupTopicId])


    let courses = []
    for(let i = 0; i < courseResponse.length; i++){
        let item = courseResponse[i]
        courses.push({"label":item['name'], "value":item['id']})
    }

    let discussionTopics = []

    
    for(let i = 0; i < discussionResponse.length; i++){
        let item = discussionResponse[i]
        if(discussionResponse[i].group_topic_children.length === 0){
           discussionTopics.push({"label":item['title'], "value":item['id']}) 
        }
    }

    let courseGroups = []
    

    if(discussionResponse.length > 0){
        const discussionGroupCheck = discussionResponse?.filter(item => item["id"] === selectedDiscussionTopicId)

        if(discussionGroupCheck[0]?.group_topic_children.length !== 0){

            for(let i = 0; i < groupResponse.length; i++){
            let item = groupResponse[i]
            courseGroups.push({"label":item['name'], "value":item['id']})
            }

        }

    }

    let courseGroupTopics = []

    for(let i = 0; i < groupTopicsResponse.length; i++){
        let item = groupTopicsResponse[i]
        courseGroupTopics.push({"label":item['title'], "value":item['id']})
    }


   const createDataStructure = (data) => {
       let test = []
            for(const item of data.participants){  // add all students (participants) to data structure 
            test.push({"user_id": item.id, "username": item.display_name, "original_post": [], "replies": []})
            }

        
            for(const item of data.view){

                const foundOriginalUserId = test.findIndex(element => element.user_id === item.user_id) // index of user in data structure
                let date = item.updated_at.slice(0,-4).split("T")
                let day = date[0].split("-")
                let final_date = day[1]+"/"+day[2]+"/"+day[0] + " at "
                if(parseInt(date[1].split(":")[0])>12){
                  final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" PM"
                }
                else{
                  final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" AM"
                }
                
                test[foundOriginalUserId].original_post.push({"word_count": item.message.split(" ").length, "date_updated": final_date, "text": item.message.slice(3,-4)})

                if(item.replies){
                    for(const reply of item.replies){
                      let date = reply.updated_at.slice(0,-4).split("T")
                      let day = date[0].split("-")
                      let final_date = day[1]+"/"+day[2]+"/"+day[0] + " at "
                      if(parseInt(date[1].split(":")[0])>12){
                        final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" PM"
                      }
                      else{
                        final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" AM"
                      }
                        const foundReplyUserId = test.findIndex(element => element.user_id === reply.user_id)
                        test[foundReplyUserId].replies.push({"word_count": reply.message.split(" ").length, "text": reply.message.slice(3,-4), "replied_to": test[foundOriginalUserId].username, "date_updated": final_date})
                    }
                }

            }
            setDiscussionViewData(test)
          
            

    }

      let response; 
     

      const addCourseLevelDiscussionsByStudent = async (topic) => {
        
        // adds all course level discussions the student participated in to the student data structure
        console.log(selectedCourseId)
        const vResponse = await fetch(`http://localhost:9000/canvasAPI/discussion_view?canvasURL=${sessionStorage.getItem('canvasURL')}&course_id=${selectedCourseId}&topic_id=${topic.value}`, {
          method: "get",
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
          }
          })

        response = await vResponse.json();

        for(const item of response.participants){
          const foundOriginalUserId = studentDataStructure.findIndex(element => element.user_id === item.user_id)

          if(foundOriginalUserId !== -1){
            studentDataStructure[foundOriginalUserId].posts = [];
          }
          else{
            studentDataStructure.push({"user_id": item.id, "username": item.display_name, "posts": []})
          }
        }

        
        for(const item of response.view){
          let date = item.updated_at.slice(0,-4).split("T")
          let day = date[0].split("-")
          let final_date = day[1]+"/"+day[2]+"/"+day[0] + " at "
          if(parseInt(date[1].split(":")[0])>12){
            final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" PM"
          }
          else{
            final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" AM"
          }
            const foundOriginalUserId = studentDataStructure.findIndex(element => element.user_id === item.user_id) // index of user in data structure
            studentDataStructure[foundOriginalUserId].posts.push({"word_count": item.message.split(" ").length, "date_updated": final_date, "text": item.message.slice(3,-4), "assignment_name": topic.label})

            if(item.replies){
                for(const reply of item.replies){
                  let date = reply.updated_at.slice(0,-4).split("T")
                  let day = date[0].split("-")
                  let final_date = day[1]+"/"+day[2]+"/"+day[0] + " at "
                  if(parseInt(date[1].split(":")[0])>12){
                    final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" PM"
                  }
                  else{
                    final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" AM"
                  }
                 
                    const foundReplyUserId = studentDataStructure.findIndex(element => element.user_id === reply.user_id)
                    studentDataStructure[foundReplyUserId].posts.push({"word_count": reply.message.split(" ").length, "text": reply.message.slice(3,-4), "replied_to": studentDataStructure[foundOriginalUserId].username, "date_updated": final_date, "assignment_name": topic.label})
                }
            }
        }
        //setStudentData(studentDataStructure)
       console.log(studentDataStructure)
       setStudentData(studentDataStructure)
        //return studentDataStructure
      }

      let viewBody;
      const addGroupLevelDiscussionsByStudent = async (group) => {
        // adds all group level discussions the student participated in to the student data structure

        const gTopicsResponse = await fetch(`http://localhost:9000/canvasAPI/group_discussion_topics?canvasURL=${sessionStorage.getItem('canvasURL')}&group_id=${group.value}`, {
          method: "get",
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
          }
        })
        response = await gTopicsResponse.json()

        for(const topic of response){
          const vResponse = await fetch(`http://localhost:9000/canvasAPI/group_discussion_view?canvasURL=${sessionStorage.getItem('canvasURL')}&group_id=${group.value}&topic_id=${topic.id}`, {
            method: "get",
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
            })

            viewBody = await vResponse.json()

            for(const participant of viewBody.participants){
              const foundOriginalUserId = studentDataStructure.findIndex(element => element.user_id === participant.user_id)
    


              if(foundOriginalUserId === -1){ 
                studentDataStructure.push({"user_id": participant.id, "username": participant.display_name, "posts" : []})
              }
            }
    
            for(const item of viewBody.view){

                const foundOriginalUserId = studentDataStructure.findIndex(element => element.user_id === item.user_id) // index of user in data structure
                let date1 = item.updated_at.slice(0,-4).split("T")
                let day1 = date1[0].split("-")
                let final_date1 = day1[1]+"/"+day1[2]+"/"+day1[0] + " at "
                if(parseInt(date1[1].split(":")[0])>12){
                  final_date1+=((date1[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date1[1].split(":")[1]+" PM"
                }
                else{
                  final_date1+=((date1[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date1[1].split(":")[1]+" AM"
                }
                
                studentDataStructure[foundOriginalUserId].posts.push({"word_count": item.message.split(" ").length, "date_updated": final_date1, "text": item.message.slice(3,-4), "assignment_name": topic.title, "html_url": topic.html_url})
              
                if(item.replies){
                    for(const reply of item.replies){
                      let date = reply.updated_at.slice(0,-4).split("T")
                      let day = date[0].split("-")
                      let final_date = day[1]+"/"+day[2]+"/"+day[0] + " at "
                      if(parseInt(date[1].split(":")[0])>12){
                        final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" PM"
                      }
                      else{
                        final_date+=((date[1].split(":")[0] + 11) % 12 + 1).toString()+":"+date[1].split(":")[1]+" AM"
                      }
                     
                        const foundReplyUserId = studentDataStructure.findIndex(element => element.user_id === reply.user_id)
                        studentDataStructure[foundReplyUserId].posts.push({"word_count": reply.message.split(" ").length, "text": reply.message.slice(3,-4), "replied_to": studentDataStructure[foundOriginalUserId].username, "date_updated": final_date, "assignment_name": topic.title, "html_url": topic.html_url})
                    }
                }
            }
            // setStudentData(studentDataStructure)
            console.log(studentDataStructure)
            setStudentData(studentDataStructure)
           // return studentDataStructure
        }
       
        // console.log(studentDataStructure) 
      }

      const getStudentData = async() => {
        //console.log("gets to the function")
        let data = []
        let data2 = []
      for(const topic of discussionTopics){ // for course level discussion topics
        addCourseLevelDiscussionsByStudent(topic);
        
      }
     
      // setStudentData(data)

      for(const group of courseGroups){
        // console.log(group)
       addGroupLevelDiscussionsByStudent(group);
       
      }
    // setStudentData(data2)
  }
    

    //  console.log(studentDataStructure)
     
    // }


    // sorting algorithm for table
    function descendingComparator(a, b, orderBy) {
      let x = a[orderBy]
      let y = b[orderBy]
      if (orderBy === 'username'){
        x = x.split(" ")[x.split(" ").length-1];
        y = y.split(" ")[y.split(" ").length-1];
      }
      if (orderBy === 'original_post' || orderBy === 'replies') {
        x = x.length
        y = y.length
      }
      if (y < x) {
        return -1;
      }
      if (y > x) {
        return 1;
      }
      return 0;
    }
    
    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    // data structure for table header
    const headCells = [
      {
        id: 'username',
        label: 'Student Name',
      },
      {
        id: 'user_id',
        label: 'Student ID',
      },
      {
        id: 'original_post',
        label: '# of Posts',
      },
      {
        id: 'replies',
        label: '# of Replies',
      },
    ];


    const studentHeadCells = [
      {
        id: 'username',
        label: 'Student Name',
      },
      {
        id: 'user_id',
        label: 'Student ID',
      },
      {
        id: 'posts',
        label: '# of Completed Posts',
      },
      
    ];

    const styles = { width: "100%", display: 'block', marginBottom: 20, };
    // TODO: 2 different search displays (one for discussions with no groups and one for searching discussions by group)

    const Row = (props) => {
        const { row } = props;
        const [open, setOpen] = useState(false);
        return (
          <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  color = "primary"
                  onClick={() => setOpen(!open)}
                >
                  {open? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>{row.user_id}</TableCell>
              <TableCell>{row.original_post.length}</TableCell>
              <TableCell>{row.replies.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h5" gutterBottom component="div">
                      Post
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableBody>
                        {row.original_post.map((historyRow) => (
                          
                          <TableRow key={row.user_id}>
                            <TableCell component="th" scope="row">
                            <p><strong>Word count: {historyRow.word_count}&nbsp;&nbsp;|&nbsp;&nbsp;{historyRow.date_updated}</strong></p>
                              <p>{historyRow.text}</p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
      
                    <Typography variant="h5" gutterBottom component="div">
                      Replied To
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableBody>
                        {row.replies.map((historyRow) => (
                          
                          <TableRow key={row.user_id}>
                            <TableCell component="th" scope="row">
                            <p><strong><span style={{color:'DodgerBlue'}}><u>{historyRow.replied_to}</u></span>'s post&nbsp;&nbsp;|&nbsp;&nbsp;Word count: {historyRow.word_count}&nbsp;&nbsp;|&nbsp;&nbsp;{historyRow.date_updated}</strong></p>
                              <p>{historyRow.text}</p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </Fragment>
        );
      }
      const StudentRow = (props) => {
       
        const { row } = props;
        const [open, setOpen] = useState(false);

        return (
          <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  color = "primary"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell>{row.user_id}</TableCell>
              <TableCell>{row.posts.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h5" gutterBottom component="div">
                      Post
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableBody>
                        {row.posts.map((historyRow) => (
                          
                          <TableRow key={row.user_id}>
                            <TableCell component="th" scope="row">
                            <p><strong>Word count: {historyRow.word_count}&nbsp;&nbsp;|&nbsp;&nbsp;{historyRow.date_updated}&nbsp;&nbsp;|&nbsp;&nbsp;From: <a href={historyRow.html_url}>{historyRow.assignment_name}</a> </strong></p>
                              <p>{historyRow.text}</p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>      
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </Fragment>
        );
      }
    function EnhancedTableHead(props) {
      const { order, orderBy, onRequestSort } =
        props;
      const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
      };
    
      return (
        <TableHead>
          <TableRow>
            <TableCell>
            </TableCell>
            {headCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
    }

    function EnhancedStudentTableHead(props) {
      const { order, orderBy, onRequestSort } =
        props;
      const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
      };
    
      return (
        <TableHead>
          <TableRow>
            <TableCell>
            </TableCell>
            {studentHeadCells.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
    }

    
    const CustomNav = ({ active, onSelect, ...props }) => {
      return (
        <div>
        <Nav {...props} activeKey={active} onSelect={onSelect} style={styles}>
          <Nav.Item eventKey="student" icon={<UserBadge/>}><p>Students</p></Nav.Item>
          <Nav.Item eventKey="discussion" icon = {<Message/>} ><p>Discussion Topics</p></Nav.Item>
          <Nav.Item eventKey="groups" icon = {<Peoples/>}><p>Groups</p></Nav.Item>
        </Nav>
        </div>
      );
    };
    
    const handleAllExpanded = ()=>{
      
    }

    const collapseAll =()=>{
     
    }
   
  
    //Filtered data structures based on the search result inputted by the user
    const searchResults = discussionViewData.filter(item=>item["username"].toLowerCase().includes(searchTerm))
    const studentSearchResults = studentData.filter(item=>item["username"].toLowerCase().includes(studentSearchTerm))













    // RENDERING

    return(
        <div>
            <Navbar />

            <div className="DiscussionFinder">

                <img src={titleCard1} alt={"Table depicting student submissions for discussion assignments"}></img>              

                <div className="container">
                    <div className="row align-items-start">
                      <div className="col-md-6">
                        <h2>Discussion Finder</h2>
                      </div>
                    <div className="col-md-6">
                      <p>See how you can speed-grade course discussions in bulk 
                          by assessing each student’s overall interaction levels and idea exchanges among their peers.</p>
                    </div>
                  </div>
                </div>



              <div className="card border-0">
                <div className="container">
                  <div className="row">

                    <div className="col">

                          <div align = "center">
                          
                          <CustomNav appearance="subtle" active={active} onSelect={setActive} />

                          <br></br>
                          
                          {active === 'student' && (
                            
                              <div style={{marginBottom: '60px', marginTop: '25px'}}>
                              <p>1. &ensp;Select a course</p>
                              <div>
                                  <SelectPicker size="md" placeholder="Course" data={courses} style={styles} onChange = {value=>{setSelectedCourseId(value)}} />
                              </div>

                          <br></br>


                            {/* SEARCH BAR, EXPAND/COLLAPSE FUNCTION for students*/}
                            <div style = {{ display: 'flex', width: "100%", justifyContent: "stretch", marginBottom: 20}} >
                              <Input size = "md" placeholder="Search For Students..." type = "text" style={{height: "100%"}} onChange = {value=> setStudentSearchTerm(value)}/>
                              <ButtonToolbar style={{display: "flex", height: "100%"}}>
                                <Button onClick={handleAllExpanded}>Expand All</Button>
                                <Button onClick={collapseAll}>Collapse All</Button>
                              </ButtonToolbar>   
                            </div>
                            
                            <br></br>

                            {/* DISPLAY DISCUSSION DATA */}
                            <div>
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <EnhancedStudentTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                    {studentSearchResults.slice().sort(getComparator(order, orderBy)).map((row, index) => (
                                        <StudentRow key={row.user_id} row={row} />
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </div></div>
                            )}

                          {active === 'discussion' && (<div>
                              <div style={{marginBottom: '30px', marginTop: '25px'}}>
                              <p>1. &ensp;Select a course</p>
                              <div>
                                  <SelectPicker size="md" placeholder="Course" data={courses} style={styles} onChange = {value=>{setSelectedCourseId(value)}} />
                              </div>
                            </div>
                            <div style={{marginBottom: '30px', marginTop: '25px'}}>
                                <p>2. &ensp;Select a discussion topic</p>
                                    <div>
                                        <SelectPicker size="md" placeholder="Discussion Topic" data={discussionTopics} style={styles} onChange = {value=>{setSelectedDiscussionTopicId(value)}} />
                                    </div>
                            </div>
                            <br></br>
                            <br></br>
                            </div>
                            )}

                          {active === 'groups' && (
                              <div>
                              <div style={{marginBottom: '30px', marginTop: '25px'}}>
                                    <p>1. &ensp;Select a course</p>                                      
                                      <div>
                                          <SelectPicker size="md" placeholder="Course" data={courses} style={styles} onChange = {value=>{setSelectedCourseId(value)}} />
                                      </div>
                              </div>
                              <div style={{marginBottom: '30px', marginTop: '25px'}}>
                                <p>2. &ensp;Select a discussion group</p>                                      
                                    <div>
                                          <SelectPicker size="md" placeholder="Discussion Group" data={courseGroups} style={styles} onChange = {value=>{setSelectedGroupId(value)}} />
                                      </div>
                              </div>
                              <div style={{marginBottom: '30px', marginTop: '25px'}}>
                                      <p>3. &ensp;Select a course group topic</p>
                                      <div>
                                          <SelectPicker size="md" placeholder="Course Group Topics" data={courseGroupTopics} style={styles} onChange = {value=>{setSelectedCourseGroupTopicId(value)}} />
                                      </div>
                              </div>

                            <br></br>
                            <br></br>
                            </div>

                            
                            )}



                          </div >
                          {(active === 'groups' || active === "discussion") && (

                            // SEARCH, EXPAND/COLLAPSE FUNCTION for discussion topic & groups
                            <div>
                              <div style = {{ display: 'flex', width: "100%", justifyContent: "stretch", marginBottom: 20}} >
                                <br></br>
                                <br></br>
                                <Input size = "md" placeholder="Search For Students..." type = "text" style={{height: "100%"}}  onChange = {value=> setSearchTerm(value)}/>
                                <ButtonToolbar style={{display: "flex", height: "100%"}}>
                                  <Button onClick={handleAllExpanded}>Expand All</Button>
                                  <Button onClick={collapseAll}>Collapse All</Button>
                                </ButtonToolbar>   
                              </div>
                        

                            {/* DISPLAY DISCUSSION DATA */}
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <EnhancedTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>

                                    {searchResults.slice().sort(getComparator(order, orderBy)).map((row, index) => (
                                        <Row key={row.user_id} row={row}/>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </div>)}

                    </div>   
                  </div>
                </div>
              </div>



            {/* CLOSING TAG FOR STYLING */}
            </div>  

        {/* FINAL CLOSING TAG */}
        </div>

    )
}

export default DiscussionSummary