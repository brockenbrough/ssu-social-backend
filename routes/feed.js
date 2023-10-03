const express = require("express");
const axios = require("axios");
const { response } = require("express");
const router = express.Router();

// Gets posts from post service API
async function getPosts() {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts`);
  return response.data;
}

// Gets likes from statistics service API
async function getLikes() {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/like-list`);
  return response.data;
}

// Gets a list of the users that are followed from the logged-in user
async function getFollowing(userId) {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${userId}`);
  return response.data;
}

async function getAllUserIds() {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getAll`);
  return response.data;
}

async function getAllPostsByUserId(userId) {
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${userId}`);
  return response.data;
}

// Feed sorting algorithm
// Takes an array of post ID strings as input and returns post IDs in a sorted array of strings
async function sortPosts(posts) {
  const likes = await getLikes();

  var weights = [];
  for (i = 0; i < posts.length; i++) {
    let postObj = {
      postID: posts[i],
      likes: 0,
      weight: 0,
    };
    weights.push(postObj);
  }

  for (i = 0; i < posts.length; i++) {
    for (j = 0; j < likes.length; j++) {
      if (likes[j].postId == posts[i]) {
        weights[i].likes += 1;
      }
    }
  }

  for (i = 0; i < weights.length; i++) {
    weights[i].weight = weights[i].likes;
  }

  weights.sort(function (a, b) {
    return b.weight - a.weight;
  });

  var sortedIDs = [];
  for (i = 0; i < posts.length; i++) {
    sortedIDs[i] = weights[i].postID;
  }

  return sortedIDs;
}

// Pagination function
// Takes starting position, page size, and postIDs as an array of strings as input and returns an array of the requested size
function paginate(startingPosition, pageSize, posts) {
  return posts.slice(startingPosition, startingPosition + pageSize);
}

// Full feed service for an anonymous user
router.route("/feed").get(async function (req, res) {
  const posts = await getPosts();

  var postIDs = [];
  for (i = 0; i < posts.length; i++) {
    postIDs[i] = posts[i]._id;
  }

  const sortedPosts = await sortPosts(postIDs);

  let obj = {
    feed: sortedPosts,
  };

  res.json(obj);
});

// Paginated feed service for an anonymous user
// Takes URI inputs of starting position and page size
router
  .route("/feed/:startingPosition/:pageSize")
  .get(async function (req, res) {
    const posts = await getPosts();

    const startingPosition = parseInt(req.params.startingPosition);
    const pageSize = parseInt(req.params.pageSize);
    if (isNaN(startingPosition) || isNaN(pageSize)) {
      return res
        .status(400)
        .send(
          "Error: invalid starting position and/or page size, starting position and page size must be a number."
        );
    }
    var postIDs = [];
    for (i = 0; i < posts.length; i++) {
      postIDs[i] = posts[i]._id;
    }

    const sortedPosts = await sortPosts(postIDs);
    const page = paginate(startingPosition, pageSize, sortedPosts);

    let obj = {
      feed: page,
    };

    res.json(obj);
  });

// Returns sorted feed for the logged-in user
router.route("/feed/:username").get(async function (req, res) {
  // Shows the feed
  const username = req.params.username;
  const allUserId = await getAllUserIds();
  const following = await getFollowing(username);

  let postIDs = [];
  let userIdList = [];
  let followingUsersPosts = [];

  for (i = 0; i < allUserId.length; i++) {
    userIdList[i] = allUserId[i].username;
  }

  if (!userIdList.includes(username)) {
    return res.status(400).send("Error: invalid username");
  }

  if (following[0] == null) {
    return res
      .status(400)
      .send("Error: Username was found this person does not follow anyone.");
  }

  const followingList = following[0].following;

  for (i = 0; i < followingList.length; i++) {
    try {
      userPosts = await getAllPostsByUserId(followingList[i]);
      followingUsersPosts.push(userPosts);
    } catch (e) {
      console.log("Issue with user " + followingList[i] + " user has not made any posts");
    }
  }

  followingUsersPosts.map(e => {
    e.map(e => {
      postIDs.push(e._id);
    })
  })

  const sortedPosts = await sortPosts(postIDs);

  let obj = {
    feed: sortedPosts,
  };

  res.json(obj);
});

// (DO NOT delete this one)
module.exports = router;
