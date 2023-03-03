/** userModel.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
// const userSchemaDesc = { username:String, password:String, googleId: String, facebookId: String };
const userSchemaDesc = { googleId: String, facebookId: String };
const userSchema = new mongoose.Schema(userSchemaDesc);
// userSchema.plugin(passportLocalMongoose,{
//   usernameField: 'username',
//   passwordField: 'password'
// });
userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);