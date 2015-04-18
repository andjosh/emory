//jshint esnext:true
var Message = require('../models/message');

function Parser (msg){
    if (!(this instanceof Parser)) {
        return new Parser(msg);
    }
    this.foundAny = false;
    this.foundTriggers = [];
    this.msg = msg;
    this.triggers = [
        new RegExp("Emory","g")
    ]; // = app.registeredTriggers();
    this.findTriggers();
    this.saveMessage();
}

Parser.prototype.findTriggers = function (){
    this.triggers.map(function(e){
        if (this.msg.text.match(e)){
            this.foundTriggers.push(e);
            this.foundAny = true;
        }
    }.bind(this));
};

Parser.prototype.saveMessage = function (){
    var message;

    if (!this.foundAny){
        message = new Message(this.msg);
        message.save(function(err, message){
            if (err){
                console.log(err);
            } else {
                console.log('new message', message);
                this.message = message;
            }
        }.bind(this));
    }
};
