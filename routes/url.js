// jshint esnext:true
var Parser      = require('../lib/parser'),
    Message     = require('../models/message');

module.exports = function (app, route){

app.use(route.post('/send', function () {
    'use strict';
    console.log(this.body);
}));

};
