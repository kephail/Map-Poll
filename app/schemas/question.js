var mongoose            = require('mongoose')
var Schema              = mongoose.Schema

var QuestionSchema = new Schema({
  name:         {type : String, 'default' : '', trim : true}
});

module.exports = mongoose.model('Question', QuestionSchema);
