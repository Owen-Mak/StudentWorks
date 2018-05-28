var mysql = require('mysql');

//sets up database connection information structure
var connectInfo = {
    host : null,
    user : null,
    password : null,
    database : "studentworks",
    port : null
};

//uses a set of connection information depending on whether connection is local or remote
if (process.env.HOSTNAME === 'studentworks'){    
    connectInfo.host = "localhost";
    connectInfo.user = "root";
    connectInfo.password = "password";
    connectInfo.port = 3306;
} else {
    connectInfo.host = "myvmlab.senecacollege.ca";
    connectInfo.user = "student";
    connectInfo.password = "prj666_182a07";
    connectInfo.port = 6186;
}

//connects to the database
module.exports.connect = function(err) {
      if (err) throw err;
      console.log (connectInfo);
      connection = mysql.createConnection({
        host: connectInfo.host,
        user: connectInfo.user,
        password: connectInfo.password,
        database: connectInfo.database,
        port : connectInfo.port
    });
      console.log("Connected!");  
};

module.exports.getAllUsers = function (callback) {
    var sql =  'SELECT * FROM USERS';
    //performs query to get all users   
    connection.query(sql, (err, result) => {
        if (err) {
            throw err;
        } else{
            callback(null, result);
        }
        //console.log ("Query result:\n", result);
        //console.log ("Accessing first element, first name:\n", result[0].firstName);               
    }); 
};

/* Creates a new user into the database based on information in the 'user' parameter
    registrationStatus is defaulted to FALSE
    registrationDate is defaulted to current time
*/
module.exports.createUser = function (user) {
    console.log("Inside createUser():");
    var sql = `INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationHashCode) \
    VALUES ('${user.firstName}', '${user.lastName}', '${user.password}', '${user.email}', '${user.username}', '${user.userType}', '${user.program}', FALSE, now(), '${user.registrationHashCode}')`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log ("Failed to create user:", user.firstName);
            throw err;
        } else {
            console.log (`${user.firstName} is added to database`);
        }
    });
};

module.exports.end = function (){
    console.log ("Disconnect!");
    connection.end();
};

//module.export = connection;
