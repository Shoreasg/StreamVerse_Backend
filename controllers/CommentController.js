const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const Comment = require('../models/comment')
router.use(express.static("public"))



router.post("/CreateComment", async (req, res) => { //Create Comment
    try {
      const UpdatePost = await Post.findById(req.body.statusID)
      if(UpdatePost)
      {
        const newComment = new Comment(req.body);
        const saveComment = await newComment.save();
        UpdatePost.comment.push(saveComment._id)
        UpdatePost.save()
        res.status(200).send("Commented")
      }
      else
      {
          res.send("Post was removed before you are able to comment!")
      }
     

    } catch (err) {
      res.status(500).json(err);
    }
  })

router.get("/GetComment/:id", async (req, res) => {
    const commentId = req.params.id
  
    try {
      const userComment = await Comment.findById(commentId)
      res.send(userComment)
    } catch (err) {
      res.status(500).json(err);
    }
  })

router.put("/EditComment/:id", async (req, res) => {
    const selectedComment = req.params.id
    if (req.user.twitchId === req.session.passport.user.twitchId) {
      try {
  
       const userComment = await Comment.findByIdAndUpdate(selectedComment, req.body)
       userComment.editedOn = userComment.updatedAt
       userComment.save()
        res.send("Updated Successfully")
      } catch (err) {
        res.status(500).json(err);
      }
    }
    else {
      res.status(403).json("you can update only your Comment"); // in case someone use postman to edit
    }
  
  })
  router.put("/KAPPAComment/:id", async (req, res) => { // KAPPA A POST
    try {
  
      const selectedComment = await Comment.findById(req.params.id)
      if (!selectedComment.kappa.includes(req.body.twitchId)) {
        await selectedComment.updateOne({ $push: { kappa: req.body.twitchId } })
        res.status(200).json("KAPPA!")
      }
      else {
        await selectedComment.updateOne({ $pull: { kappa: req.body.twitchId } })
        res.status(200).json("NO KAPPA?")
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
  
  router.put("/LULComment/:id", async (req, res) => { // LUL A POST
    try {
  
      const selectedComment = await Comment.findById(req.params.id)
      if (!selectedComment.lul.includes(req.body.twitchId)) {
        await selectedComment.updateOne({ $push: { lul: req.body.twitchId } })
        res.status(200).json("LUL!")
      }
      else {
        await selectedComment.updateOne({ $pull: { lul: req.body.twitchId } })
        res.status(200).json("NO LUL?")
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })
  
  router.put("/GOODComment/:id", async (req, res) => { //LOOKS GOOD
    try {
  
      const selectedComment = await Comment.findById(req.params.id)
      if (!selectedComment.good.includes(req.body.twitchId)) {
        await selectedComment.updateOne({ $push: { good: req.body.twitchId } })
        res.status(200).json("LOOKSGOOD!")
      }
      else {
        await selectedComment.updateOne({ $pull: { good: req.body.twitchId } })
        res.status(200).json("NO GOOD?")
      }
    } catch (err) {
      res.status(500).json(err);
    }
  })

  router.delete("/DeleteComment/:id", async (req, res) => {
    const selectedComment = req.params.id
  
    try {
  
      await Comment.findByIdAndDelete(selectedComment)
      res.send("Deleted Successfully")
    } catch (err) {
      res.status(500).json(err);
    }
  })


module.exports = router