// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userIdSchema = new Schema({
  user_id: { type: String, required: true, unique: true},
  name: { type: String, required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// the schema is useless so far
// we need to create a model using it
var userIdEntry = mongoose.model('UserIdEntry', userIdSchema);

// make this available to our users in our Node applications
module.exports = userIdEntry;