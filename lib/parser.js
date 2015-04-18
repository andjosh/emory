//jshint esnext:true
var Message     = require('../models/message'),
    mandrill    = require('node-mandrill')(
        process.env.MANDRILL_APIKEY
    );

module.exports = Parser;

function Parser (msg){
    if (!(this instanceof Parser)) {
        return new Parser(msg);
    }
    this.foundAny = false;
    this.foundTriggers = [];
    this.msg = msg.msg;
    this.triggers = [
        new RegExp("Emory","g")
    ]; // = app.registeredTriggers();
    this.findTriggers();
    this.saveMessage();
    if (this.foundAny) this.reply();
    return this.foundAny;
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

Parser.prototype.reply = function (){
    Message.find({
        from_email: this.msg.from_email,
        created: {
            $gte: (new Date()) - (1000 * 60 * 60 * 24)
        }
    }).lean().exec(function(err, msgs){
        mandrill('/messages/send', {
            message: {
                to: [
                    {
                        email: this.msg.from_email
                    }
                ],
                from_email: "send@emory.andjosh.com",
                subject: "Emory recalls " + 
                    (new Date()).toLocaleDateString(),
                text: msgs.map(Message.formatMsg).join('\n---\n')
            }
        }, function (err, res){
            if (err) console.log( JSON.stringify(err) );
            else console.log(res);
        });
    }.bind(this));
};
