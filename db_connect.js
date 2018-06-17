var mysql = require('mysql');

//sets up database connection information structure
var connectInfo = {
    host : null,
    user : null,
    password : null,
    database : "sw",
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
    runQuery (sql, callback);
};

/* Creates a new user into the database based on information in the 'user' parameter
    registrationStatus is defaulted to FALSE
    registrationDate is defaulted to current time
*/
module.exports.createUser = function (user) {
    console.log("Inside createUser():");
    var sql = `INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationHashCode) \
    VALUES ('${user.firstName}', '${user.lastName}', '${user.password}', '${user.email}', '${user.username}', '${user.userType}', '${user.program}', FALSE, now())`;
    //runQuery(sql, callback);
    connection.query(sql, (err, result) => {
        if (err) {
            console.log ("Failed to create user:", user.firstName);
            throw err;
        } else {
            console.log (`${user.firstName} is added to database`);
        }
    });
};

module.exports.getAllProjects = function (callback) {
	var sql = 'SELECT * FROM PROJECTS';
    runQuery(sql, callback);
};

module.exports.getOneUser = function (username, callback){
    var sql = `SELECT * FROM USERS WHERE userName = '${username}';`;       
    runQuery (sql, callback);
};

module.exports.getOneProject = function (projectID, callback){
    var sql =   `SELECT proj.*, JSON_ARRAYAGG(JSON_OBJECT('firstName', u.firstName, 'lastName', u.lastName, 'userName',u.userName)) AS user
    FROM PROJECTS proj
        JOIN BRIDGE_USERS_PROJECTS b on proj.ProjectID = b.ProjectID
        JOIN USERS u on b.userID = u.userID
    WHERE proj.ProjectID = ${projectID};`      
    runQuery (sql, callback);
};

module.exports.validateRegistration = function (userName, callback) {
    var sql = ` UPDATE USERS
                SET registrationStatus = TRUE
                WHERE userName = ${userName};`
    runQuery (sql, callback);
}

module.exports.getAllProjectsFilterByLanguage = function (language, callback){
    var sql = `Select * 
                FROM PROJECTS proj
                WHERE Lower (proj.language) = Lower ('${language}');`;
    runQuery (sql, callback);
}

module.exports.getAllProjectsFilterByFramework = function (framework, callback){
    var sql = `Select * 
                FROM PROJECTS proj
                WHERE Lower (proj.framework) = Lower ('${framework}');`;    
    runQuery (sql, callback);
}

module.exports.getAllProjectsFilterByYear = function (year, callback){
    var sql = `SELECT * 
                FROM PROJECTS 
                WHERE DATE_FORMAT(creationDate, '%Y')=${year};`;    
    runQuery (sql, callback);
}

function runQuery(sql, callback){
    connection.query(sql, (err, result) => {
		if (err) {
			console.log ("Failed query: ", sql);
			throw err;
		} else {
			callback (null, result);
			//console.log ("Query success: ", sql);
		}
	});
}

module.exports.end = function (){
    console.log ("Disconnect!");
    connection.end();
};

