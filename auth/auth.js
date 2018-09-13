const jwt = require('jsonwebtoken');
const config = require('config');
const moment = require('moment');


function encodeToken(user) {
  return jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresInSeconds });
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, config.jwt.TOKEN_SECRET);
  const now = moment().unix();
  if (now > payload.exp) {
    callback('Token has expired.');
  } else {
    callback(null, payload);
  }
}

module.exports = {
  encodeToken,
  decodeToken,
};
