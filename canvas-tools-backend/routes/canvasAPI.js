var express = require("express");
const axios = require("axios")
var router = express.Router();

router.get("/gradebook_history", async (req, res, next) => {
    let url = req.query.canvasURL
    let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
    const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.id}/gradebook_history/feed?page=${req.query.pagenum}&per_page=100`, 
    {
        headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
    });
    
    res.send(response.data)
});

router.get("/courses", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });

router.get("/assignments", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.id}/assignments`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });

    router.get("/peer_reviews", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.course_id}/assignments/${req.query.assignment_id}/peer_reviews?include[]=user&include[]=submission_comments`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });
    
    router.get("/user_info/:id", async (req, res, next) => {
        let user_id = req.params.id
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/users/${user_id}/profile`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        }
        );
        
        // console.log(response)
        res.send(response.data)
    });

    router.get("/discussion_topics", async (req, res, next) => {
        let url = req.query.canvasURL 
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.course_id}/discussion_topics`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });

    router.get("/course_groups", async (req, res, next) => {
        let url = req.query.canvasURL 
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.course_id}/groups`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });

    router.get("/group_discussion_topics", async (req, res, next) => {
        let url = req.query.canvasURL 
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/groups/${req.query.group_id}/discussion_topics`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        // console.log(response)
        res.send(response.data)
    });
    
    // https://canvas.instructure.com:443/api/v1/courses/3737737/discussion_topics/13814926/view
    router.get("/discussion_view", async (req, res, next) => {
        let url = req.query.canvasURL 
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.course_id}/discussion_topics/${req.query.topic_id}/view`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        console.log(response)
        res.send(response.data)
    });

    router.get("/group_discussion_view", async (req, res, next) => {
        let url = req.query.canvasURL 
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/groups/${req.query.group_id}/discussion_topics/${req.query.topic_id}/view`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        
        console.log(response)
        res.send(response.data)
    });
    
    router.get("/groups", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.id}/groups?include[]=users`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        res.send(response.data)
    });

    router.get("/enrolledStudents", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.get(`https://${parsed}/api/v1/courses/${req.query.id}/users?enrollment_type[]=student`, 
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        res.send(response.data)
    });

    router.put("/editGroup", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.put(`https://${parsed}/api/v1/groups/${req.query.id}`,
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}, body: req.body
        });
        res.send(response.data)
    });

    router.post("/newGroup", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response = await axios.post(`https://${parsed}/api/v1/groups`,
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}, body: req.body
        });
        res.send(response.data)
    });

    router.get("/groupCategory", async (req, res, next) => {
        console.log("api", req.headers['authorization'])
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        
        const response =  await axios.get(`https://${parsed}/api/v1/courses/${req.query.id}/group_categories`,
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}
        });
        res.send(response.data)
    });

    router.post("/newgroupCategory", async (req, res, next) => {   
        
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        const response =  await axios.post(`https://${parsed}/api/v1/courses/${req.query.id}/group_categories`,
        {
            method: "post",
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']},
            name: req.body
        });
        
        res.send(response.data)
    
    });


    /*
    router.post("/groupCategory", async (req, res, next) => {
        let url = req.query.canvasURL
        let parsed = req.query.canvasURL.toString().substring(1, url.length-1)
        
        const response =  await axios.post(`https://${parsed}/api/v1/courses/${req.query.id}/group_categories`,
        {
            headers: {'Content-Type': req.headers['content-type'], 'Authorization': req.headers['authorization']}, 
            body: req.body
        });
        res.send(response.data)
    });
    */

    module.exports = router;