/** authController.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 2, 2023
 * ============================== */

const passport = require('passport');
const User=require("../models/userModel");

module.exports = {
  isAuth: (req, res, next) => {
    if(!req.isAuthenticated()){
      res.redirect("/login");
    }
    next();
  },
  regPresenter: (req, res, next) => {
    //#region debug
    // console.log(req.session);
    //#endregion debug
    if(!req.user){  // if an authenticated and deserialized user is present in the session, registration doesn't occur.
      res.render('auth/register', { message: req.flash('regMsg') || "" });
    }else{
      req.flash('regMsg', 'You are currently logged in.');
      res.redirect('/contactlist');
    };
  },
  regHandler: (req, res, next)=>{
    User.register(
      {username:req.body.useremail},
      req.body.password,
      (err,user)=>{
        if(err){
          console.error("An error occurred during creating a new user.\n");
          if(err.name == "UserExistsError"){
            req.flash('regMsg', 'Registration Error: User already exists!');
            console.error("A user with the same _id already exists.\n");
          }
          return res.render("auth/register", { message: req.flash('regMsg') || "" });
        }else{
          if(!req.user){
            req.user=user;
            console.log(`The current user in the session to be authenticated is: ${req.user}.`);
          }
          // passport.authenticate("local",{
          //   successRedirect: "/contactlist",
          //   failureRedirect: "/login",
          //   failureFlash: true,
          //   failureMessage: "User cannot be authenticated."
          // })(req,res,(err)=>{
          //   if(err) next(err);
          //   else res.redirect("/contactlist")
          // });
          req.login(user,(err)=>{
            if(err) next(err);
            else res.redirect("/contactlist");
          });

          Object.keys(req.session).forEach(x=>console.log(req.session.x));
        }
      }
    );
  },
  regHandlerPrev: (req, res, next) => {
    //#region debug
    // console.log(req.session);
    //#endregion debug
    User.register(
      {username:req.body.useremail},  // use user's email as username for passport-local strategy
      req.body.password,              // password to be saved as salt and hash by passport-local strategy
      (err,user)=>{
        //#region debug: checking the user created and resolved
        // console.log(`the newly registered user is ${user}.`);
        //#endregion debug
        if(err){
          console.error("An error occurred during creating a new user.\n");
          if(err.name == "UserExistsError"){ // see Passport-local-mongoose'e Error Messages on github
            //#region debug: checking the user created and resolved
            // console.error(err.name);
            // console.error(err.message);
            // console.error(err.username);
            //#endregion debug
            req.flash('regMsg', 'Registration Error: User already exists!');
            console.error("A user with the same _id already exists.\n");
          }
          return res.render("auth/register", { message: req.flash('regMsg') || "" });
        }else{
          //#region debug: checking the user created and resolved
          console.log(user.username);
          // console.log(user.hash);
          //#endregion debug
          // passport.authenticate("local",{
          //   successRedirect: "/contactlist",
          //   failureRedirect: "/login",
          //   failureFlash: true,
          //   failureMessage: "User cannot be authenticated."
          // })(req,res,(err)=>{
          //   // if(err)
          //   //   next(err)
          //   // else
          //     console.error(err);
          //     res.redirect("/contactlist")
          // });
          // (Object.keys(req.session)).forEach(x=>console.log(req.session.x));
          if(!req.user){
            req.user=user;
            console.log(req.user);
          }
          passport.authenticate("local")(req,res,()=>{
            res.redirect('/contactlist');
          });
        }
      }
    );
  },
  loginPresenter: (req, res, next) => {
    //#region debug
    // console.log(req.session);
    //#endregion debug
    if(!req.user){  // if an authenticated and deserialized user is present in the session, login doesn't occur.
      res.render('auth/login', { message: req.flash("loginMsg") || "" });
    }else{
      res.redirect("/contactlist");
    }
  },
  loginHandler: (req,res,next)=>{
    passport.authenticate("local",(err,user,info)=>{
      if(err) return next(err); // if server error, go to general error handler
      if(!user){
        req.flash('loginMsg', 'Invalid username or password.');
        return res.redirect('/login');
      }
      req.login(user, (err)=>{
        if(err) return next(err); // if server error, go to general error handler
        else{
          console.log(info);
          req.flash('loginMsg', 'User information is correct.');
          return res.redirect('/contactlist');
        }
      });
    })(req,res,next);
  },
  loginHandlerPrev: (req, res, next) => {
    const user = new User({ username: req.body.useremail, password: req.body.password });
    req.login(user, (err)=>{
      if(err)
        console.error(`An error occurred: ${err}`); // serialize/deserialize issues may occur here
      else
        passport.authenticate("local",{
          successRedirect: "/contactlist",
          failureRedirect: "/login",
          failureFlash: true,
          failureMessage: 'Invalid username or password'
        })(req,res,(err)=>{
          if(err)
            next(err);
          else{
            // res.redirect("/contactlist");
            const failureMessage = req.flash('error')[0];
            console.log(failureMessage);
            res.render('auth/login', {message: failureMessage}, (err,html)=>{
              if(err) console.error(err);
              else{
                console.log(html);
                res.send(html);
              }
            });
          }
        });
      }
    );
    console.log(req.session);
  },
  logoutHandler:(req, res, next) => {
    (req, res, next) => {
      req.logout((err) => {
        if(err) next(err);
        else res.redirect("/");
      });
    }
  }
}