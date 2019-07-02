'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const scheduleRoutes = require('./routes/schedule.route');
const personRoutes = require('./routes/person.route');
const {PORT, DATABASE_URL} = require('./config');

const app = express();

app.use('/', express.static('public'));
app.use(express.json());
app.use('/schedule', scheduleRoutes);
app.use('/person',personRoutes);

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };



//app.listen(port, () => console.log(`Example app listening on port ${port}!`))


//* create DB, make models schema and connect

//1.make mongo in the cloud -> with this done, I will have a string DB in atlas
//2. integrate mongo with express app (server.js)

//lesson 2.1 & 2.4 create account and DB

//schema plan (add, delete schedule)
//do the register
//do the login
//verify token
