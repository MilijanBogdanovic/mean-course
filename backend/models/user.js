const { stringify } = require('@angular/compiler/src/util');
const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  name: {type:String, required:true},
  surname: {type:String, required:true},
  username: {type:String, required:true, unique:true},
  email: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  city: {type:String, required:true},
  date_of_birth: {type:String, required:true, unique:true},
  contact_phone: {type:String, required:true, unique:true}
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User',userSchema);

