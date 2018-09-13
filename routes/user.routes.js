const user = require('../controllers/user.controller.js');

module.exports = (router) => {
  router.post('/users', user.create);
  router.post('/auth/login', user.login);
  router.get('/users', user.findAll);
  router.get('/users/:userId', user.findOne);
  router.put('/users/:userId', user.update);
  // router.delete('/users/:userId', user.delete);
};
