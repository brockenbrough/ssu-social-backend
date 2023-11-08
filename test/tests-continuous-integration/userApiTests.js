process.env.NODE_ENV = "test"; // This will prevent the backend from listening to port 8095 when running tests.

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server'); // Your Express app instance
const { connect, closeDatabase, clearDatabase } = require('./test.config');

// Configure Chai to use the Chai HTTP plugin
chai.use(chaiHttp);
const expect = chai.expect;

// Run before all tests
before(async () => {
  await connect();
});

// Run after all tests
after(async () => {
  await closeDatabase();
});

// Run before each test
beforeEach(async () => {
  await clearDatabase();
});

describe('Regression Tests: User API', () => {
  // Test for GET request to '/user/getAll'
  it('should get user information', (done) => {
    chai
      .request(app)
      .get('/user/getAll')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array'); // Change expectation to an array if that's what the route returns
        done();
      });
  });

  // Test for POST request to '/users'
  it('should create a new user', (done) => {
    chai
      .request(app)
      .post('/user/signup')
      .send({ username: 'tochiamanze', email: 'cdon@gmail.com', password: 'tochi12345' }) 
      .end((err, res) => {
        if (err) {
          console.error(err); // Log any errors
        }
        console.log(res.body); // Log the response body for debugging
        expect(res).to.have.status(200);
        // Add more expectations here if needed for the response body
        done();
      });
  });

  //test for duplicate user
  /*it('should get an error when a duplicate user is created', (done) => {
    chai
      .request(app)
      .post('/user/signup')
      .send({ username: 'tochiamanze', email: 'cdon@gmail.com', password: 'tochi12345' })
      .end((err, res) =>{
        expect(res).to.have.status.within(400, 401, 403);//expects error, not sure which code is used
        done();
      });

  });*/

  // Add more tests for other API endpoints (PUT, DELETE, etc.)
});