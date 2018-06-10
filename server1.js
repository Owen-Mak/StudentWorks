var express=require('express');
var nodemailer = require("nodemailer");
var app=express();
var auth = require('./auth');
var dbconnect = require ('./db_connect');
const path = require("path");

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
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/
app.use(auth); // For authenticating, please do not comment out until the project is done.
app.use(express.static('views')); 
app.use('/js', express.static('js'));
app.use('/images', express.static('views/images'));
app.use(express.static('project'));
app.use('/js', express.static('js/main.js'));
app.use(session({secret: "keyboard warriors"}));
/*------------------Routing Started ------------------------*/

// Main Page
app.get('/',function(req,res){
    res.status(200).sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/main.js',function(req,res){
    res.sendFile(path.join(__dirname, 'views/main/main.js'));
});

app.get('/main.css',function(req,res){
    res.sendFile(path.join(__dirname, 'views/main/main.css'));
});

//login page
app.get('/login', function(req, res){    
    res.sendFile(path.join(__dirname, 'views/login/login.html'));
});

//Registration page
app.get('/register', function(req, res){
    res.sendFile(path.join(__dirname, 'views/registration/register.html'));
});

app.get('/complete',function(req,res){
    res.sendFile(path.join(__dirname, 'views/registration/complete.html'));
});


//this is for handling the POST data from login webform
app.post('/login', urlencodedParser, function(req, res){    
    dbconnect.connect();
    if (!req.body) {
        return res.sendStatus(400);
    }
    var username = req.body.username1;
    //console.log(req.body.username1);    
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
                res.status(401).redirect('/login/');
            } else {
                if (jsonResult[0].password === req.body.pass) {
                    //set your session information here
                    req.session.msg = `Welcome ${username}, you are now logged in.`;
                    res.redirect('/');
                    //res.send(`User ${username} identity confirmed, logging in`);                    
                } else {                   
                    req.session.msg = "Invalid Username/Password. Login Failed.";
                    res.status(401).redirect('/login/');
                }
            }
            //res.writeHead(200, {"Content-type":"application/json"});
            //res.end(JSON.stringify(data));
        }        
    });
    dbconnect.end();
});

/* Email verification  start*/
app.get('/send',function(req,res){
    console.log("made it to send");
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        res.end("error");
     } else {
            console.log("Message sent: " + response.message);
            //Create user account in database
            //testing with sample user data   ----> will use data from front end later on when it is available
            console.log ("Create sample user");
            var user = {
                firstName: 'Owen',
                lastName: 'Mak',
                password: 'password123',
                email: 'omak@myseneca.ca',
                username: 'omak',
                userType: 'Admin',
                program: 'CPA'
            };
            console.log ("Done Create sample user");
            dbconnect.connect();
            //dbconnect.createUser(user);
            dbconnect.end();
            res.send("<h1> Please check your email for a verification link </h1>");
    }
});
});

app.get('/verify',function(req,res){
console.log(req.protocol+":/"+req.get('host'));

if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        //Update emailRegistration status in database
        //res.status(200).sendfile(path.join(__dirname, 'views/registration/complete.html'));
        res.status(200).redirect('/complete');
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

/* Catches all unhandled requests */
app.use(function(req, res){
    res.status(404).send("Page not found");
});

/*--------------------Routing Over----------------------------*/

app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});
