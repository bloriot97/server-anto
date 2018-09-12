// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const schemas = {
  user: {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: String,
  },
  message: {
    from: { type: String, required: true },
    to: { type: String, required: true },
    type: String,
    content: { type: String, required: true },
    animation: String,
    sent_at: {
      type: Date,
      default: Date.now,
    },
    read_at: Date,
  },
};

module.exports = schemas;
