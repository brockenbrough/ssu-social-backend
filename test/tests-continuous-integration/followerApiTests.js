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

describe('Regression Tests: Followers', () => { //This was the updated test
    let followerID = '';
    
    // Test for GET request to '/project_notes/contributor'
    // Expected there are no contributors since this is a new database.

   
    it('should get all users and their followers, there should be none', (done) => {
      chai
        .request(app)
        .get('/followers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0); // Check if array size is 0
          done();
        });
    });

    it('should get all users and who they are following, there should be none', (done) => {
        chai
          .request(app)
          .get('/following ')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(0); // Check if array size is 0
            done();
          });
      });

    // Test for POST request to '/project_notes/contributor/add'
    // Expected to add a new developer to the database.
    it('should add a new follower', (done) => {
      const newFollowers = {
        userId: '63dbcbfe407533287b1fe360',
        targetUserId: '64fb4f5573e33130dc65e7b3',
      };
      chai
        .request(app)
        .post('/followers/follow')
        .send(newFollowers)
        .end((err, res) => {
          expect(res).to.have.status(200);

          done();
        });
    });

    
   
    // Test for GET request to '/followers'
    
    // Expected there is one follower now in the database.
    it('should get one follower', (done) => {
      chai
        .request(app)
        .get('/followers')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          followerId = res.body[0]._id; // Save the _id to the variable
          //console.log('     Add developer: ' + contributorId);

          done();
        });
    });
    it('should unfollow a follower', (done) => {
        const Unfollowers = {
          userId: '65174f22f80b7b1ae1753085',
          targetUserId: '64fb4f5573e33130dc65e7b3',
        };
        chai
          .request(app)
          .post('/followers/unfollow')
          .send(Unfollowers)
          .end((err, res) => {
            expect(res).to.have.status(200);
  
            done();
          });
      });
    
    // Add more tests for other API endpoints (PUT, DELETE, etc.)
       
  });