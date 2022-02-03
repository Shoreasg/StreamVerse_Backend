const passport = require('passport')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const twitchStrategy = require("passport-twitch.js").Strategy;
router.use(express.static("public"))
let token = ""


passport.use(new twitchStrategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: "/auth/twitch/callback",
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    User.findOne({ twitchId: profile.id }, async (err, user) => {
      token = accessToken
      if (err) {
        return done(err);
      } if (user) {
        return done(err, user)
      }
      else {
        user = new User(
          {
            userName: profile.display_name,
            twitchId: profile.id,
            description: profile.description,
            profileImage: profile.profile_image_url
          }

        )
        user.save();
        return done(err, user)
      }
    });
  }
));

router.get("/auth/twitch", passport.authenticate("twitch.js", { scope: ["user:read:email", "user:read:follows"] }));

router.get("/auth/twitch/callback",
  passport.authenticate("twitch.js",
    { failureRedirect: "/" }), (req, res) => {
      req.session.token = token
      console.log(req.session)
      res.redirect(`${process.env.FRONTEND_URL}/home`)
    });

router.get('/getuser', (req, res) => { // this is to check the user session.
  console.log(req.session)
  res.send(req.user)
})

router.delete('/logout', (req, res) => { //this will log the user out. Clear the cookies to remove any session

  if (req.session) {
    console.log(req.session)
    req.logOut()
    req.session.destroy((err) => {
      if (err) {
        res.send(err)
      } else {
        res.clearCookie('connect.sid')
        console.log(req.session)
        res.send({ message: "You are successfully logged out!" })
      }
    })

  }
  else {
    res.send({ message: "You are not logged in!" })
  }
})
module.exports = router