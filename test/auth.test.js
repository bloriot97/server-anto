process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');

const should = chai.should();

const Auth = require('../auth/auth');
const User = require('../models/user.model');
const server = require('../app');


chai.use(chaiHttp);


describe('Auth', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      if (!err) {
        done();
      }
    });
  });

  describe('local auth', () => {
    it('should return a token', (done) => {
      const results = Auth.encodeToken({ id: 1 });
      should.exist(results);
      results.should.be.a('string');
      done();
    });
    it('should return a correct payload', (done) => {
      const token = Auth.encodeToken({ user: 'name' });
      should.exist(token);
      token.should.be.a('string');
      Auth.decodeToken(token, (err, res) => {
        should.not.exist(err);
        res.user.should.be.a('string');
        res.user.should.eql('name');
        done();
      });
    });
  });
  describe('/POST /auth/login', () => {
    it('should connect the user', (done) => {
      const user = new User(config.users.benjamin);
      user.save((userSaveErr, userSaveRes) => {
        chai.request(server)
          .post('/api/v1/auth/login')
          .send({ username: userSaveRes.username, password: userSaveRes.password })
          .end((err, res) => {
            should.not.exist(err);
            res.redirects.length.should.eql(0);
            res.status.should.eql(200);
            res.type.should.eql('application/json');
            res.body.should.include.keys('status', 'token');
            res.body.status.should.eql('success');
            should.exist(res.body.token);
            done();
          });
      });
    });
  });
});
