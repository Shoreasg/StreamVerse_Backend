const passport = require('passport')
const express = require('express')
const User = require('../models/user')
const { default: axios } = require('axios')
const router = express.Router()
router.use(express.static("public"))




router.get("/GetFollowedChannels", (req, res) => {
    let data

    axios.get(`https://api.twitch.tv/helix/streams/followed?user_id=${req.user.TwitchId}`,
        {
            headers: {
                "Client-Id": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${req.session.token}`
            }
        })
        .then((data) => {
            res.send(data.data)
        })

})



module.exports = router