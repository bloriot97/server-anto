var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemas = {
    user: {
        username: { type: String, required: true },
        password: String,
        email: String
    },
    message: {
      from : String,
      to : String,
      type : String,
      content : String,
      animation : String,
      sent_at : {
          type: Date,
          default: Date.now
      },
      read_at : Date
    }
}

module.exports = schemas;
