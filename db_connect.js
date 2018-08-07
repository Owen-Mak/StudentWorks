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
      //console.log("Connected!");  only errors should be displayed, success expected
};

//-------USERS----------------
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
    //console.log("Inside createUser():");
    var sql = `INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationCode) \
    VALUES ('${user.firstName}', '${user.lastName}', '${user.password}', '${user.email}', '${user.username}', '${user.userType}', '${user.program}', ${user.registrationStatus}, now(), ${user.registrationCode})`;   
    connection.query(sql, (err, result) => {
        if (err) {
            console.log ("Failed SQL:", sql);
            throw err;
        } else {
            console.log (`${user.username} is added to database`);
        }
    });
};

module.exports.getOneUser = function (username, callback){
    var sql = `SELECT * FROM USERS WHERE userName = '${username}';`;       
    runQuery (sql, callback);
};

module.exports.getOneUserByID = function (userID, callback) {
    var sql = `SELECT * FROM USERS WHERE userID = ${userID}`;
    runQuery (sql, callback);
}
//returns 1 if username is found in database, otherwise, returns 0
module.exports.getUserExist = function (userName, callback){
    var sql = `SELECT EXISTS(SELECT * FROM USERS WHERE userName = '${userName}') AS userExist 
                FROM USERS LIMIT 1;`
    runQuery(sql, callback);
}

//-----------PROJECTS -------------------
module.exports.getOneProject = function (projectID, callback){
    var sql =   `SELECT proj.*, JSON_ARRAYAGG(JSON_OBJECT('firstName', u.firstName, 'lastName', u.lastName, 'userName',u.userName)) AS user
    FROM PROJECTS proj
        JOIN BRIDGE_USERS_PROJECTS b on proj.ProjectID = b.ProjectID
        JOIN USERS u on b.userID = u.userID
    WHERE proj.ProjectID = ${projectID};`      
    runQuery (sql, callback);
};

module.exports.getAllProjects = function (callback) {
	var sql = `SELECT * FROM PROJECTS WHERE status = 'approved';`;
    runQuery(sql, callback);
};

module.exports.getAllProjectsAdmin = function (callback) {
	var sql = `SELECT * FROM PROJECTS;`;
    runQuery(sql, callback);
};

module.exports.approveProject = function(projectID, callback) {
    var sql = `UPDATE PROJECTS 
                SET status='approved'
                WHERE projectID = ${projectID}`;
    runQuery (sql, callback);
}

module.exports.takedownProject = function(projectID, callback) {
    var sql = `UPDATE PROJECTS 
                SET status='pending'
                WHERE projectID = ${projectID}`;
    runQuery (sql, callback);
}

module.exports.setAdmin = function(userID, callback) {
    var sql = `UPDATE USERS 
                SET userType='Admin'
                WHERE userID = ${userID}`;
    runQuery (sql, callback);
}

module.exports.unsetAdmin = function(userID, callback) {
    var sql = `UPDATE USERS 
                SET userType='Contributor'
                WHERE userID = ${userID}`;
    runQuery (sql, callback);
}

module.exports.deleteUser = function(userID, callback){
    var sql = `DELETE FROM USERS
                WHERE userID = ${userID}`;
    runQuery(sql, callback);
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

//returns all projects performed by given user
module.exports.getProjectsByUser = function (userID, callback){
    var sql = ` SELECT proj.* FROM PROJECTS proj
                    JOIN BRIDGE_USERS_PROJECTS b on proj.projectID = b.projectID
                    JOIN USERS u on b.userID = u.userID
                WHERE u.userID = ${userID};`;
    runQuery(sql, callback);
}

//creates a new project from fields supplied in contribute page
module.exports.createProjectFromContribute = function (project, callback){
    var sql = `INSERT INTO PROJECTS (title, description, creationDate, language, framework, category, ImageFilePath, VideoFilePath, status, color, platform)  \
                VALUES ('${project.title}','${project.desc}', now(),'${project.language}','${project.framework}','${project.category}','${project.imageFilePath}',\
                '${project.videoFilePath}', 'pending', '${project.color}', '${project.platform}');\
                `;   
    connection.query(sql, (err, result) => {
        if (err) {
            console.log ("Failed SQL:", sql);
            throw err;
        } else {
            callback(err, result);            
            console.log (`${project.title} is added to database`);
        }
    });
}

// link the user to the project
module.exports.associateUserToProject = function (project, projectId, callback) {    
    var sql = `INSERT INTO BRIDGE_USERS_PROJECTS (userID, projectID) \
                VALUES (${project.userID}, ${projectId});`;
    //console.log ("associate sql: ", sql);
    runQuery(sql, callback);
}

//--------- REGISTRATION --------------
module.exports.validateRegistration = function (registrationCode) {
    var sql = ` UPDATE USERS
                SET registrationStatus = TRUE
                WHERE registrationCode = ${registrationCode};`
    connection.query(sql, (err, result) => {
        if (err) {
            console.log ("Failed SQL:", sql);
            throw err;
        } else {
            //console.log (`registration code ${registrationCode} is updated to database`);
        }
    });
}

//updates the password field of the given username
module.exports.updatePasswordByUsername = function (userName, password, callback) {
    var sql = ` UPDATE USERS
                SET password = '${password}'
                WHERE userName = '${userName}';`;
    runQuery(sql, callback);
}

//returns 0 if registration code does not exist in database, and 1 if it is found
module.exports.getRegCodeExist = function (registrationCode, callback) {
    var sql = `SELECT EXISTS(SELECT * FROM USERS WHERE registrationCode = ${registrationCode}) AS regCodeExist 
                FROM USERS LIMIT 1;`;
    runQuery(sql, callback);
}

//------------ Profile -------------------
module.exports.updateUserProfile = function (user, callback) {
    var sql =   `UPDATE USERS
                SET firstName = '${user.firstName}',
                    lastName = '${user.lastName}',
                    email = '${user.email}',
                    program = '${user.program}',\n`;
    if (user.imagePath != null) {
        sql += `    imagePath = '${user.imagePath}',`;
    }                
        sql+=`      userDescription = '${user.description}'                    
                WHERE userName = '${user.userName}'; `;
    //console.log ("uUP: ",sql);
    runQuery(sql, callback);
}

function runQuery(sql, callback){
    connection.query(sql, (err, result) => {
		if (err) {
			console.log ("Failed query: ", sql);
			throw err;
		} else {
			callback (null, result);
		}
	});
}

module.exports.end = function (){
    connection.end();
};
