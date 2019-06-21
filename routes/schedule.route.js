const express = require('express');
const router = express.Router();
const Schedule = require('../models').Schedule;

router.get('/', (req, res) => {
    res.json({
        message: 'testing get endpoint',
    })
});

router.get('/all',(req, res) => {
    Schedule 
    .find(req.params)
    .then(schedules => res.json(schedules))
    .catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'})
    });
});    
    

router.get('/one/:id',(req,res) => {
    Schedule 
    .findById(req.params.id)
    .then(schedule => res.json(schedule.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'})
    });
});

router.get('/schedule',(req,res)=> {
    const filters = {};
    const queryableFields = ['startDate', 'endDate', 'event'];
    queryableFields.forEach(field => {
        if(req.query[field]) {
            filters[field] = req.query[field];
        }
    });
    Schedule
        .find(filters)
        .then(schedule => res.json(
            Schedule.map(schedule => schedule.serialize())
        ))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.post('/new', (req, res) => {
    const requiredFields = ['location', 'startDate','endDate', 'event'];
    for (let i=0; i<requiredFields.length; i++) {
        const field= requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Schedule
        .create({
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            event: req.body.event 
        })
        .then(schedule => res.status(201).json(schedule.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/one/:id', (req,res) => {
    if(!(req.params.id && req.body.id && req.param ===req.body.id)) {
        const message = 
            `Request path id (${req.params.id}) and request body id` +
            `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({message: message});
    }
    const toUpdate = {};
    const updateableFields = ['location','startDate','endDate','event'];

    updateableFields.forEach(field=> {
        if(field in req.body){
            toUpdate[field] = req.body[field];
        }
    });

    Schedule 
        .findByIDAndUpdate(req.params.id, {$set:toUpdate})
        .then(schedule => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Internal server error'}))
});

router.delete('/schedule/:id',(req,res)=> {
    Schedule
        .findByIDAndRemove(req.params.id)
        .then(() => res.status(204).end())
        .catch(err => res.status(500).json ({message:'Internal server error'}));
});

module.exports = router;


//ability to create event
////= event name
////event date/time
//// assign ppl (search by name, last, or status, only dates entered)
//// if available = green and can be assigned
//// if unavailable red w/ event listed undername

//ability to search for users and their schedules
// can see a month calendar of their plans

//create travel dates
////ability to remove, update, add


////once travel plans are created, all users can see