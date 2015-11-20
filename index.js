var express             = require('express'),
    reactViews          = require('express-react-views'),
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

app.set('views', __dirname + '/views');
// app.set('view engine', 'jsx');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.engine('jsx', require('express-react-views').createEngine());

// Set up Routes for the application
require('./app/routes/routes.js')(app);

//Route not found -- Set 404
// app.get('*', function(req, res) {
//     res.json({
//         'route': 'Sorry this page does not exist'
//     });
// });

app.listen(port);
console.log('app running on port: ' + port);
