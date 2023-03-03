/** contactModel.js
 * Student name: Johnny Z. Song
 * Student id: 301167073
 * January 30, 2023
 * March 1, 2023
 * ============================== */

const mongoose = require('mongoose');
const contactSchemaDesc = { 
  name: { type: String, required: true }, 
  phone: String, 
  email: String
}
const findOrCreate = require("mongoose-findorcreate");
const contactSchema = new mongoose.Schema(contactSchemaDesc);
contactSchema.plugin(findOrCreate);

module.exports = mongoose.model("Contact", contactSchema);