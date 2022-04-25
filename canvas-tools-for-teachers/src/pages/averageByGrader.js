import Navbar from "../components/navbar";
import titleCard1 from "../assets/averageByGrader-full.png";
import './tools.css';


import{useState, useEffect} from 'react'
import 'rsuite/dist/rsuite.min.css';
import VegaLite from 'react-vega-lite';
import { SelectPicker } from 'rsuite';
import {Handler} from 'vega-tooltip'

function AverageByGrader(){

  const [apiResponse, setApiResponse] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(0);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(0); 

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);


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
    let gradebookHistoryBody;

    const getGradebookHistory = async () => {
        const response = await fetch(`http://localhost:9000/canvasAPI/gradebook_history?id=${selectedCourseId}&pagenum=1&canvasURL=${sessionStorage.getItem('canvasURL')}`,{
            method: "get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
          })
        gradebookHistoryBody = await response.json()
        getAllResponsePages(gradebookHistoryBody);
        // filterGradebookHistoryData();
    }

    getGradebookHistory();
  }, [selectedAssignmentId])

  const getAllResponsePages = async (body) => {
    let result = body

    for (let i=2; body.length!==0;i++){
        const response = await fetch(`http://localhost:9000/canvasAPI/gradebook_history?id=${selectedCourseId}&pagenum=${i}&canvasURL=${sessionStorage.getItem('canvasURL')}`,{
            method: "get",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('token').toString().substring(1, sessionStorage.getItem('token').length - 1)}`
            }
          })
        body = await response.json()
        if(body.length === 0){
            setApiResponse(result)
        }
        
        if(body.length !== 0){
            let newResult = result.concat(body)
            result = newResult
            setApiResponse(newResult)}
    }

  }
  

  const filteredResponse = apiResponse.filter(item=>item["assignment_id"]===selectedAssignmentId)
  const graderData = {"values":filteredResponse}


  const parseCourses = (courseBody) => {
    let parsed = []
        for(let i = 0; i < courseBody.length; i++){
        
          let item = courseBody[i]

          if("name" in item && "id" in item){
            parsed.push({"label":item.name, "value":item.id})
          }
    }

    setCourses(parsed)
  }

  const parseAssignments = (assignmentBody) => {
    let parsed = []
    for(let i = 0; i < assignmentBody.length; i++){
        let item = assignmentBody[i]

        if("name" in item && "id" in item){
          parsed.push({"label":item['name'], "value":item['id']})
        }
    }

    setAssignments(parsed)
  }
    const styles = { width: "100%" , display: 'block', marginBottom: 10 };

    const spec = {
        "title": "TAs Grade Distribution",
        "description": "A horizontal box plot showing median and lower and upper quartiles of the distribution of gradings of different TAs.",
        "width":1000,
        "height":500,
            "layer": [
                {
                  "transform": [
                    {
                      "joinaggregate": [
                        {"op": "q1", "field": "score", "as": "lower_box_score"},
                        {"op": "q3", "field": "score", "as": "upper_box_score"}
                      ],
                      "groupby": ["grader", "grader"]
                    }
                  ],
                  "layer": [
                    {
                      "transform": [
                        {
                          "filter": "(datum[\"score\"] < datum[\"lower_box_score\"] - 1.5 * (datum[\"upper_box_score\"] - datum[\"lower_box_score\"])) || (datum[\"score\"] > datum[\"upper_box_score\"] + 1.5 * (datum[\"upper_box_score\"] - datum[\"lower_box_score\"]))"
                        }
                      ],
                      "mark": {"type": "point", "style": "boxplot-outliers"},
                      "encoding": {
                        "x": {
                          "field": "score",
                          "type": "quantitative",
                          "title": "Score",
                          "scale": {"zero": false},
                          
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        "y": {
                          "field": "grader",
                          "type": "nominal",
                          "title": "Grader",
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        "color": {"field": "grader", "type": "nominal"},
                        "tooltip": {"field": "grade", "type": "quantitative", "title": "Score"}
                      }
                    },
                    {
                      "transform": [
                        {
                          "filter": "(datum[\"lower_box_score\"] - 1.5 * (datum[\"upper_box_score\"] - datum[\"lower_box_score\"]) <= datum[\"score\"]) && (datum[\"score\"] <= datum[\"upper_box_score\"] + 1.5 * (datum[\"upper_box_score\"] - datum[\"lower_box_score\"]))"
                        },
                        {
                          "aggregate": [
                            {"op": "min", "field": "score", "as": "lower_whisker_score"},
                            {"op": "max", "field": "score", "as": "upper_whisker_score"},
                            {
                              "op": "min",
                              "field": "lower_box_score",
                              "as": "lower_box_score"
                            },
                            {
                              "op": "max",
                              "field": "upper_box_score",
                              "as": "upper_box_score"
                            },
                            {"op": "average", "as": "average_grade", "field": "grade"},
                            {"op": "count", "as": "__count", "field": "score"}
                          ],
                          "groupby": ["grader", "grader"]
                        }
                      ],
                      "layer": [
                        {
                          "mark": {
                            "type": "rule",
                            "invalid": null,
                            "aria": false,
                            "style": "boxplot-rule"
                          },
                          "encoding": {
                            "x": {
                              "field": "lower_whisker_score",
                              "type": "quantitative",
                              "title": "Score",
                              "scale": {"zero": false},
                              "axis": {"titleFontSize": 20, "labelFontSize": 12}
                            },
                            "x2": {"field": "lower_box_score"},
                            "y": {
                              "field": "grader",
                              "type": "nominal",
                              "title": "Grader",
                              "axis": {"titleFontSize": 20, "labelFontSize": 12}
                            }
                          }
                        },
                        {
                          "mark": {
                            "type": "rule",
                            "invalid": null,
                            "aria": false,
                            "style": "boxplot-rule"
                          },
                          "encoding": {
                           
                            "x": {
                              "field": "upper_box_score",
                              "type": "quantitative",
                              "title": "Score",
                              "scale": {"zero": false},
                              "axis": {"titleFontSize": 20, "labelFontSize": 12}
                            },
                            "x2": {"field": "upper_whisker_score"},
                            
                            "y": {
                              "field": "grader",
                              "type": "nominal",
                              "title": "Grader",
                              "axis": {"titleFontSize": 20, "labelFontSize": 12}
                              
                            }
                           
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "transform": [
                    {
                      "aggregate": [
                        {"op": "average", "as": "average_grade", "field": "grade"},
                        {"op": "count", "as": "__count", "field": "score"},
                        {"op": "q1", "field": "score", "as": "lower_box_score"},
                        {"op": "q3", "field": "score", "as": "upper_box_score"},
                        {"op": "median", "field": "score", "as": "mid_box_score"},
                        {"op": "min", "field": "score", "as": "min_score"},
                        {"op": "max", "field": "score", "as": "max_score"}
                      ],
                      "groupby": ["grader", "grader"]
                    }
                  ],
                  "layer": [
                    {
                      "mark": {
                        "type": "bar",
                        "size": 14,
                        "orient": "horizontal",
                        "invalid": null,
                        "ariaRoleDescription": "box",
                        "style": "boxplot-box"
                      },
                      "encoding": {
                        "x": {
                          "field": "lower_box_score",
                          "type": "quantitative",
                          "title": "Score",
                          "scale": {"zero": false},
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        "x2": {"field": "upper_box_score"},
                        "y": {
                          "field": "grader",
                          "type": "nominal",
                          "title": "Grader",
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        "color": {"field": "grader", "type": "nominal"},
                        "size": {"value": 30},
                        "tooltip": [{
                              "title": "Grader",
                              "type": "nominal",
                              "field": "grader"
                            },
                          {
                              "title": "Assignments Graded",
                              "type": "quantitative",
                              "field": "__count"
                            }, {
                              "title": "Score Average",
                              "type": "quantitative",
                              "field": "average_grade"
                            }]
                      }
                    },
                    {
                      "mark": {
                        "color": "white",
                        "type": "tick",
                        "invalid": null,
                        "size": 14,
                        "orient": "vertical",
                        "aria": false,
                        "style": "boxplot-median"
                      },
                      "encoding": {
                        "x": {
                          "field": "mid_box_score",
                          "type": "quantitative",
                          "title": "Score",
                          "scale": {"zero": false},
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        "y": {
                          "field": "grader",
                          "type": "nominal",
                          "title": "Grader",
                          "axis": {"titleFontSize": 20, "labelFontSize": 12}
                        },
                        
                        "size": {"value": 30}
                      }
                    }
                  ]
                }
              ]
      };
   
    
    return( 
        <div>
          <Navbar></Navbar>

          <div className="AverageByGrader">
            
            <img src={titleCard1} alt={"Box and whisker plot displaying average of grades produced by total course readers"}></img>              

            <div className="container">
              <div className="row align-items-start">
                <div className="col-md-6">
                  <h2>Average By Grader</h2>
                </div>
                <div className="col-md-6">
                  <p>Compare the average grade given by each course grader or teacher assistant.
                          This data visualization tool displays a interactive boxplot, a standardized way of displaying the distribution of data based on a five number summary. 
                          Uncover instances of outliers and determine if each educator is grading across the same level of difficulty. </p>
                </div>
              </div>
            </div>

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
                                                            setSelectedAssignmentId(0) }} />
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

              
            
            <div id="visualization">
                <VegaLite spec={spec} data={graderData} tooltip={new Handler().call} />
            </div>


          </div>
        </div>
        );
    
       
    
}

export default AverageByGrader;