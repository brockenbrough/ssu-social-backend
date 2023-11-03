process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server'); // Replace with the path to your Express app instance
const { connect, closeDatabase } = require('./test.config'); // Adjust your database setup functions

chai.use(chaiHttp);
const expect = chai.expect;

before(async () => {
  await connect();
});

after(async () => {
  await closeDatabase();
});

describe('API Tests', () => {
  // Define variables to store IDs generated during tests
  let postId = '';
  let userId = '';

  // Test POST /views/view endpoint
  it('should add a view to a post', (done) => {
    const viewData = {
      userId: 'testUserId',
      postId: 'testPostId',
    };

    chai
      .request(app)
      .post('/views/view')
      .send(viewData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id');
        postId = res.body.postId; // Store the postId for future tests
        userId = res.body.userId; // Store the userId for future tests
        done();
      });
  });

  // Test POST /likes/like endpoint
  it('should add a like to a post', (done) => {
    const likeData = {
      userId: 'testUserId',
      postId: 'testPostId',
    };

    chai
      .request(app)
      .post('/likes/like')
      .send(likeData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  // Test GET /like-list endpoint
  it('should get a list of likes', (done) => {
    chai
      .request(app)
      .get('/like-list')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

 // Test GET /count/likes-for-post/:postId endpoint
  it('should get the count of likes for a post', (done) => {
    chai
      .request(app)
      .get(`/count/likes-for-post/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('number').equal(1);
        done();
      });
  });


  // Test DELETE /likes/unLike endpoint
  it('should delete a like', (done) => {
    const likeData = {
      userId: userId,
      postId: postId,
    };

    chai
      .request(app)
      .delete('/likes/unLike')
      .send(likeData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.body).equal('0'); // Ensure one like was deleted
        done();
      });
  });

  
    it('should get the count of likes for a post after removing a like', (done) => {
    chai
      .request(app)
      .get(`/count/likes-for-post/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('number').equal(0);
        done();
      });
  });

  
  // Test GET /views/:postId endpoint
  it('should get the count of views for a post', (done) => {
    chai
      .request(app)
      .get(`/views/${postId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('number');
        done();
      });
  });
});