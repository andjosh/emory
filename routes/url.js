// jshint esnext:true
var Parser      = require('../lib/parser'),
    Message     = require('../models/message');

module.exports = function (app, route){

app.use(route.post('/send', function* () {
    'use strict';
    var array = yield JSON.parse(
            this.request.body.fields.mandrill_events
        );

    this.body = array.map(Parser);
}));

};
