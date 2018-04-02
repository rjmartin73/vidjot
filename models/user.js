const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const userSchema = new Schema({
  email:{
    type: String, 
      required: true
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type:Date,
    default: Date.now()
  },
  // this will store the users id
  name:{ 
    type: String,
    default: 'RM1'
  }
});

mongoose.model('users', userSchema);