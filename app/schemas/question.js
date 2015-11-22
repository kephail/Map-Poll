module.exports = function (mongoose, Schema) {

  var QuestionSchema = new Schema({
    name:         {type : String, 'default' : '', trim : true}
  });

  return mongoose.model('Question', QuestionSchema);
  
}
