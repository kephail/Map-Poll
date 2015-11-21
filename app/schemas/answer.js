var mongoose            = require('mongoose')
var Schema              = mongoose.Schema

var AnswerSchema = new Schema({
  questionID:           {type : String, 'default' : '', trim : true},
  ipAddress:            {type : String, 'default' : '', trim : true},
  currentLongitude:     {type : Number},
  currentLatitude:      {type : Number},
  currentCountry:       {type : String, 'default' : '', trim : true},
  currentCountryShort:  {type : String, 'default' : '', trim : true},
  selectedLongitude:    {type : Number},
  selectedLatitude:     {type : Number},
  selectedCountry:      {type : String, 'default' : '', trim : true},
  selectedCountryShort: {type : String, 'default' : '', trim : true},
  dateAnswered:         {type : Date, 'default' : Date.now},
});

module.exports = mongoose.model('Answer', AnswerSchema);
