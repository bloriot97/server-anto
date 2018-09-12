// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const schemas = {
  user: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
  },
  message: {
    from: String,
    to: String,
    type: String,
    content: String,
    animation: String,
    sent_at: {
      type: Date,
      default: Date.now,
    },
    read_at: Date,
  },
};

module.exports = schemas;
