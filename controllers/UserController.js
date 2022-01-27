const passport = require('passport')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const twitchStrategy = require("passport-twitch.js").Strategy;
router.use(express.static("public"))



passport.use(new twitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: "/auth/twitch/callback",
},
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ TwitchId: profile.id }, async (err, user) => {
      console.log(profile)
      if (err) {
        return done(err);
      } if (user) {
        return done(err, user)
      }
      else {
        user = new User(
          {
            userName: profile.display_name,
            TwitchId: profile.id
          }
          
        )
        user.save();
        return done(err, user)
      }
    });
  }
));

router.get("/auth/twitch", passport.authenticate("twitch.js", { scope: ["user:read:email"] }));

router.get("/auth/twitch/callback",
  passport.authenticate("twitch.js",
    { failureRedirect: "/" }), (req, res) => {
      req.session.user = req.user
      res.redirect(`${process.env.FRONTEND_URL}`)
    });

module.exports = router