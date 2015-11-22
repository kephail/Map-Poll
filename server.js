var express             = require('express'),
    React               = require('react'),
    ReactDOM            = require('react-dom'),
    mongoose            = require('mongoose'),
    bodyParser          = require('body-parser'),
    Schema              = mongoose.Schema,
    Question            = require('./app/schemas/question.js')(mongoose, Schema),
    Answer              = require('./app/schemas/answer.js')(mongoose, Schema),
    app                 = express(),
    port                = 3000;

mongoose.connect('mongodb://admin:map-poll1@ds047474.mongolab.com:47474/map-poll');


app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());


// Application ------------------------------------------------------
// Set up Routes for the application
require('./app/routes/routes.js')(app, Answer, Question);



// Listen -----------------------------------------------------------
app.listen(port);
console.log("App listening on port %s", port);
