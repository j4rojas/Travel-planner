const express = require('express');
const router = express.Router();
const Schedule = require('../models').Schedule;
const jwt = require('jsonwebtoken');

function verifyToken (req,res,next) {
    const token = req.params.token;
    console.log(token);
    if(!token) {
        res.status(400).json({message:'token not provided'});
        return
    }
    jwt.verify(token,'shhhhh',(error,userObj) => {
        if(error){
            res.status(400).json({message:'invalid token'});
            return 
        }
        req.user=userObj 
        next()
    })
}

router.get('/', (req, res) => {
    res.json({
        message: 'testing get endpoint',
    })
});

router.get('/all/:token',verifyToken,(req, res) => {
    Schedule 
    .find({person:req.user.id})
    .then(schedules => res.json(schedules))
    .catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'})
    });
});    
    
router.get('/one/:id/:token',verifyToken,(req,res) => {
    Schedule 
    .findById(req.params.id)
    .then(schedule => {
        if(schedule.person===req.user.id) {
        res.json(schedule.serialize())
        }
        else {
            res.status(400).json({message:'User does not belong to schedule'})
        }
    })
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


router.post('/new/:token', verifyToken, (req, res) => {  
    console.log(req.body);
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
            person: req.user.id,
            location: req.body.location,                                   
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endDate: req.body.endDate,
            endTime: req.body.endTime,
            event: req.body.event 
        })
        .then(schedule => res.status(201).json(schedule.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/one/:id/:token',verifyToken, (req,res) => {
    
    console.log(req.params.id);
    console.log('best');
    Schedule.findByIdAndUpdate(req.params.id, function(err,schedule){
        console.log('inside findById');
        console.log(err);
        console.log(schedule);
    })

    //create object for update 
    /*Schedule 
        .findById(req.params.id)
        .then(schedule => {
            console.log('inside find by id');
            console.log(schedule.person);
            console.log(req.user.id);
           if(schedule.person ===req.user.id) {
            schedule.location = req.body.location,
            schedule.startDate = req.body.startDate,
            schedule.startTime = req.body.startTime,
            schedule.endDate = req.body.endDate,
            schedule.event = req.body.event
            schedule.save()
            .then(schedule => schedule.serialize())
            .catch(err => res.status(500).json({message: 'Internal server error'}));
           }
           else{
               res.status(400).json({message:'schedule does not match'});
           }
        })
        .catch(err => res.status(500).json({message: 'Internal server error'})); */
});

router.delete('/one/:id/:token',verifyToken,(req,res)=> {
    Schedule
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        });
});
module.exports = router;
