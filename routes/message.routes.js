const message = require('../controllers/message.controller.js');

module.exports = (router) => {
  router.post('/messages', message.create);
  // router.get('/messages', message.findAll);
  router.get('/messages/to/:userName', message.getInboxByUserName);
  // router.put('/messages/:userId', user.update);
  // router.delete('/users/:userId', user.delete);
};
