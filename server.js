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
    res.sendFile(path.join(__dirname, 'public/registration/register.html'));
});

app.get('/complete',function(req,res){
    res.sendFile(path.join(__dirname, 'public/registration/complete.html'));
});

app.post('/complete', urlencodedParser, function(req,res){
    console.log('here')
});


//login page
app.get('/login', function(req, res){
    if (req.session.msg) {
        res.render('login', {serverMsg : req.session.msg});
        req.session.msg = ""; // resets the msg after sending it to client        
    } else {
        res.render('login');
        //res.sendFile(path.join(__dirname, 'views/login/login.html'));
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
        return res.render("login/login", { serverMsg: "Missing credentials." });
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
                if (jsonResult[0].password === req.body.pass) {
                    //set your session information here
                    //req.session.msg = `Welcome ${username}, you are now logged in.`;
                    res.redirect('/');
                    //res.send(`User ${username} identity confirmed, logging in`);                    
                } else {                   
                    req.session.msg = "Invalid Username/Password. Login Failed.";
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
    //Create a random string, store in DB (This string does not need to be 'random' per say, as it's not used for security.)
    //This creates a random 1-12 character string of just random lowercase letters. 
    rand=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12);
    console.log(rand);
    //rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    //create the link to verfiy the email account, this link will use jquery to pass the hash (id) as well as the email
    //these two parameters are used with /verify 
    link="http://"+req.get('host')+"/verify?id="+rand+"&email="+req.body.email;
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        res.end("error");
     } else {
            console.log("Message sent: " + res.message);
            //Create user account in database
            //testing with sample user data   ----> will use data from front end later on when it is available
            console.log ("Create sample user");
            var user = {
                firstName: 'NULL',
                lastName: 'NULL',
                password: req.body.password,
                email: req.body.email,
                username: req.body.name,
                userType: 'NULL',
                program: 'NULL',
                //In your insert values script, think you need to put registrationCode before the registrationStatus and registrationDate so this works?
                registrationCode: rand
            };
            console.log ("Done Create sample user");
            dbconnect.connect();
            //should check if userName exists in db prior to creating new user
            //dbconnect.createUser(user);
            dbconnect.end();

            //replace with something a bit nicer?
            //res.sendFile("SOMEONE's WONDERFUL NEW HTML PAGE");
            res.redirect("/");
            
    }
});
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));

if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    //Check if id = the hashvalue stored in the user table
    //make call from DB to get the hashcode based on user's email. (req.query.email)
    if(req.query.id==rand)
    {
        console.log("email is verified");
        //Update emailRegistration status in database
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


/* Attempt to get all users   WIP - Owen*/
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
                        console.log (i, user);
                        users.push(user);
                    }                                                
                }
                console.log(data);
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

/* Catches all unhandled requests */
app.use(function(req, res){
    res.status(404).send("Page not found");
});

/*--------------------Routing Over----------------------------*/

app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});