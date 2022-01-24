const passport = require('passport')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
router.use(express.static("public"))
const twitchStrategy = require("passport-twitch.js").Strategy;


passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "auth/twitch/callback",
    scope: "user_read"
  },
  function(accessToken, refreshToken, profile, done) {
    //Handle Database Query Addition Here.
  }
));

router.get('/test',(req,res)=>
{
    res.send("hello")
})

module.exports = router