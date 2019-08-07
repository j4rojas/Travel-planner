const express = require('express');
const router = express.Router();
const Event1 = require('../models').Event;
const jwt = require('jsonwebtoken');

function verifyToken (req,res,next) {
    const token = req.params.token;
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
    Event1 
    .find({person:req.user.id})
    .then(events => res.json(events))
    .catch(err => {
        console.error(err);
        res.status(500).json({message:'Internal server error'})
    });
});    
    
router.get('/one/:id/:token',verifyToken,(req,res) => {
    Event1 
    .findById(req.params.id)
    .then(event1 => {
        if(event1.person===req.user.id) {
        res.json(event.serialize())
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

router.get('/event',(req,res)=> {
    const filters = {};
    const queryableFields = ['description','startDate', 'endDate'];
    queryableFields.forEach(field => {
        if(req.query[field]) {
            filters[field] = req.query[field];
        }
    });
    Event1
        .find(filters)
        .then(event1 => res.json(
            Event1.map(event1 => event1.serialize())
        ))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'})
        });
});


router.post('/new/:token', verifyToken, (req, res) => {  
    const requiredFields = ['description', 'startDate','endDate'];
    for (let i=0; i<requiredFields.length; i++) {
        const field= requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Event1
        .create({
            person: req.user.id,
            description: req.body.description,                                   
            startDate: req.body.startDate,
            startTime: req.body.startTime,
            endDate: req.body.endDate,
            endTime: req.body.endTime,
        })
        .then(event1 => res.status(201).json(event1.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/one/:id/:token',verifyToken, (req,res) => {
    const toUpdate = {};
    const updateableFields = ['description','startDate','startTime','endDate','endTime'];

    updateableFields.forEach(field=> {
        if(field in req.body){
            toUpdate[field] = req.body[field];
        }
    });

    Event1
        .findById(req.params.id)
        .then(event1 => {
           if(event1.person ===req.user.id) {
            event1.description = req.body.description,
            event1.startDate = req.body.startDate,
            event1.endDate = req.body.endDate,
            event1.save()
            .then(event1 => event1.serialize())
            .catch(err => res.status(500).json({message: 'Internal server error'}));
           }
           else{
               res.status(400).json({message:'event does not match'});
           }
        })
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/one/:id/:token',verifyToken,(req,res)=> {
    Event1
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end();
        });
});
module.exports = router;
