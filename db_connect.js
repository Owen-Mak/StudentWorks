var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "studentworks"
});

connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = 'SELECT * FROM USERS';
      connection.query(sql, function(err, result, field){
          if (err) throw err;
          console.log ("Query result:\n", result);
          console.log ("Accessing first element, first name:\n", result[0].firstName);
      });      

      connection.end();
});


module.export = connection;
