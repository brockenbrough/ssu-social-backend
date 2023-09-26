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
  // await clearDatabase();  We let the data build up through out these tests.
});

describe('ProjectNotes API Tests', () => {
    let contributorId = '';
    
    // Test for GET request to '/project_notes/contributor'
    // Expected there are no contributors since this is a new database.
    it('should get no developers', (done) => {
      chai
        .request(app)
        .get('/project_notes/contributor')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0); // Check if array size is 0
          done();
        });
    });

    // Test for POST request to '/project_notes/contributor/add'
    // Expected to add a new developer to the database.
    it('should add a new developer', (done) => {
      const newDeveloper = {
        name: 'John Doe',
        position: 'Backend Developer',
        level: 'Intermediate',
      };
      chai
        .request(app)
        .post('/project_notes/contributor/add')
        .send(newDeveloper)
        .end((err, res) => {
          expect(res).to.have.status(200);

          done();
        });
    });

    // Test for GET request to '/project_notes/contributor'
    // Expected there is one contributore now in the database.
    it('should get one developer', (done) => {
      chai
        .request(app)
        .get('/project_notes/contributor')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          contributorId = res.body[0]._id; // Save the _id to the variable
          //console.log('     Add developer: ' + contributorId);

          done();
        });
    });

        // Test for GET request to '/project_notes/contributor/:id'
    it('should get a specific developer', (done) => {
        const developerId = contributorId; // Use the saved _id
        chai
            .request(app)
            .get(`/project_notes/contributor/${developerId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                // Add more assertions for the specific developer data

                done();
            });
    });
  


    // Add more tests for other API endpoints (PUT, DELETE, etc.)
        // Test for POST request to '/project_notes/contributor/update/:id'
    it('should update a specific developer', (done) => {
      const developerId = contributorId; // Use the saved _id

      const updateBody = {
          name: 'Updated Name',

          position: 'Updated Position',
          level: 'Advanced'
      };

      chai
          .request(app)
          .put(`/project_notes/contributor/update/${developerId}`)
          .send(updateBody)
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.msg).to.equal('Updated successfully');

              done();
          });
    });

  
  });
  