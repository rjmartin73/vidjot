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
  user:{ 
    type: String,
    default: 'RM1',
    required: true
  }
});

mongoose.model('ideas', ideaSchema);