// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var diarySchema = new Schema({
  user_id: { type: String, required: true},
  date: {
    day: { type: String, required: true, default: 1 },
    month: { type: String, required: true, default: 1 },
    year: { type: String, required: true, default: 1990 }
  },
  body: { type: String, required: true },
  watson_response: { type: String , default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

diarySchema.index({user_id:1, date:-1},{unique : true});

// the schema is useless so far
// we need to create a model using it
var diaryEntry = mongoose.model('DiaryEntry', diarySchema);

// make this available to our users in our Node applications
module.exports = diaryEntry;