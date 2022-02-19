const passport = require('passport')
const express = require('express')
const User = require('../models/user');
const Post = require('../models/post')
const Sessions = require('../models/session')
const { default: axios } = require('axios');
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
    console.log(accessToken)
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
            profileImage: profile.profile_image_url,
            followers: [],
            following: []
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
      res.redirect(`${process.env.FRONTEND_URL}/home`)
    });

router.get('/getuser',async (req, res) => { // this is to check the user session.
  if(req.user)
  {
    await Sessions.findByIdAndUpdate(req.sessionID,{twitchId: req.user.twitchId})
  }
  res.send(req.user)
})

router.get('/GetFollowers', async (req, res) => {
  let arrayofFollwers = []
  let arrayofUserFollowing = []
  let GetUserFollowing = async (profileId, pagination) => {
    let mapStrings = ""
    await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${profileId}&first=100&after=${pagination}`
      ,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${req.session.token}`
        }
      }).then(async (results) => {
        results.data.data.forEach((followresult) => {
          mapStrings += `id=${followresult.to_id}&`
        })

        await axios.get(`https://api.twitch.tv/helix/users?${mapStrings}`
          , {
            headers: {
              "Client-Id": process.env.TWITCH_CLIENT_ID,
              "Authorization": `Bearer ${req.session.token}`
            }
          }).then((result) => {
            result.data.data.forEach((result) => {
              arrayofUserFollowing.push(result)
            })
          })


        if (results.data.pagination.cursor) {
          await GetUserFollowing(profileId, results.data.pagination.cursor)
        }
      })

  }

  let GetUserFollowers = async (profileId, pagination) => {
    let mapStrings = ""
    await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${profileId}&first=100&after=${pagination}`
      ,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${req.session.token}`
        }
      }).then(async (results) => {
        results.data.data.forEach((followresult) => {
          mapStrings += `id=${followresult.from_id}&`
        })

        await axios.get(`https://api.twitch.tv/helix/users?${mapStrings}`
          , {
            headers: {
              "Client-Id": process.env.TWITCH_CLIENT_ID,
              "Authorization": `Bearer ${req.session.token}`
            }
          }).then((result) => {
            result.data.data.forEach((result) => {
              arrayofFollwers.push(result)
            })
          })

        if (results.data.pagination.cursor) {
          await GetUserFollowers(profileId, results.data.pagination.cursor)
        }
      })

  }
  try {
    User.findOne({ twitchId: req.user.twitchId }, async (err, user) => {

      await GetUserFollowers(req.user.twitchId, "")
      await GetUserFollowing(req.user.twitchId, "")
      if (arrayofFollwers.length > user.followers.length || arrayofFollwers.length < user.followers.length) {
        user.followers = arrayofFollwers

      }
      if (arrayofUserFollowing.length > user.followings.length || arrayofUserFollowing.length < user.followings.length) {
        user.followings = arrayofUserFollowing
      }

      user.save();
      res.send({ followers: user.followers, followings: user.followings })
    })
  } catch (error) {
    res.send(error);
  }

})


router.get('/GetFollowers/:id', async (req, res) => {
  let arrayofFollwers = []
  let arrayofUserFollowing = []
  let GetUserFollowing = async (profileId, pagination) => {
    let mapStrings = ""
    await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${profileId}&first=100&after=${pagination}`
      ,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${req.session.token}`
        }
      }).then(async (results) => {
        results.data.data.forEach((followresult) => {
          mapStrings += `id=${followresult.to_id}&`
        })

        await axios.get(`https://api.twitch.tv/helix/users?${mapStrings}`
          , {
            headers: {
              "Client-Id": process.env.TWITCH_CLIENT_ID,
              "Authorization": `Bearer ${req.session.token}`
            }
          }).then((result) => {
            result.data.data.forEach((result) => {
              arrayofUserFollowing.push(result)
            })
          })


        if (results.data.pagination.cursor) {
          await GetUserFollowing(profileId, results.data.pagination.cursor)
        }
      })

  }

  let GetUserFollowers = async (profileId, pagination) => {
    let mapStrings = ""
    await axios.get(`https://api.twitch.tv/helix/users/follows?to_id=${profileId}&first=100&after=${pagination}`
      ,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${req.session.token}`
        }
      }).then(async (results) => {
        results.data.data.forEach((followresult) => {
          mapStrings += `id=${followresult.from_id}&`

        })
        if (mapStrings) {
          await axios.get(`https://api.twitch.tv/helix/users?${mapStrings}`
            , {
              headers: {
                "Client-Id": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${req.session.token}`
              }
            }).then((result) => {
              result.data.data.forEach((result) => {
                arrayofFollwers.push(result)
              })
            })

          if (results.data.pagination.cursor) {
            await GetUserFollowers(profileId, results.data.pagination.cursor)
          }
        }

      })

  }
  try {
    await GetUserFollowers(req.params.id, "")
    await GetUserFollowing(req.params.id, "")
    res.send({ followers: arrayofFollwers, followings: arrayofUserFollowing })

  } catch (error) {
    res.send(error);
  }

})


router.get('/getuser/:id', async (req, res) => {
  try {
    await axios.get(`https://api.twitch.tv/helix/users?login=${req.params.id}`
      , {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID,
          "Authorization": `Bearer ${req.session.token}`
        }
      }).then((result) => {
        res.send(result.data.data)
      })
  } catch (err) {
    res.status(500).json(err);
  }
})


router.get('/AllUser', async (req, res) => {
  try {
    const AllUser = await User.find({})
    AllUser.sort((a, b) => { return b.createdAt - a.createdAt })
    res.send(AllUser)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/AllUser/:id', async (req, res) => {
  const UserId = req.params.id

  try {
    const UserInfo = await User.findOne({ twitchId: UserId })
    res.send(UserInfo)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/DeleteUser/:id", async (req, res) => {
  const SelectedUser = req.params.id

  try {

    await User.findOneAndDelete({ twitchId: SelectedUser })
    await Post.deleteMany({ twitchId: SelectedUser })
    await Sessions.deleteMany({twitchId: SelectedUser})
    res.send("Deleted Successfully")
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete("/DeleteOwnUser/:id", async (req, res) => {
  const SelectedUser = req.params.id

  try {

    await User.findOneAndDelete({ twitchId: SelectedUser })
    await Post.deleteMany({ twitchId: SelectedUser })
    await Sessions.deleteMany({twitchId: SelectedUser})
    res.send("Deleted Successfully")
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete('/logout', async (req, res) => { //this will log the user out. Clear the cookies to remove any session

  try {
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
  } catch (error) {
    res.status(500).json(error);
  }

})
module.exports = router