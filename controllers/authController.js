// // #region Express and Major Dependencies
// require("dotenv").config();
// const app = require("express")();
// const flash = require("connect-flash"); app.use(flash());
// // #endregion

// // #region Session Management by passport.js
// const session = require('express-session'), sessionConf = { secret: process.env.SECRET, resave: false, saveUninitialized: false };
// app.use(session(sessionConf));
// // passport initialization and request/respond injection
// const passport = require('passport'), passportLocalMongoose = require("passport-local-mongoose");
// app.use(passport.initialize());
// app.use(passport.session());

// // #endregion Session Management by passport.js

// // #region Database Configuration

// // connection
// const mongoose = require('mongoose'), findOrCreate = require("mongoose-findorcreate");
// mongoose.set('strictQuery', true);
// mongoose.connect(process.env.CONNSTRING, { useNewUrlParser: true, useUnifiedtopology: true }, err=>{
//   if(err) console.error("Error connecting to MongoDB:", err);
//   else console.log('Connected to MongoDB.');
// });
// mongoose.connection.on('error',console.error.bind(console,'connection Error:'));

// // user modeling
// const userSchemaDesc = { googleID: String, facebookID: String };
// const userSchema = new mongoose.Schema(userSchemaDesc);

// // schema injection
// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
// const User = mongoose.model("User", userSchema);

// // passport local strategy using mongoDB
// passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // #endregion

//   // #region utilities

//   // middleware: return to login if user is not authenticated
//   const requireAuth = (req, res, next) => {
//     if (!req.isAuthenticated()) res.redirect("/login");
//     else next();
//   }

//   // #endregion

//   // #region Exported handlers
// module.exports = {
//   displayRegistration: (req, res, next) => {
//     res.render('auth/register');
//   },
//   displayLogin: (req, res, next) => {
//     res.render('auth/login');
//   },
//   handleRegistration: (req, res, next)=>{
//     console.log(req.body);
//     User.register({ username: req.body.useremail }, 
//       req.body.password,
//       (err, user) => {
//         if(err) {
//           console.error(err); /* next(err); */
//           res.redirect("/register");
//         }
//         passport.authenticate('local')(req, res, () => {
//           res.redirect('/contactlist');
//         });
//       })
//   },
//   handleLogin: (req, res, next)=>{
//     const user = new User({username: req.body.useremail, password: req.body.password})
//     // res.render('auth/login');
//     req.login(user,err=>{
//       if(err) console.error(`An error occurred: ${err}`);
//       passport.authenticate("local")(req,res,function(){res.redirect("/contactlist");});
//     });
//     next();
//   },
//   userLogout: ()=>{
//     req.logout(err=>{
//       if(err) console.error(err);
//       else{
//         console.log("User logged out successfully.");
//         res.redirect("/");
//       }
//     });
//   }
// }
// // #endregion
