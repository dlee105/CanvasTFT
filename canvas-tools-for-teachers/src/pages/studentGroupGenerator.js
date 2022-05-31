// PROTOTYPE ONLY - THIS TOOL HAS NOT BEEN FULLY IMPLEMENTED AS THERE ARE SOME FEATURES THAT ARE NOT FUNCTIONAL

import Navbar from "../components/navbar";
import titleCard1 from "../assets/groupGenerator-full.png";
import './tools.css';

import { useState, useEffect, React, Fragment} from 'react';
import CsvDownload from 'react-json-to-csv';

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

import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import CloseIcon from '@mui/icons-material/Close';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Papa from "papaparse";


function StudentGroupGenerator(){
    const [courses, setCourses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [exportData, setExportData] = useState();

    const [selectedCourseId, setSelectedCourseId] = useState();
    const [selectedGroupId, setSelectedGroupId] = useState();
    const [selectedGroup, setSelectedGroup] = useState();

    const [studentsToAdd, setStudentsToAdd] = useState([]);
    const [disableAddButton, setDisableAddButton] = useState(true);

    const [refreshToggle, setRefreshToggle] = useState(true);
    const [expandAll, setExpandAll] = useState(true);

    const [gmodalOpen, setGmodalOpen] = useState(false); //new group modal
    const [smodalOpen, setSmodalOpen] = useState(false); //add student modal

    const [newGroupName, setNewGroupName] = useState();
    const [nameError, setNameError] = useState(false);
    const [nameErrorMsg, setNameErrorMsg] = useState('please enter a group name');

    const [openAlert, setOpenAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState();

    //styling for modal menus
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 420,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 4,
      };

    // 2022 new styling for csv upload

    // ***************************************
    const [csvmodalOpen, setCSVmodalOpen] = useState(false); //csv import modal
    const [importedCsvFileInJSON, setParsedCSVFile] = useState([]); // actual CSV data parsed as JSON **difficult to use**

    const [tempModalOpen, setTempModal] = useState(false);
    const [verifyGroup, setVerifyGroups] = useState([]); // easy to use/read JSON form of CSV file **use this over importedCsvFileInJSON**

    const [groupSetInputOpen, setGroupSetModal] = useState(false);
    const [groupSets, setGroupSets] = useState([]);
    const [groupSetID, setGroupSetID] = useState(null);
    const [groupSetName, setNewGroupSetName] = useState();

    const setDefaultGroupSet = () => {
        setGroupSetID(null);
        setNewGroupName();
    }

    

    const uploadCSVStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 4,
    };

    const verificationModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 1000,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 4,
    };

    const groupSetNameModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 250,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '5px',
        p: 4,
    };


    const handleFileUploadChange = (e) => {
        
            let file = e.target.files[0];
            //console.log('file type is: ', file.type);
            // check csv
            if (file.type === 'application/vnd.ms-excel' || file.type === 'text/csv') { 
                console.log(file);
                if (file) {
                    Papa.parse(file, {
                        header: true,
                        complete: results => {
                                                console.log('result:', results.data);
                                                setParsedCSVFile(results.data);
                                            }
                    });
                }
            }
        
    }

    const handleUploadCSV = () => {
        if (importedCsvFileInJSON === null) {window.alert('Upload a file!'); return;}
        //console.log(importedCsvFileInJSON);
        setParsedCSVFile(null);
        setCSVmodalOpen(false); // change to opening up another tab displaying groups to be made
    }





    // CLOSING MODALS
    const handleCSVmodalClose = () => {
        setCSVmodalOpen(false);
    }

    const handleTempModalClose = () => {
        setTempModal(false);
    }

    const handleGroupSetModalClose = () => {
        setGroupSetModal(false);
    }
    // ********************************




    const handleVerifyCSVformat = () => {
        if (importedCsvFileInJSON == []) {
            setCSVmodalOpen(false);
            window.alert("CSV File Headers Are Not Accepted");
        }
        else {
            setCSVmodalOpen(false);
            setTempModal(true);
        }
    }

    const parseVerify = (jsonFile) => {
        let parsed = []
        let students = []
        let lastGroup = ""
        
        for(let i = 0; i < jsonFile.length; i++){
            let item = jsonFile[i]
            if (lastGroup == "") {
                lastGroup = item["group"]
            }
            
            else if (item["group"] != lastGroup) {
                parsed.push({"group": lastGroup, "students" : students})
                lastGroup = item["group"]
                students = []
                
            }
            students.push({"student name" : item["student name"], "student id" : item["student id"]})
            
            
            //console.log(item['student name'], item['group'], "result", students);
        }
        parsed.push({"group": lastGroup, "students" : students})
        //console.log(parsed);
        
        
        
        setVerifyGroups(parsed);

      }

    // ***************************************

    // API rework
    const handleNewGroupSetSubmit = (e) =>{
        e.preventDefault()
        console.log("Current Group Set name:", groupSetName)
        if (groupSetName === undefined || groupSetName.length < 1) {
            setNameErrorMsg('please enter a group name');
            setNameError(true);
        } else if (groupSetName.length > 255) {
            setNameErrorMsg('please enter a valid name under 255 characters');
            setNameError(true);
        } else if (selectedCourseId === undefined) {
            setNameErrorMsg('please select a course');
            setNameError(true);
        } else {
            //post function needs fixing
            console.log("group name", groupSetName);
            postGroupSet();
            setGroupSetModal(false);
            handleAlertOpen('Group Set successfully created');
        }
    }


    


    //Fetch all courses for the logged user
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
        parseCourses(courseBody);
        }
      getCourseBody();
    }, [])  

    

    //Fetch all groups in a given course
    useEffect(() => {
        let groupBody; 
        const getGroupBody = async () => {
            const gResponse = await fetch(`http://localhost:9000/canvasAPI/groups?id=${selectedCourseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,
            {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         }
            })
        groupBody = await gResponse.json()
        parseGroups(groupBody);
      }
      if (selectedCourseId !== undefined){
          getGroupBody();
      }
    }, [selectedCourseId])

    // Fetch all students in a given course. Used when adding students to a group
    useEffect(() => {
        let studentBody; 
        const getStudentBody = async () => {
            const sResponse = await fetch(`http://localhost:9000/canvasAPI/enrolledStudents?id=${selectedCourseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,{
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                }
            })
            studentBody = await sResponse.json()
            parseStudents(studentBody);
        }
        if (selectedCourseId !== undefined){
            getStudentBody();
        }
    }, [selectedCourseId])
    
    useEffect(() => {
        let getGroupSetResponse;
        const getGroupSetBody = async () => {
            const ggsResponse = await fetch(`http://localhost:9000/canvasAPI/groupCategory?id=${selectedCourseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,
            {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         }
                //body: JSON.stringify({'course_id': selectedCourseId, 'name': groupSetName, 'self_signup': "restricted"})
            })
            getGroupSetResponse = await ggsResponse.json()
            console.log('Group Sets:', getGroupSetResponse);
        }
        getGroupSetBody();
    
    }, [selectedCourseId])

    useEffect(() => {
        let getGroupsFromGroupSet;
        const getGroupBody2 = async () => {
            const ggResponse2 = await fetch(`http://localhost:9000/canvasAPI/groups?id=${groupSetID}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,
            {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         }
            })
            getGroupsFromGroupSet = await ggResponse2.json()
            console.log('Group Sets:', getGroupsFromGroupSet);
        }
        getGroupBody2();
    
    }, [groupSetID])

    const postGroupSet = () => {
        console.log("group name", groupSetName);
        let getGroupSetResponse;
        const getGroupSetBody = async () => {
            const pgsResponse = await fetch(`http://localhost:9000/canvasAPI/groupCategory?id=${selectedCourseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,
            {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         },
                body: JSON.stringify({'course_id': selectedCourseId, 'name': groupSetName})
            })
            getGroupSetResponse = await pgsResponse.json();
            handlePostingGroupToGroupSet(getGroupSetResponse.id);
        }
        getGroupSetBody();
        
        // ITERATION THROUGH VERIFIEDGROUP
        setVerifyGroups([]);
    }

    const handlePostingGroupToGroupSet = (groupsetid) => {
        for (var key in verifyGroup) {
            postGroupToGroupSet(groupsetid, verifyGroup[key]['group'], verifyGroup[key]['students']);
        }
    }

    const postGroupToGroupSet = (groupsetid, groupName, studentArray) => {
        console.log('gn:', groupName, studentArray);
        let postGroupResponse;
        const postGroup = async () => {
            const pgResponse = await fetch(`http://localhost:9000/canvasAPI/newGroup?id=${groupsetid}&canvasURL=${sessionStorage.getItem('canvasURL')}`,
                {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         },
                body: JSON.stringify({'name': groupName, 'join_level': "parent_context_auto_join"})
                })
                postGroupResponse = await pgResponse.json();
                
                
                
                // API posting students inside the array for the current group
                const currentGroupId = postGroupResponse["id"];
                for (var s in studentArray){
                    postStudentToGroups(currentGroupId, studentArray[s]['student id']);
                }
            }
        postGroup();
    }
   
    const postStudentToGroups = (groupID, user_id) => {
        console.log("id", groupID, "user_id", user_id);
        let postStudentResponse;
        const postStudents = async () => {
            const psResponse = await fetch(`http://localhost:9000/canvasAPI/memberships?id=${groupID}&canvasURL=${sessionStorage.getItem('canvasURL')}`,
            {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                         },
                body: JSON.stringify({'user_id': user_id})
                })
            postStudentResponse = await psResponse.json();
        }
        postStudents();
    }

 

    const createExportData = (data) => {
        let exportData = []
        for(let i = 0; i < data.length; i++){
            let group = data[i]
            let students = group.students;
            for(let k = 0; k < students.length; k++) {
                exportData.push({"group" : group.label,
                                "group id" : group.value,
                                "student name": students[k].name,
                                "student id": students[k].id})
            }
        }
        setExportData(exportData);
    }

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
  
    const parseGroups = (groupBody) => {
      let parsed = []
      for(let i = 0; i < groupBody.length; i++){
          let item = groupBody[i]
          if("name" in item && "id" in item){
            let students = []
            for(let i = 0; i < item['users'].length; i++){
                students.push({"name" : item.users[i].name, "id" : item.users[i].id})
            }
            parsed.push({"label" : item.name, "value" : item.id, "students" : students})
          }
      }
      setGroups(parsed)
      createExportData(parsed);
      console.log(groups);
    }

    const parseStudents = (studentBody) => {
        let parsed = []
        for(let i = 0; i < studentBody.length; i++){
            let item = studentBody[i]
            if("name" in item && "id" in item){
            parsed.push({"label" : item.name, "value" : item.id})
            }
        }
        setStudents(parsed)
        console.log(students);
    }

    // Function returning expandable portion of Table
    const Row = (props) => {
        const { row } = props;
        const [open, setOpen] = useState(expandAll);

        return (
            <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        component="th" 
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    <Typography style={{display: "inline"}}>{row.label}</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 5 }}>
                    <Table size="small" aria-label="students">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography>Student name</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Id</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {row.students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.id}</TableCell>
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
    

    // TODO: PUT request needs fixing, currently doesn't work
    const putStudents = (courseId) =>{
        let putStudentsResponse
        const putStudentsBody = async () => {
            const psResponse = await fetch(`http://localhost:9000/canvasAPI/editGroup?id=${courseId}&canvasURL=${sessionStorage.getItem('canvasURL')}` ,{
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                },
                body: JSON.stringify({'members[]': studentsToAdd})
            })
            putStudentsResponse = await psResponse.json()
        }
        putStudentsBody()
    }

    const postGroup = () =>{
        let postGroupResponse
        const postGroupBody = async () => {
            const pgResponse = await fetch(`http://localhost:9000/canvasAPI/newGroup?canvasURL=${sessionStorage.getItem('canvasURL')}` ,{
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
                },
                body: JSON.stringify({'name': newGroupName, 'context_type': 'Course'})
            })
            postGroupResponse = await pgResponse.json()
        }
        postGroupBody()
    }

    const handleAddStudents = () =>{
        putStudents(selectedGroupId);
        handleSModalClose()
        handleAlertOpen('Students successfully added');
    }

    const handleSModalClose = () =>{
        setDisableAddButton(true)
        setSmodalOpen(false)
    }

    



    //TODO: Add appropriate POST request in backend



    const handleNewGroupSubmit = (e) =>{
        e.preventDefault()
        if (newGroupName === undefined || newGroupName.length < 1) {
            setNameErrorMsg('please enter a group name');
            setNameError(true);
        } else if (newGroupName.length > 255) {
            setNameErrorMsg('please enter a valid name under 255 characters');
            setNameError(true);
        } else {
            //post function needs fixing
            postGroup();
            if (studentsToAdd.length > 0) {
                //putStudents(group id of newly created group)
            }
            setNewGroupName('');
            setGmodalOpen(false);
            handleAlertOpen('Group successfully created');
        }
    }

    const handleAlertOpen = (alertMsg) =>{
        setRefreshToggle(!refreshToggle);
        setStudentsToAdd([]);
        setAlertMsg(alertMsg);
        setOpenAlert(true);
    }

    

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return(
        <div>
            <Navbar></Navbar>
            <div className="StudentGroupGenerator">
            
                {/* TODO: replace w/ appropriate image */}
                <img src={titleCard1} alt={"A table that displays information about student groups"}></img>              

                {/* tool description */}
                <div className="container">
                    <div className="row align-items-start">
                    <div className="col-md-6">
                        <h2>Student Group Generator</h2>
                    </div>
                    <div className="col-md-6">
                        <p>
                            Automate the creation of student groups for any and all of your published courses. 
                            Generate, export, and modify all groups under one view.
                            <br></br>
                            <br></br>
                        </p>
                    </div>
                    </div>
                </div>

                <div className="card border-0">
                    <div className="container">
                        <div className="row">
                            {/* Dropdown to select a course to display groups for */}
                            <div className="col-md-6">
                                <Autocomplete 
                                    style = {{backgroundColor:'white'}}
                                    disableClearable
                                    disablePortal
                                    id="courseSelect"
                                    options={courses}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Select a course" placeholder="search courses"  />}
                                    onChange = {(event, value) =>{
                                                        if (value !== null){
                                                            setSelectedCourseId(value.value)
                                                        }
                                                        setRefreshToggle(!refreshToggle)
                                                        setSelectedGroupId() }} />
                            </div>

                            {/* Dropdown to select a single group from a given course to view */}
                            <div className="col-md-6">
                                <Autocomplete 
                                    style = {{backgroundColor:'white'}}
                                    key={refreshToggle}
                                    disableClearable
                                    disablePortal
                                    id="groupSelect"
                                    options={groups}
                                    sx={{ width: '100%' }}
                                    renderInput={(params) => <TextField {...params} label="Select a group" placeholder="search groups"  />}
                                    onChange = {(event, value) =>{
                                                        if (value !== null){ 
                                                            setSelectedGroupId(value.value)
                                                            let result = groups.filter(obj => {
                                                                return obj.value === value.value
                                                            })
                                                            setSelectedGroup(result)
                                                        } }} />         
                            </div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom:'20px', padding: '0px 15px 0px 15px'}}>    
                                <div>
                                    <Button size="small" onClick={()=>{setGmodalOpen(true)}} style={{margin: '10px 5px 5px 0px', padding: '8px', outline:'none'}} variant="contained">
                                        <AddIcon></AddIcon>
                                        New Group
                                    </Button>
                                    <Button size="small" onClick={()=>{setSmodalOpen(true)}} style={{margin: '10px 5px 5px 0px', padding: '8px', outline:'none'}} variant="contained">
                                        <AddIcon></AddIcon>
                                        Add Students
                                    </Button> 
                                </div>
                                <Button disableRipple size="small" onClick={()=>{setSelectedGroupId(); setRefreshToggle(!refreshToggle)}} style={{margin: '10px 0px 5px 0px', padding: '8px', outline:'none'}} variant="text">
                                        Clear Groupview
                                </Button> 
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom:'20px'}}>
                    <Button size="small" onClick={()=>{setExpandAll(!expandAll)}} style={{ padding:'5px', margin: '0px 5px 0px 5px', outline:'none'}} variant="outlined">
                        {expandAll? <UnfoldLessIcon></UnfoldLessIcon>: <UnfoldMoreIcon></UnfoldMoreIcon>}{expandAll? 'Collapse All': 'Expand All'}
                    </Button>
                    {/*TODO: add functionality, Button to upload CSV file for group creation */}
                    <Button id="importBtn" size="small" onClick={()=>{setCSVmodalOpen(true)}} style={{ padding:'5px', margin: '0px 5px 0px 5px', outline:'none'}} variant="outlined">Import CSV</Button>
                    
                    <Button size="small" style={{ padding:'5px', margin: '0px 5px 0px 5px', outline:'none'}} variant="outlined">
                        {exportData===undefined?
                            <div>EXPORT ALL AS CSV</div>
                        :
                            <CsvDownload  style={{backgroundColor:'#FFFFFF', padding:'0px', outline:'none'}} data={exportData} filename="StudentGroupData.csv"> 
                                EXPORT ALL AS CSV
                            </CsvDownload>
                        }
                    </Button>
                </div>
                
                {/* Modal when creating new group */}
                
                <Modal
                    open={gmodalOpen}
                    onClose={()=>{setNameError(false)
                                  setGmodalOpen(false)}}
                    aria-labelledby="modal-create-group"
                    aria-describedby="modal-create-new-group"
                >
                    <Box sx={modalStyle}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography id="modalAddStudent" variant="h6" component="h2">
                            New Group
                            </Typography>
                            <button style={{background: 'none', border: 'none', padding: '0', outline: 'inherit'}}onClick={()=>{setGmodalOpen(false)}}>
                                <CloseIcon></CloseIcon>
                            </button>
                        </div>

                        <form noValidate autoComplete="off" onSubmit={handleNewGroupSubmit}>
                            <div style={{height: '280px', marginTop: '10px'}}>
                                {/* Input for name of new group */}
                                <TextField 
                                    fullWidth
                                    required
                                    error={nameError}
                                    margin="normal" 
                                    size="small" 
                                    id="groupname-field"
                                    label="Group name" 
                                    variant="outlined"
                                    helperText={nameError? nameErrorMsg : ""}
                                    onChange={(e) => {setNameError(false)
                                                      setNewGroupName(e.target.value)}}
                                />

                                {/* Dropdown to add students to new group on creation*/}
                                <Autocomplete
                                    style={{width: '100%', maxHeight: '160px', overflow: 'auto', overflowX: 'hidden'}}
                                    key={refreshToggle}
                                    multiple
                                    size="small"
                                    id="add-students-to-new-group"
                                    options={students}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.label}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                            checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.label}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} variant="standard" label="Select students to add" placeholder="search students" />
                                    )}
                                    onChange = {(event, value) =>{
                                            const studentIds = value.map((student) => student.value)
                                            setStudentsToAdd(studentIds)               
                                    }} />
                                </div>

                                <Button size="small" type="submit" style={{padding:'8px', float: 'right', outline:'none'}} variant="contained">Create</Button>                               
                        </form>
                      
                    </Box>
                </Modal>

                {/* Modal when adding students to existing group */}
                <Modal
                    open={smodalOpen}
                    onClose={handleSModalClose}
                    aria-labelledby="modal-add-students"
                    aria-describedby="modal-add-students-to-group"
                >
                    <Box sx={modalStyle}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography id="modalAddStudent" variant="h6" component="h2">
                            Add Students
                        </Typography>
                        <button style={{background: 'none', border: 'none', padding: '0', outline: 'inherit'}}onClick={handleSModalClose}>
                            <CloseIcon></CloseIcon>
                        </button>
                    </div>
                    <div style={{height: '280px', marginTop: '10px'}}>

                        {/* Dropdown to select group to add students to */}
                        <Autocomplete 
                            style = {{margin: '10px 0px 20px 0px', backgroundColor:'white'}}
                            size="small"
                            disablePortal
                            disableClearable
                            id="groupSelect"
                            options={groups}
                            sx={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} variant="standard" label="Select a group" placeholder="search groups" />}
                            onChange = {(event, value) =>{
                                                if (value !== null){ 
                                                    setSelectedGroupId(value.value)
                                                    let result = groups.filter(obj => {
                                                        return obj.value === value.value
                                                    })
                                                    setSelectedGroup(result)
                                                    setDisableAddButton(false);
                                                } }} />
                      
                         {/* Dropdown to select students to add
                            TODOS:  -display students in selected group as already checked
                                    -disable adding students who are already in another group? (can students be in multiple groups?)
                         */}
                        <Autocomplete
                            style={{width: '100%', maxHeight: 160, overflow: 'auto', overflowX: 'hidden', margin: '10px 0px 20px 0px', backgroundColor: 'white'}}
                            size="small"
                            key={refreshToggle}
                            multiple
                            id="add-students"
                            options={students}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                <Checkbox
                                    icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                    checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                    style={{ marginRight: 8 }}
                                    checked={selected}
                                />
                                {option.label}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} variant="standard" label="Select students to add" placeholder="search students" />
                            )}
                            onChange = {(event, value) =>{
                                    const studentIds = value.map((student) => student.value)
                                    setStudentsToAdd(studentIds)               
                                }} />
                    </div>
                    <Button size="small" disabled={disableAddButton} onClick={handleAddStudents} style={{padding:'8px', float: 'right', outline:'none'}} variant="contained">Add</Button>
                    </Box>
                </Modal>
                
                {/* Modal For Uploading Student Groups With CSV */}
                <Modal 
                    open={csvmodalOpen}
                    onClose={handleCSVmodalClose}
                    aria-labelledby="modal-import-csv"
                    aria-describedby="modal-upload-csv-class-groups" 
                >
                    <Box sx={uploadCSVStyle} style={{backgroundColor: "#E4D4D1"}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <h2 style={{color: 'black', marginTop: '-10px'}}> CSV </h2>
                            <h2 style={{color: 'red', marginTop: '-10px', marginLeft: '-215px'}}> Upload</h2>
                            <button style={{background: 'none', border: 'none', padding: '0', outline: 'inherit'}}onClick={()=>{setCSVmodalOpen(false)}}>
                                <CloseIcon></CloseIcon>
                            </button>
                        </div>
                        
                        
                        <div style={{height: '150px', marginTop: '-15px', backgroundColor: "#FFFFFF"}}>
                            <p style={{marginTop: '30px', marginLeft: '10px'}}> Upload CSV file Here </p>
                            <label style={{marginLeft: '10px'}}>
                                <input 
                                type="file"
                                accept=".xlsx,.csv"
                                onChange={handleFileUploadChange}
                                required
                                />
                            </label>
                        </div>
                        <Button size="small" type="submit" style={{padding:'8px', marginTop: '10px', float: 'right', outline:'none'}} variant="contained" onClick={()=>{handleVerifyCSVformat(); console.log(JSON.stringify(importedCsvFileInJSON)); parseVerify(importedCsvFileInJSON)}}>Upload</Button> 
                    </Box>
                    
                </Modal>

                {/* Temporary Verification Modal */}

                <Modal
                    open={tempModalOpen}
                    onClose={handleTempModalClose}
                    aria-labelledby="modal-import-csv"
                    aria-describedby="modal-upload-csv-class-groups" 
                    >
                        <Box sx={verificationModalStyle} style={{backgroundColor: "#E4D4D1", overflowY: "scroll"}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <b style={{color: 'black', marginTop: '-10px'}}> VERIFY GROUP ASSIGNMENT </b>
                                <button style={{background: 'none', border: 'none', padding: '0', outline: 'inherit'}}onClick={()=>{setTempModal(false)}}>
                                    <CloseIcon></CloseIcon>
                                </button>
                            </div>
                            <div style={{marginInline: '40px'}}>
                                <i> The following is the result of importing your CSV file, please confirm</i>
                            </div>
                            <div style={{marginTop: '25px'}}> 
                                { 
                                verifyGroup.map(post => {
                                    return( <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <b style={{color:"red", marginLeft: '-10px', }}>{ post.group }</b>
                                        <Table size="small" aria-label="students" style={{marginLeft: '25px'}}>
                                            <TableHead>
                                                <TableRow style={{backgroundColor: "#AB194D"}}>
                                                    <TableCell>
                                                        <Typography style={{ color: "white", fontSize: "12px"}}>STUDENT NAME</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography style={{ color: "white", fontSize: "12px"}}>STUDENT ID</Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {post.students.map((student) => (
                                                <TableRow key={student["student id"]}>
                                                    <TableCell>{student["student name"]}</TableCell>
                                                    <TableCell>{student["student id"]}</TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                        </div>
                                    )
                                }) 
                                }
                            </div>
                            <div>
                            <Button size="small" type="submit" style={{padding:'8px', marginRight: '340px', float: 'none', outline:'none'}} variant="contained" onClick={()=>{setTempModal(false)}}>Cancel</Button> 
                            <Button size="small" type="button" style={{padding:'8px', marginRight: '20px', float: 'none', outline:'none'}} variant="contained" onClick={()=>{setGroupSetModal(true); setTempModal(false)}}>Confirm</Button> 
                            </div>
                        </Box>
                </Modal>
                
                <Modal
                    open={groupSetInputOpen}
                    onClose={handleGroupSetModalClose}
                    aria-labelledby="modal-import-csv"
                    aria-describedby="modal-upload-csv-class-groups" 
                    >
                    <Box sx={groupSetNameModalStyle} style={{backgroundColor: "#FFFFFF"}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography id="modalAddStudent" variant="h6" component="h2">
                            Create New Group Set
                            </Typography>
                            <button style={{background: 'none', border: 'none', padding: '0', outline: 'inherit'}}onClick={()=>{setGroupSetModal(false)}}>
                                <CloseIcon></CloseIcon>
                            </button>
                        </div>
                        <form noValidate autoComplete="off" onSubmit={handleNewGroupSetSubmit}>
                            <div style={{height: '100px', marginTop: '10px'}}>
                                {/* Input for name of new group set */}
                                <TextField 
                                    fullWidth
                                    required
                                    error={nameError}
                                    margin="normal" 
                                    size="small" 
                                    id="groupname-field"
                                    label="Group Set Name" 
                                    variant="outlined"
                                    helperText={nameError? nameErrorMsg : ""}
                                    onChange={(e) => {setNameError(false)
                                                    setNewGroupSetName(e.target.value)}}
                                />

                              
                                
                                </div>

                                <Button size="small" type="submit" style={{padding:'8px', float: 'right', outline:'none'}} variant="contained"  >Set Name</Button>                               
                        </form>

                    </Box>
                        
                </Modal>



                

                        





















                {/* Success alert/toast */}
                <Snackbar open={openAlert} autoHideDuration={3000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>{alertMsg}</Alert>
                </Snackbar>

                {/* Table displaying group information */}
                <TableContainer component={Paper}>
                    {groups.length !== 0? 
                    <Table aria-label="collapsible table">
                        <TableBody>
                        {(selectedGroupId===undefined? groups : selectedGroup).map((row, index) => (
                            <Row key={row.value} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                    :
                    <div style={{textAlign: 'center', padding: '50px'}}>No data found</div>
                    }
                </TableContainer>
            </div> 
        </div>
    )
}

export default StudentGroupGenerator