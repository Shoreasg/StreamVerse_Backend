const express = require('express')
const router = express.Router()
const Post = require('../models/post')
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
        const allPost = await Post.find()
        res.send(allPost)
      } catch (err) {
        res.status(500).json(err);
      }
})

module.exports = router