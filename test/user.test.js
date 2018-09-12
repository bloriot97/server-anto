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
    it('it should GET all the users', (done) => {
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
});
