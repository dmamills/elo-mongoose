'use strict';
var mongoose = require('mongoose');
var connectionString = 'mongodb://localhost:27017';
process.env.NODE_ENV = 'test';

beforeEach(function (done) {


  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }


  let options = {
    server: {
        poolSize: 10,
        socketOptions: {
            keepAlive: 500
        }
    }
  };
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(connectionString, options, function (err) {
      if (err) {
        throw err;
      }
      return clearDB();
    });
  } else {
    return clearDB();
  }
});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});
