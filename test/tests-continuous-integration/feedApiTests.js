process.env.NODE_ENV = "test";   // This will prevent the backend from listening to port 8095 when running tests.

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server'); // Your Express app instance
const { connect, closeDatabase, clearDatabase, getMongoUri } = require('./test.config');

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

describe('Feed API Tests', () => {
    // Test for GET request to '/project_notes/contributor'
    it('should get all developers - replace me', (done) => {
      chai
        .request(app)
        .get('/project_notes/contributor')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

  
    // Add more tests for other API endpoints (PUT, DELETE, etc.)
  });
  