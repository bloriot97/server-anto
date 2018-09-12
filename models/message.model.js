const mongoose = require('mongoose');
const schemas = require('../schemas/schemas.js')

const MessageSchema = mongoose.Schema(schemas.message);

module.exports = mongoose.model('Message', MessageSchema);
