const User = require('../models/user.model.js');
const Auth = require('../auth/auth');

exports.create = (req, res) => {
  if (req.body === undefined) {
    res.status(400).send({
      message: 'There is no content',
    });
  }

  const user = new User(req.body);

  user.save()
    .then((data) => {
      res.send({ message: 'User successfully added!', data });
    }).catch((err) => {
      res.status(400).send(err);
    });
};

exports.findAll = (req, res) => {
  User.find({}, { __v: 0 })
    .then((users) => {
      res.send(users);
    }).catch((err) => {
      res.status(400).send({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    });
};

exports.findOne = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }
      res.send(user);
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }
      res.status(500).send({
        message: `Error retrieving user with id ${req.params.userId}`,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'There is no content',
    });
  }


  User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }
      res.send({ message: 'User updated!', data: user });
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `User not found with id ${req.params.userId}`,
        });
      }
      res.status(500).send({
        message: `Error updating user with id ${req.params.userId}`,
      });
    });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  console.log('user');
  User.findOne({ username })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(500).json({
          status: 'error',
        });
      }
      if (user.password === password) {
        const profile = { username: user.username, email: user.email };
        const token = Auth.encodeToken(profile);
        res.json({ status: 'success', token });
      } else {
        res.status(500).json({
          status: 'error',
        });
      }
    }).catch(() => {
      res.status(500).json({
        status: 'error',
      });
    });
};

/*
exports.delete = (req, res) => {

};
*/
