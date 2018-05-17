// Web app
var app = require('./app');

// Setting port for web app
var port = 6194;

app.listen(3000, '0,0,0,0', () => {
  console.log('Server started on port#' + port);
});