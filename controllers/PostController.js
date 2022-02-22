const express = require('express')
const Comment = require('../models/comment')
const { default: axios } = require('axios')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
router.use(express.static("public"))



router.post("/postStatus", async (req, res) => { //Create post
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetFeed", async (req, res) => { // Get the user feed with the user that he is following
  try {
    const currentUser = await User.findOne({ twitchId: req.user.twitchId })
    const userPost = await Post.find({ twitchId: currentUser.twitchId }).populate('comment')
    const followingPost = await Promise.all(
      currentUser.followings.map((userFollowingId) => {
        return Post.find({ twitchId: userFollowingId }).populate('comment')
      })
    )
    let AllPost = userPost.concat(...followingPost)
    AllPost.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(AllPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetUserFeed/:id", async (req, res) => { //for profile
  try {
    const userPost = await Post.find({ twitchId: req.params.id }).populate('comment')
    userPost.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(userPost)
  } catch (err) {
    res.status(500).json(err);
  }
})


router.get("/GetAllFeed", async (req, res) => { //for dashboard
  try {
    const AllPost = await Post.find({})
    AllPost.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(AllPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get("/GetPost/:id", async (req, res) => { // for any post
  const postId = req.params.id

  try {
    const userPost = await Post.findById(postId)
    res.send(userPost)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put("/EditPost/:id", async (req, res) => { // edit post
  const selectedPost = req.params.id
  if (req.user.twitchId === req.session.passport.user.twitchId) {
    try {

      const userPost = await Post.findByIdAndUpdate(selectedPost, req.body)
      userPost.editedOn = userPost.updatedAt
      userPost.save()
      res.send("Updated Successfully")
    } catch (err) {
      res.status(500).json(err);
    }
  }
})

router.put("/KAPPA/:id", async (req, res) => { // KAPPA A POST
  try {

    const selectedPost = await Post.findById(req.params.id)
    if (!selectedPost.kappa.includes(req.body.twitchId)) {
      await selectedPost.updateOne({ $push: { kappa: req.body.twitchId } })
      res.status(200).json("KAPPA!")
    }
    else {
      await selectedPost.updateOne({ $pull: { kappa: req.body.twitchId } })
      res.status(200).json("NO KAPPA?")
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put("/LUL/:id", async (req, res) => { // LUL A POST
  try {

    const selectedPost = await Post.findById(req.params.id)
    if (!selectedPost.lul.includes(req.body.twitchId)) {
      await selectedPost.updateOne({ $push: { lul: req.body.twitchId } })
      res.status(200).json("LUL!")
    }
    else {
      await selectedPost.updateOne({ $pull: { lul: req.body.twitchId } })
      res.status(200).json("NO LUL?")
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put("/GOOD/:id", async (req, res) => { //LOOKS GOOD
  try {

    const selectedPost = await Post.findById(req.params.id)
    if (!selectedPost.good.includes(req.body.twitchId)) {
      await selectedPost.updateOne({ $push: { good: req.body.twitchId } })
      res.status(200).json("LOOKSGOOD!")
    }
    else {
      await selectedPost.updateOne({ $pull: { good: req.body.twitchId } })
      res.status(200).json("NO GOOD?")
    }
  } catch (err) {
    res.status(500).json(err);
  }
})



router.delete("/DeletePost/:id", async (req, res) => { // delete post

  try {

    await Post.findByIdAndDelete(req.params.id)
    await Comment.deleteMany({ statusID: req.params.id})
    res.send("Deleted Successfully")
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router