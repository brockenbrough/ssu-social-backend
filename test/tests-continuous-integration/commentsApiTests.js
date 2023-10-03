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

describe('Regression Tests: Comments', () => {
    let commentId = '';
    
    // Test for GET request to '/comments/comment'
    // Expected there are no comments since this is a new database.
    it('should get no comments', (done) => {
      chai
        .request(app)
        .get('/comments/comment')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(0); // Check if array size is 0
          done();
        });
    });

    // Test for POST request to '/comments/comment/add'
    // Expected to add a new comment to the database.
    it('should add a new comment', (done) => {
      const newComment = {
        userId: '64d2488c1e95cce18b6bf619',
        postId: '64f8ac22cfd9653109ee81ce',
        commentContent: 'This is a comment',
      };
      chai
        .request(app)
        .post('/comments/comment/add')
        .send(newComment)
        .end((err, res) => {
          expect(res).to.have.status(200);

          done();
        });
    });

    // Test for GET request to '/comments/comment'
    // Expected there is one comment now in the database.
    it('should get one comment', (done) => {
      chai
        .request(app)
        .get('/comments/comment')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(1);
          commentId = res.body[0]._id; // Save the _id to the variable

          done();
        });
    });

        // Test for GET request to '/comments/comment/:id'
        it('should get a specific comment', (done) => {
        const tempId = commentId; // Use the saved _id
        chai
            .request(app)
            .get(`/comments/comment/${tempId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');

                done();
            });
    });
  


    // Add more tests for other API endpoints (PUT, DELETE, etc.)
    // Test for POST request to '/comments/comment/update/:id'
    it('should update a specific comment', (done) => {
      const tempId = commentId; // Use the saved _id

      const updateBody = {
          commentContent: 'This is an updated comment'
      };

      chai
          .request(app)
          .put(`/comments/comment/update/${tempId}`)
          .send(updateBody)
          .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.msg).to.equal('Updated successfully');

              done();
          });
    });

  
  });
