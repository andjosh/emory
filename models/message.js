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
    var d = msg.created.toDateString();

    return [
        ("### " + d), 
        msg.subject, 
        ("> " + msg.text)
    ].join('\n');
};

module.exports = mongoose.model('Message', Message);
