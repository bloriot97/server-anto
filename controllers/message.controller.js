const Message = require('../models/message.model.js');

exports.create = (req, res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "There is no content"
        });
    }

    const message = new Message(req.body);

    message.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the message."
        });
    });
};

exports.getInboxByUserName = (req, res) => {
    Message.find({ to : req.params.userName}, {__v:0})
        .then(messages => {
            res.send(messages);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving messages."
            });
        });
};

exports.findAll = (req, res) => {

};
