
module.exports = function (mongoose, Schema) {

  var AnswerSchema = new Schema({
    questionID:           {type : String, 'default' : '', trim : true},
    ipAddress:            {type : String, 'default' : '', trim : true},
    currentLongitude:     {type : Number},
    currentLatitude:      {type : Number},
    currentCountry:       {type : String, 'default' : '', trim : true},
    currentCountryLong:   {type : Number},
    currentCountryLat:    {type : Number},
    selectedLongitude:    {type : Number},
    selectedLatitude:     {type : Number},
    selectedCountry:      {type : String, 'default' : '', trim : true},
    selectedCountryLong:  {type : Number},
    selectedCountryLat:   {type : Number},
    dateAnswered:         {type : Date, 'default' : Date.now},
  });

  return mongoose.model('Answer', AnswerSchema);

}
