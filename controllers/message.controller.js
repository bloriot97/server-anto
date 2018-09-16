const Message = require('../models/message.model.js');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  req.body.from = req.user.username;
  const message = new Message(req.body);

  message.save()
    .then((data) => {
      res.send({ message: 'Message successfully added!', data });
    }).catch((err) => {
      res.status(400).send(err);
    });
};

exports.findAll = (req, res) => {
  Message.find({}, { __v: 0 })
    .then((users) => {
      res.send(users);
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving messages.',
      });
    });
};

exports.getSentMessages = (req, res) => {
  Message.find({ from: req.user.username }, { __v: 0 })
    .then((users) => {
      res.send(users);
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving messages.',
      });
    });
};

exports.getInbox = (req, res) => {
  Message.find({ to: req.user.username, read_at: { $exists: false } }, { __v: 0 })
    .then((messages) => {
      res.send(messages);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving messages.',
      });
    });
};

/*
exports.findAll = (req, res) => {

};
*/
