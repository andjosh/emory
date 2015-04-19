/**
  * Message
  *
  */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Message = new Schema({
        subject: {
            type: String, 
            default: ''
        },
        tags: [String],
        text: String,
        raw: String,
        html: String,
        from_email: String,
        to: [[String, String]],
        created: {
            type: Date,
            default: new Date()
        }
    });

Message.statics.formatMsg = function (msg){
    var d = new Date(),
        a = (d - msg.created) / (1000 * 60 * 60).toFixed(2),
        t = msg.text.split('\n').join('\n> ');

    return [
        ("### " + a + " days ago"), 
        msg.subject, 
        ("> " + t)
    ].join('\n');
};

module.exports = mongoose.model('Message', Message);
