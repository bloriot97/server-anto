module.exports = (router) => {
    const user = require('../controllers/user.controller.js');

    router.post('/users', user.create);
    router.get('/users', user.findAll);
    router.get('/users/:userId', user.findOne);
    router.put('/users/:userId', user.update);
    //router.delete('/users/:userId', user.delete);
}
