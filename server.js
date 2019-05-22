'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;



const app = express();

app.use('/', express.static('public'))
app.use(morgan('common'));
app.use(express.json());

app.get('/schedule', (req, res) => {
    res.json({
        message: 'testing get endpoint',
    })
});

const port = 2020;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
