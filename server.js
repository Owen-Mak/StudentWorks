// Web app
var app = require('./app');

// Setting port for web app
// process.env.PORT lets the port be set by Heroku
var port = 6184;

app.listen(port, function() {
  console.log('Server started on http://localhost:' + port);
});