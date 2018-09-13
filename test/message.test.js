process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

chai.should();

const Auth = require('../auth/auth');
const Message = require('../models/message.model');
const server = require('../app');

let token = '';

chai.use(chaiHttp);


describe('User messages', () => {
  beforeEach((done) => {
    token = Auth.encodeToken(config.users.benjamin);
    Message.remove({}, (err) => {
      if (!err) {
        done();
      }
    });
  });

  /*
  * Test the /POST route
  */
  describe('/POST user', () => {
    it('should not POST a message without to field', (done) => {
      const message = {
        from: 'Benjamin',
        content: 'Le message',
        animation: 'rainbow',
      };
      chai.request(server)
        .post('/api/v1/messages')
        .send(message)
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

    it('should not POST a message without from field', (done) => {
      const message = {
        to: 'Benjamin',
        content: 'Le message',
        animation: 'rainbow',
      };
      chai.request(server)
        .post('/api/v1/messages')
        .send(message)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('from');
          res.body.errors.from.should.have.property('kind').eql('required');
          done();
        });
    });

    it('should not POST a message without content field', (done) => {
      const message = {
        from: 'Benjamin',
        to: 'Anto',
        content: '',
        animation: 'rainbow',
      };
      chai.request(server)
        .post('/api/v1/messages')
        .send(message)
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
        from: 'Benjamin',
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
  describe('/GET /messages/to/:userName', () => {
    it('should GET all the messages of the user', (done) => {
      const message = new Message({
        from: 'Benjamin',
        to: 'Anto',
        content: 'The message',
        animation: 'rainbow',
      });
      message.save(() => {
        chai.request(server)
          .get('/api/v1/messages/to/Anto')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
          });
      });
    });
  });
});
