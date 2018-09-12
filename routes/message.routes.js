module.exports = (router) => {
    const message = require('../controllers/message.controller.js');

    router.post('/messages', message.create);
    //router.get('/messages', user.findAll);
    router.get('/inbox/:userName', message.getInboxByUserName);
    //router.put('/messages/:userId', user.update);
    //router.delete('/users/:userId', user.delete);
}
