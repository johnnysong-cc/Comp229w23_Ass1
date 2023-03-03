require("dotenv").config();
const session = require('express-session'), mongoSessionStore = require('connect-mongo');
const sessionConf = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: mongoSessionStore.create({
    mongoUrl: process.env.CONNSTRING,
    ttl: 2 * 24 * 60 * 60 // default ttl is 1 day
  })
};

module.exports = session(sessionConf);