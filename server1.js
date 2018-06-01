var express=require('express');
var nodemailer = require("nodemailer");
var app=express();
var auth = require('./auth');
var dbconnect = require ('./db_connect');
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
app.use(auth);
app.use(express.static('video'));
/* Used to serve static content (images/css/javascript) in a folder called public*/
app.use(express.static('public'));
/*------------------Routing Started ------------------------*/

app.get('/',function(req,res){
    res.sendfile('views/index1.html');
});

/* Email verification  start*/
app.get('/send',function(req,res){
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.to,
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
                program: 'CPA',             
                registrationHashCode : "81dc9bdb52"
            };
            console.log ("Done Create sample user");
            dbconnect.connect();
            dbconnect.createUser(user);
            dbconnect.end();
            res.end("sent");
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
        res.send("<h1>Verified</h1>")
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source");
}
});   //email verification end

/* Attempt to get all users   WIP - Owen*/
app.get('/getAllUsers', function(req, res){
    dbconnect.connect();
    console.log ('getAllUsers request received');    
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
    console.log ("login response concluded");
});

app.get('/getAllProjects', function(req, res) {
	dbconnect.connect();
	var results = dbconnect.getAllProjects(function(err, data){
		if (err) {
			console.log ("ERROR: ", err);
		} else {
			res.writeHead(200, {"Content-type":"application/json"});
			res.end(JSON.stringify(data));
		}
	});	
});

/* Catches all unhandled requests */
app.use(function(req, res){
    res.status(404).send("Page not found");
});

/*--------------------Routing Over----------------------------*/

app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});
