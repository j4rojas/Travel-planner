const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Person = require('../models').Person;


router.get('/people',(req,res)=> {
    Person
    .find()
    .then(people => {
        res.json(people.map(people => {
            return {
                id: person._id,
                name: `${person.firstName} ${person.lastName}`,
                userName: person.userName
            };
        }));
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error:'something went wrong'});
    });
});

//new User

router.post('/new', (req, res) => {
    const requiredFields = ['firstName', 'lastName','email', 'userName','password'];
    for (let i=0; i<requiredFields.length; i++) {
        const field= requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Person
        .findOne({email:req.body.email}) 
        .then(personFind => {
            if(personFind) {
                res.status(400).json({message:'User already exist'});
            } 
            else {
                bcrypt.hash(req.body.password,10, function(err, hash) {
                if (err) {
                    res.status(500).json({message: 'Internal server error'});
                    return
                }
                Person
                .create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    userName: req.body.userName,
                    email: req.body.email,
                    password: hash,
                    gender: req.body.gender,
                    status: req.body.status
                })
                .then(person => res.status(201).json(person.serialize()))
                .catch(err => {
                    console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({message:'Internal server error'});
    });
   
});

router.post('/login',(req,res)=> {
    Person.findOne({userName:req.body.userName}) 
    .then(personFind => {
        if(!personFind) {
            res.status(400).json({message:'User does not exist', error:true});
            return
        } 
        else {
            if(bcrypt.compareSync(req.body.password, personFind.password)){
                var userObj = {
                    id:personFind._id,
                    email:personFind.email,
                    userName:personFind.userName
                }
                var token = jwt.sign(userObj, 'shhhhh');
                res.status(200).json({message:'login details match',token:token});
                return
            } else {
                res.status(402).json({message:'Password does not match', error:true});
                return
            }
        }
    })
    .catch(err => {
        res.status(500).json({message:'Internal server error'});
    })
   
})

module.exports = router;
