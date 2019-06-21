"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const personSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  userName: {
      type:'string',
      unique: true
  }
});   


const scheduleSchema = mongoose.Schema({
    location: {type: String, required: true },
    startDate: {type: Date, required: true },
    endDate: {type: Date, required: true },
    event: {type: String, required: true}
});

personSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName,
    email: this.email,
  };
};

scheduleSchema.methods.serialize = function() {
    return {
      id: this._id,
      location: this.location,
      startDate: this.startDate,
      endDate: this.endDate,
      event: this.event
    };
  };

const Person = mongoose.model('Person', personSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);  

module.exports = { Person, Schedule};

