"use strict";
const mongoose = require('mongoose');
const eloPlugin = require('./../index.js');
let testSchema = new mongoose.Schema({
    name: 'String'
});

// Add the plugin to the test model
testSchema.plugin(eloPlugin);

module.exports = mongoose.model('TestModel', testSchema);
