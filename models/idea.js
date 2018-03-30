const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const ideaSchema = new Schema({
  title:{
    type: String, 
      required: true
  },
  details:{
    type: String,
    required: true
  },
  date:{
    type:Date,
    default: Date.now()
  },
  // this will store the users id
  userid:{ 
    type: String,
    default: 'RM1'
  }
});

mongoose.model('ideas', ideaSchema);