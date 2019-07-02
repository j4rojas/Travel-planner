"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a restaurant
const personSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: {type:String, required:true},
  userName: {
      type:'string',
      unique: true
  }
});   

const eventSchema = mongoose.Schema({
    location: {type: String, required: true},
    eventName: {type: String, required: true},
    startDate: {type:Date, required:true},
    //startTime:{type:Date}
    endDate: {type:Date, required:true},
    //endTime: {type:DataTypes.Time, required:true},

});

const scheduleSchema = mongoose.Schema({
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person'},
    location: {type: String, required: true },
    startDate: {type: Date,trim:true, required: true },
   // startTime: {type:DataTypes.Time, required:true},
    endDate: {type: Date, required: true },
    //endTime: {type:DataTypes.Time, required:true},
    event: {type: String, required: true}
});

personSchema.methods.serialize = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    userName: this.userName,
    email: this.email,
    password: this.password
    //gender: this.gender,
    //status: this.status
  };
};

scheduleSchema.pre('find',function(next){
    this.populate('person');
    next();
});

scheduleSchema.pre('findOne', function(next) {
    this.populate('person');
});

scheduleSchema.virtual('personName').get(function(){
    return `${this.person.firstName} ${this.person.lastName}`.trim();
});


eventSchema.methods.serialize = function() {
    return {
      id: this._id,  
      location: this.location,
      eventName: this.event,
      startDate: this.startDate,
      //startTime: this.startTime,
      endDate: this.userName,
      //endDate: this.endDate,
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

var Person = mongoose.model('Person', personSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);  
const Event = mongoose.model('Event',eventSchema);

module.exports = { Person, Schedule,Event};

