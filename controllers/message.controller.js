const Message = require('../models/message.model.js');

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

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


exports.getInboxByUserName = (req, res) => {
  Message.find({ to: req.params.userName }, { __v: 0 })
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
