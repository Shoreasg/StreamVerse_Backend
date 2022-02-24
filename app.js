const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const userController = require('./controllers/UserController')
const HomePageController = require('./controllers/HomePageController')
const PostController = require('./controllers/PostController')
const CommentController = require('./controllers/CommentController')
const DATABASE = process.env.DATABASE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_BASE_URL = process.env.MONGO_BASE_URL;
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`
const app = express();
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'], credentials: true }));
app.enable('trust proxy')



app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  proxy : true ,
  cookie: {sameSite: "none", secure: true},
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  ttl: 1800
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (u, d) {
  d(null, u);
});
passport.deserializeUser(function (u, d) {
  d(null, u);
});

app.use(userController)
app.use(HomePageController)
app.use(PostController)
app.use(CommentController)

module.exports = app