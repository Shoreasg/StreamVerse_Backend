const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport')
const session = require('express-session')
const userController = require('./controllers/UserController')
const User = require('./models/user')
const app = express();
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'], credentials: true }));



app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(u, d) {
    d(null, u);
  });
  passport.deserializeUser(function(u, d) {
    d(null, u);
  });

app.use(userController)

module.exports = app