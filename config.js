"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb+srv://j4rojas:Penny01@my-first-atlas-db-h4euo.mongodb.net/rotation-app?retryWrites=true&w=majority"
  //process.env.TEST_DATABASE_URL || "mongodb://localhost/test-rotation-app";
exports.PORT = process.env.PORT || 2020;

