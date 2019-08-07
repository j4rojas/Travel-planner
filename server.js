'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const scheduleRoutes = require('./routes/schedule.route');
const personRoutes = require('./routes/person.route');
//const eventRoutes = require('./routes/event.route');
const {PORT, DATABASE_URL} = require('./config');

const app = express();

app.use('/', express.static('public'));
app.use(express.json());
app.use('/schedule', scheduleRoutes);
app.use('/person',personRoutes);
//app.use('/event',eventRoutes);

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
