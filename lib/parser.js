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
    this.dateFound = false;
    this.msg = msg.msg;
    this.time = (new Date()) - (1000 * 60 * 60 * 24);
    this.triggers = [
        new RegExp("Emory","g"),
        new RegExp("recall","g"),
        new RegExp("Recall","g")
    ]; // = app.registeredTriggers();
    this.findTriggers();
    if (!this.foundAny) this.saveMessage();
    if (this.foundAny) this.reply();
    return this.foundAny;
}

Parser.prototype.findTriggers = function (){
    var d = 1;

    this.triggers.map(function(e){
        if (this.msg.text.match(e)){
            this.foundTriggers.push(e);
            this.foundAny = true;
        }
    }.bind(this));
    if (this.foundAny && this.msg.text.match(/days ago/)){
        d = this.msg.text.split('days ago')[0].split(' ');
        d = parseFloat(d[d.length - 1], 10);
        this.time = (new Date()) - (1000 * 60 * 60 * 24 * d);
    }
};

Parser.prototype.saveMessage = function (){
    var message;

    message = new Message(this.msg);
    message.save(function(err, message){
        if (err){
            console.log(err);
        } else {
            this.message = message;
        }
    }.bind(this));
};

Parser.prototype.reply = function (){
    Message.find({
        from_email: this.msg.from_email,
        created: {
            $gte: this.time
        }
    }).lean().exec(function(err, msgs){
        if (err) console.log(err);
        if (msgs){
            mandrill('/messages/send', {
                message: {
                    to: [
                        {
                            email: this.msg.from_email
                        }
                    ],
                    from_email: "send@emory.andjosh.com",
                    from_name: "Emory andjosh",
                    subject: "Emory recalls back " + 
                        (new Date(this.time)).toLocaleDateString(),
                    text: msgs.map(Message.formatMsg).join('\n---\n')
                }
            }, function (err, res){
                if (err) console.log( JSON.stringify(err) );
                else console.log(res);
            });
        }
    }.bind(this));
};
