const message = require('../controllers/message.controller.js');

module.exports = (router) => {
  router.post('/messages', message.create);
  router.get('/messages', message.getSentMessages);
  router.get('/messages/inbox', message.getInbox);
  router.get('/messages/read/:messageId', message.getAndReadMessage);
  // router.put('/messages/:userId', user.update);
  // router.delete('/users/:userId', user.delete);
};
