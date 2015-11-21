var express             = require('express'),
    React               = require('react'),
    ReactDOM            = require('react-dom'),
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    Question            = require('./app/schemas/question.js'),
    Answer              = require('./app/schemas/answer.js'),
    app                 = express(),
    port                = 3000;

mongoose.connect('mongodb://admin:map-poll1@ds047474.mongolab.com:47474/map-poll');

Question.find({name: "First Question"}, function (err, res) {
  console.log(res);
});


app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));



// Application ------------------------------------------------------
// Set up Routes for the application
require('./app/routes/routes.js')(app);



// Listen -----------------------------------------------------------
app.listen(port);
console.log("App listening on port %s", port);
