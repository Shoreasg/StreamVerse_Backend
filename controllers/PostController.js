const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const User = require('../models/user')
router.use(express.static("public"))



router.post("/postStatus", async( req, res)=>
{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
      } catch (err) {
        res.status(500).json(err);
      }
})

router.get("/GetFeed", async( req, res)=>
{
    try {
        const currentUser = await User.findOne({twitchId: req.user.twitchId})
        const userPost = await Post.find({twitchId: currentUser.twitchId})
        const followingPost = await Promise.all(
          currentUser.followings.map((userFollowingId)=>
          {
            return Post.find({twitchId: userFollowingId})
          })
        )
        let AllPost = userPost.concat(...followingPost)
        AllPost.sort((a,b) => {return b.createdAt - a.createdAt})
        res.send(AllPost)
      } catch (err) {
        res.status(500).json(err);
      }
})

module.exports = router