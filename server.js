const express=require('express');
const nodemailer = require("nodemailer");
const app=express();
const auth = require('./auth');
const dbconnect = require ('./db_connect');
const path = require("path");
const exphbs = require('express-handlebars');

var bodyParser = require('body-parser');
var session = require('express-session');

//This is for parsing json POST requests in text
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });



/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "studentworks10",
        pass: "prj666_182a07"
    }
});
/*------------------SMTP Over-----------------------------*/


//File usage
app.use(auth); // For authenticating, please do not comment out until the project is done.
app.use(express.static('public')); 
app.use(express.static('project'));
app.use(session({   secret: "keyboard warriors",
                    name: "session",
                    resave: true,
                    saveUninitialized: false,
                    cookie: {maxAge: 300000} //cookies expire in 5 minutes
                }));  // used to generate session tokens
app.engine('.hbs', exphbs({ extname: '.hbs' })); // tells server that hbs file extensions will be processed using handlebars engine
app.set('view engine', '.hbs');
/*------------------Routing Started ------------------------*/

// Main Page
app.get("/", (req,res) =>{
    res.status(200).sendFile(path.join(__dirname, 'public/main/main.html'));
});

//Registration page
app.get('/register', function(req, res){
    if (req.session.msg) {
        res.render('register', {serverMsg : req.session.msg});        
        req.session.msg = "";        
    } else {
        res.render('register', {serverMsg : req.session.msg});
    }
});

app.get('/complete',function(req,res){
    res.sendFile(path.join(__dirname, 'public/registration/complete.html'));
});

app.post('/complete', function(req,res){
    console.log('here')
});


//login page
app.get('/login', function(req, res){
    if (req.session.msg) {
        res.render('login', {serverMsg : req.session.msg});
        req.session.msg = ""; // resets the msg after sending it to client        
    } else {
        res.render('login');
    }
});

//this is for handling the POST data from login webform
app.post('/login', urlencodedParser, function(req, res){    
    dbconnect.connect();
    if (!req.body) {
        return res.sendStatus(400);
    }
    var username = req.body.username1;
    var password = req.body.pass;
    //console.log(username, password);
    if(!username || !password ) {
        // Render 'missing credentials'
        req.session.msg = "Missing credentials.";
        return res.status(401).redirect('/login');        
    }    
    var results = dbconnect.getOneUser(username, function (err, data) {
        if (err) { 
            console.log (err); throw err;
        } else {                        
            //validate the data here!!
            var jsonResult = JSON.parse(JSON.stringify(data));
            //console.log("result:", jsonResult[0]);
            if (jsonResult.length < 1){
                //case of username not found
                req.session.msg = "Invalid Username/Password. Login Failed.";
                res.status(401).redirect('/login');
            } else {
                if (jsonResult[0].password === req.body.pass  && jsonResult[0].registrationStatus == true) {
                    //set your session information here
                    req.session.authenticate = true;
                    //req.session.msg = `Welcome ${username}, you are now logged in.`;
                    //redirect back to main page
                    res.redirect('/');                                  
                } else {
                    if (jsonResult[0].registrationStatus == false){
                        req.session.msg = "Login failed, please verify your email.";
                    }else {
                        req.session.msg = "Invalid Username/Password. Login Failed.";
                    }                    
                    res.status(401).redirect('/login');
                }
            }
            //res.writeHead(200, {"Content-type":"application/json"});
            //res.end(JSON.stringify(data));
        }        
    });
    dbconnect.end();
});

/* Email verification  start*/
var rand,mailOptions,host,link;
app.post('/send', urlencodedParser, function(req,res){
    if (!req.body) {
        return res.sendStatus(400).redirect('/register');
    }
    if (!req.body.name || !req.body.password1 || !req.body.email){
        req.session.msg = "Missing credentials.";
        return res.status(401).redirect('/register');         
    }
    //check if user is already created within the database
    var userExist = false;
    function getUserExistence(){
        dbconnect.connect();
        dbconnect.getUserExist(req.body.name, function(err, data) {
            if (err) {throw err;}
            else {
                userExist = data[0].userExist;
            }
        });    
        dbconnect.end();
        return new Promise(function (resolve, reject){
            setTimeout(function() {
                if (userExist === 0){
                    resolve(userExist);
                } else {
                    reject(`Username "${req.body.name}" is already taken by another user. Please try again.`);                    
                }
            }, 1000);
        })
    }

   function sendMail(){
        rand=Math.floor((Math.random() * 100000) + 54);
        host=req.get('host');
        link="http://"+req.get('host')+"/verify?id="+rand;
        mailOptions={
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            console.log('got into /sendMail');
            if(error){
                console.log(error);
                res.end("error");
            } else {
                    console.log("Message sent: " + response.message);
                    res.send("<h1> Please check your email for a verification link </h1>");
            }
        });
        return new Promise(function (resolve, reject){
            resolve('sendMail resolved');
        })
    }

    function addUsertoDb(){
        dbconnect.connect(); 
        var user = {
            firstName: 'NULL',
            lastName: 'NULL',
            email: req.body.email,
            password: req.body.password1,                
            username: req.body.name,
            userType: 'NULL',
            program: 'NULL',
            registrationCode: rand
        };
        var errorMsg = "";
        try{
            dbconnect.createUser(user);   
        } catch (err) {
            errorMsg = err.message;
        }
        dbconnect.end();
        return new Promise (function(resolve, reject){
            if (errorMsg !== ""){
                reject (errorMsg);
            }else {
                resolve('addUserDb() resolved');
            }
        })
    }

    //executing checking user existence, send mail, adding new user to database in synchronous order
    getUserExistence()
    .then(sendMail, null)
    .then(addUsertoDb, null)
    .catch(function(rejectMsg){
        console.log('rejectMsg: ', rejectMsg);
        req.session.msg = rejectMsg;
        res.status(401).redirect('/register');
    });    
});

