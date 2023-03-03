/** contactController.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

const Contact = require("../models/contactModel");
const mongoose = require('../conf/dbConn');

module.exports = {
  contactListing: (req,res,next)=>{
    Contact.find((err, contactlist) => {
      if(err) next(err);
      else{
        //#region debug
        //  console.log("Try to access the first line of data");
        //  console.log(`${contactlist[0].name}\n${contactlist[0].phone}\n${contactlist[0].email}`);
        //#endregion debug
        res.render("contactlist", { data: contactlist, editLoad: {} });
      }
    })
  },

  contactEdit: async (req,res,next)=>{
    let contacts; let editItem;
    try{
      contacts = await Contact.find();
      editItem = await Contact.findById(req.params.id);
    }catch(err){
      next(`An ${err} error occurred during retrieving from database.`);
    }
    res.render("contactlist", { data: contacts, editLoad: editItem });
  },

  contactUpdate: (req,res,next)=>{
    //#region debug
    //  console.log(`user clicked Update.`);
    //  console.log(req.body.nameinput);
    //  console.log(req.body.phoneinput);
    //  console.log(req.body.emailinput);
    //  console.log(req.body.button);
    //#endregion debug

    // button value carries _id
    if(req.body.button){
      //#region debug
      // console.log("Updating contact...");
      //#endregion debug
      Contact.findOrCreate(
        {_id: mongoose.Types.ObjectId(req.body.button)}, // matching by contact _id
        {
          "name":req.body.nameinput,
          "phone":req.body.phoneinput,
          "email":req.body.emailinput
        },        
        {
          upsert:true
        },
        (err,result)=>{
          if(err) next(`A ${err} occurred during creating contacts.`);
          else{
            //#region debug
            //  console.log(result);
            //#endregion debug
          }
        }
      );
    }else{
      //#region debug
      // console.log("Create contact...");
      //#endregion debug
      Contact.findOrCreate(
        {name: req.body.nameinput}, // matching by contact name
        {
          "name":req.body.nameinput,
          "phone":req.body.phoneinput,
          "email":req.body.emailinput
        },
        {
          upsert:true
        },
        (err,result)=>{
          if(err) next(`A ${err} occurred during creating contacts.`);
          else{
            //#region debug
            //  console.log(result);
            //#endregion debug
          }
        }
      );
    }

    res.redirect("/contactlist")
  },
  
  contactDelete: (req, res, next) => {
    // console.log(req.params.id);
    Contact.deleteOne({ _id: req.params.id }, (err) => {
      if(err) {
        res.send(err);
        next(err);
      } else {
        res.redirect("/contactlist");
      }
    });
  }
}