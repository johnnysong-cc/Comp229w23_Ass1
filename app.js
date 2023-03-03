//#region dependencies
require("dotenv").config();
const express = require('express');
const session = require('./conf/sessionMgmt');
const passport = require('passport');
const mongoose = require('./conf/dbConn');
const path = require('path'), flash = require("connect-flash");
const createError = require('http-errors'), logger = require('morgan');
const indexRoute=require('./routes/indexRoute');
const authRoute=require('./routes/authRoute');
const contactRoute=require('./routes/contactRoute');
const app = express();
//#endregion dependencies

//#region View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// #endregion View Engine Setup

//#region test db conection
// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.CONNSTRING,
//   { useNewUrlParser: true, useUnifiedtopology: true },
//   (err) => {
//     if (err) console.error("Error connecting to MongoDB:", err);
//     else console.log('Connected to MongoDB.');
//   });
// mongoose.connection.on('error', console.error.bind(console, 'connection Error:'));
//#endregion

//#region HTTP Pipeline
app.use(session);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// session taken over by the passport-local strategy
app.use(passport.initialize());
app.use(passport.session());

// model injection by the passport-local strategy
const User=require("./models/userModel");
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser((user, done)=>{
  console.log(user)
  done(null, user.id);
});
passport.deserializeUser((id, done)=>{
  User.findOne({_id:id}, (err, user)=>{
    console.log(user)
    done(err, user);
  });
});


app.use('/', indexRoute);
app.use('/', authRoute);
app.use('/contactlist', contactRoute);
//#endregion HTTP Pipeline

// #region Error Handler

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// #endregion

// EOF

module.exports = app;