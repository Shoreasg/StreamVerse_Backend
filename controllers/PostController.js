const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
router.use(express.static("public"))



router.post("/postStatus", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetFeed", async (req, res) => {
  try {
    const currentUser = await User.findOne({ twitchId: req.user.twitchId })
    const userPost = await Post.find({ twitchId: currentUser.twitchId })
    const followingPost = await Promise.all(
      currentUser.followings.map((userFollowingId) => {
        return Post.find({ twitchId: userFollowingId.id })
      })
    )
    let AllPost = userPost.concat(...followingPost)
    AllPost.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(AllPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetUserFeed", async (req, res) => {
  try {
    const userPost = await Post.find({ twitchId: req.user.twitchId })
    userPost.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(userPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetPost/:id", async (req, res) => {
  const postId = req.params.id

  try {
    const userPost = await Post.findById(postId)
    res.send(userPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put("/EditPost/:id", async (req, res) => {
  const selectedPost = req.params.id
  console.log(`req.user`, req.user)
  console.log(`req.session`, req.session)
  if (req.user.twitchId === req.session.passport.user.twitchId) {
    try {

      const userPost = await Post.findByIdAndUpdate(selectedPost, req.body)
      res.send("Updated Successfully")
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    res.status(403).json("you can update only your post"); // in case someone use postman to edit
  }

})

router.put("/EditPost/:id", async (req, res) => {
  const selectedPost = req.params.id
  console.log(`req.user`, req.user)
  console.log(`req.session`, req.session)
  if (req.user.twitchId === req.session.passport.user.twitchId) {
    try {

      const userPost = await Post.findByIdAndUpdate(selectedPost, req.body)
      res.send("Updated Successfully")
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    res.status(403).json("you can update only your post"); // in case someone use postman to edit
  }

})

router.delete("/DeletePost/:id", async (req, res) => {
  const selectedPost = req.params.id
  if (req.user.twitchId === req.session.passport.user.twitchId) {
    try {

      await Post.findByIdAndDelete(selectedPost)
      res.send("Deleted Successfully")
    } catch (err) {
      res.status(500).json(err);
    }
  }
  else {
    res.status(403).json("you can delete only your post"); // in case someone use postman to delete
  }

})

module.exports = router