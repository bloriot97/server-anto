// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// const mongoose = require("mongoose");

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

const User = require('../models/user.model');
const server = require('../app');


chai.use(chaiHttp);
// Our parent block
describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      if (!err) {
        done();
      }
    });
  });

  /*
  * Test the /GET route
  */
  describe('/GET /users', () => {
    it('should GET all the users', (done) => {
      chai.request(server)
        .get('/api/v1/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
  * Test the /POST route
  */
  describe('/POST userx', () => {
    it('should not POST a user without username field', (done) => {
      const user = {
        email: 'benji@gmail.com',
        password: 'sgdgf',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          // console.log(res);
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('username');
          res.body.errors.username.should.have.property('kind').eql('required');
          done();
        });
    });

    it('should POST a user', (done) => {
      const user = {
        username: 'benjamin',
        email: 'benji@gmail.com',
        password: 'sgdgf',
      };
      chai.request(server)
        .post('/api/v1/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('User successfully added!');
          res.body.user.should.have.property('username');
          res.body.user.should.have.property('password');
          res.body.user.should.have.property('email');
          done();
        });
    });
  });

  /*
  * Test the /GET route
  */
  describe('/GET/:id', () => {
    it('should GET the user by id', (done) => {
      const user = new User({
        username: 'Benjamin',
        email: 'benji@gmail.com',
        password: 'sgdgf',
      });
      user.save((userSaveErr, userSaveRes) => {
        chai.request(server)
          .get(`/api/v1/users/${userSaveRes.id}`)
          .send(userSaveRes)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('username');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            res.body.should.have.property('_id').eql(userSaveRes.id);
            done();
          });
      });
    });
  });

  describe('/PUT/:id book', () => {
    it('should UPDATE a user given the id', (done) => {
      const user = new User({
        username: 'benjamin',
        email: 'benji@gmail.com',
        password: 'password',
      });
      user.save((userSaveErr, userSaveRes) => {
        chai.request(server)
          .put(`/api/v1/users/${userSaveRes.id}`)
          .send({ password: 'new', email: 'new@email.com' })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('User updated!');
            res.body.user.should.have.property('password').eql('new');
            done();
          });
      });
    });
  });
});
