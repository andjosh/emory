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
        from: String,
        to: String,
        created: {
            type: Date,
            default: new Date()
        }
    });

module.exports = mongoose.model('Message', Message);
