const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

chai.should();

const Auth = require('../auth/auth');
const Message = require('../models/message.model');
const server = require('../app');

let token = '';
let connectedUser = {};


chai.use(chaiHttp);


describe('Messages ✉️', () => {
  beforeEach((done) => {
    Message.remove({}, (err) => {
      if (!err) {
        done();
      }
    });
  });
  describe('User', () => {
    beforeEach((done) => {
      connectedUser = config.users.benjamin;
      token = Auth.encodeToken(connectedUser);
      done();
    });

    /*
    * Test the /POST route
    */
    describe('/POST', () => {
      it('should not POST a message without to field', (done) => {
        const message = {
          content: 'Le message',
          animation: 'rainbow',
        };
        chai.request(server)
          .post('/api/v1/messages')
          .send(message)
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            // console.log(res);
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('to');
            res.body.errors.to.should.have.property('kind').eql('required');
            done();
          });
      });

      it('should not POST a message without content field', (done) => {
        const message = {
          to: 'Anto',
          content: '',
          animation: 'rainbow',
        };
        chai.request(server)
          .post('/api/v1/messages')
          .send(message)
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            // console.log(res);
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('content');
            res.body.errors.content.should.have.property('kind').eql('required');
            done();
          });
      });

      it('should POST a message', (done) => {
        const message = {
          to: 'Anto',
          content: 'The message',
          animation: 'rainbow',
        };
        chai.request(server)
          .post('/api/v1/messages')
          .send(message)
          .set('authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Message successfully added!');
            res.body.data.should.have.property('from');
            res.body.data.should.have.property('to');
            res.body.data.should.have.property('animation');
            res.body.data.should.have.property('sent_at');
            done();
          });
      });
    });

    /*
    * Test the /GET routes
    */
    describe('/GET', () => {
      it('should GET all the messages from the user', (done) => {
        const message = new Message({
          from: connectedUser.username,
          to: 'Anto',
          content: 'The message',
          animation: 'rainbow',
        });
        message.save(() => {
          chai.request(server)
            .get('/api/v1/messages')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
            });
        });
      });
      it('should not GET messages not sent by him', (done) => {
        const message = new Message({
          from: 'Test',
          to: 'Anto',
          content: 'The message',
          animation: 'rainbow',
        });
        message.save(() => {
          chai.request(server)
            .get('/api/v1/messages')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
              done();
            });
        });
      });
      it('should GET all the messages to the user', (done) => {
        const message = new Message({
          from: 'someone',
          to: connectedUser.username,
          content: 'The message',
          animation: 'rainbow',
        });
        message.save(() => {
          chai.request(server)
            .get('/api/v1/messages/inbox')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
            });
        });
      });
      it('should not GET the read messages', (done) => {
        const message = new Message({
          from: 'someone',
          to: connectedUser.username,
          content: 'The message',
          animation: 'rainbow',
          read_at: new Date(),
        });
        message.save(() => {
          chai.request(server)
            .get('/api/v1/messages/inbox')
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
              done();
            });
        });
      });
      it('should GET and mark the message as read', (done) => {
        const message = new Message({
          from: 'someone',
          to: connectedUser.username,
          content: 'The message',
          animation: 'rainbow',
        });
        message.save((messageErr, messageRes) => {
          chai.request(server)
            .get(`/api/v1/messages/read/${messageRes.id}`)
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('read_at');
              res.body.should.have.property('content');
              done();
            });
        });
      });
      it('should not GET read a message not meant for him', (done) => {
        const message = new Message({
          from: 'someone',
          to: 'someoneElse',
          content: 'The message',
          animation: 'rainbow',
        });
        message.save((messageErr, messageRes) => {
          chai.request(server)
            .get(`/api/v1/messages/read/${messageRes.id}`)
            .set('authorization', `Bearer ${token}`)
            .end((err, res) => {
              res.should.have.status(401);
              res.body.should.be.a('object');
              res.body.should.have.property('status').eql('error');
              done();
            });
        });
      });
    });
  });
});