app.get('/verify',function(req,res){
console.log(req.protocol+"://"+req.get('host'));

if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    console.log(rand);
    if(req.query.id==rand)
    {
        console.log("email is verified");
        //Update emailRegistration status in database
        dbconnect.connect();
        dbconnect.validateRegistration(rand);
        dbconnect.end();
        req.session.msg = "Email successfully verified.";
        res.status(200).redirect('/login');
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.send("<h1>Request is from unknown source");
}
});   //email verification end


/* Returns information about all users in database */
app.get('/api/getAllUsers', function(req, res){
    dbconnect.connect(); 
    var results = dbconnect.getAllUsers(function(err,data){
        if (err){
            console.log ("ERROR: ", err);
        }else{
            console.log("result:", data);
			res.writeHead(200, {"Content-type":"application/json"});
			res.end(JSON.stringify(data));
            /* example for traversing the query results
            data.forEach((data) => {
                console.log(data.firstName);
            });
            */
        }
    });
   // res.send("Successful query!");    
    dbconnect.end();    
});

app.get('/api/getAllProjects', function(req, res) {
	dbconnect.connect();
	var results = dbconnect.getAllProjects(function(err, data){
		if (err) {
            console.log ("ERROR: ", err);
            throw err;			
		} else {
			res.writeHead(200, {"Content-type":"application/json"});
			res.end(JSON.stringify(data));
		}
	});	
});

app.get('/api/getAllProjects/:page', function(req, res) {
    dbconnect.connect();
    var page = req.params.page;
    if (isNaN(page)){
        res.send("Invalid page number");
    }else {
        var results = dbconnect.getAllProjects(function(err, data){
            if (err) {
                console.log ("ERROR: ", err);
                throw err;			
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
                var parsedData = new Array();
                for (var i=(6*page); i < (page*6+6); i++){
                    parsedData.push(data[i]);
                }
                res.end(JSON.stringify(parsedData));
            }
        });	
    }
});

app.get('/api/getOneProject', function(req, res){
    var projectID = req.query.id;
    if (projectID != null && !isNaN(projectID)){
        dbconnect.connect();
        var results = dbconnect.getOneProject(projectID, function(err,data){
            if (err) {                
                console.log ("ERROR: ", err);
                throw err;
            } else if (data){
                var users = new Array();
                if (data[0] && data[0].user){
                    var sqlUsers = JSON.parse(data[0].user);     
                    for (var i = 0; i < sqlUsers.length; i++){
                        var user = {firstName: sqlUsers[i].firstName, 
                            lastName:  sqlUsers[i].lastName, 
                            userName: sqlUsers[i].userName};
                        //console.log (i, user);
                        users.push(user);
                    }                                                
                }
                //console.log(data);
                delete data[0].user;
                data[0]['users'] = users;
                res.writeHead(200, {"Content-type":"application/json"});
                res.end(JSON.stringify(data));
            }
    	})
    } else { 
        res.send('Invalid project id provided');
    }
});
    
app.get('/api/getAllProjects/language/:language', function (req, res) {
    var language = req.params.language;
    if (language === null) {
        res.send ('No language provided');
    } else {
        dbconnect.connect();
        var results = dbconnect.getAllProjectsFilterByLanguage(language, function (err, data) {
            if (err) {
                console.log ("ERROR", err);
                throw err;
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
                res.end(JSON.stringify(data));
            }
        });
        dbconnect.end();
    }
});

app.get('/api/getAllProjects/framework/:framework', function (req, res) {
    var framework = req.params.framework;
    if (framework === null) {
        res.send ('No framework provided');
    } else {
        dbconnect.connect();
        var results = dbconnect.getAllProjectsFilterByFramework(framework, function (err, data) {
            if (err) {
                console.log ("ERROR", err);
                throw err;
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
                res.end(JSON.stringify(data));
            }
        });
        dbconnect.end();
    }
});

app.get('/api/getAllProjects/year/:year', function (req, res) {
    var year = req.params.year;
    if (year === null || isNaN(year)) {
        res.send ('Invalid year provided');
    } else {
        dbconnect.connect();
        var results = dbconnect.getAllProjectsFilterByYear(year, function (err, data) {
            if (err) {
                console.log ("ERROR", err);
                throw err;
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
                res.end(JSON.stringify(data));
            }
        });
        dbconnect.end();
    }
});

app.get('/api/getProjectsByUser/userID/:userID', function(req, res){
    var userID = req.params.userID;
    if (isNaN(userID) || (userID < 0)){
        res.send('Invalid userID provided');
    } else {
        dbconnect.connect();
        var results = dbconnect.getProjectsByUser(userID, function (err, data) {
            if (err) {
                console.log ("ERROR", err);
                throw err;
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
                res.end(JSON.stringify(data));
            }
        });
        dbconnect.end();
    }
});

/* Catches all unhandled requests */
app.use(function(req, res){
    res.status(404).send("Page not found");
});

/*--------------------Routing Over----------------------------*/

app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});
