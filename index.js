var express = require('express'),
    app = express(),
    port = 3000;

// Set up Routes for the application
require('./app/routes/routes.js')(app);

app.listen(port);
console.log('app running on port: ' + port);
