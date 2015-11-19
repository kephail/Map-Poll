var express = require('express'),
    reactViews = require('express-react-views'),
    app = express(),
    port = 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

// Set up Routes for the application
require('./app/routes/routes.js')(app);

//Route not found -- Set 404
app.get('*', function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist'
    });
});

app.listen(port);
console.log('app running on port: ' + port);
