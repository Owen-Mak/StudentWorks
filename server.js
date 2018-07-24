const express=require('express');
const nodemailer = require("nodemailer");
const app=express();
const auth = require('./auth');
const dbconnect = require ('./db_connect');
const path = require("path");
const multer = require('multer');
const exphbs = require('express-handlebars');
let Client = require ('ssh2-sftp-client');
let sftp = new Client();

//SSL
const https = require('https');
const fs = require('fs');

var sslOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}

var bodyParser = require('body-parser');
var session = require('express-session');
var sftpStorage = require('multer-sftp-linux');
// objects for multer storage configurations
var storage;


//This is for parsing json POST requests in text
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// setting multer storage configuration based on whether it is on vm or localhost
if (process.env.HOSTNAME === 'studentworks'){ 
    storage = multer.diskStorage({
        destination: "public/userPhotos",
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

} else {    
    storage = sftpStorage({
       sftp: {
          host: 'myvmlab.senecacollege.ca',
          port: 6185,
          username: 'stephen',
          password: 'sux'
        },
        destination: function (req, file, cb) {            
            cb(null, path.posix.join ('./StudentWorks', 'public', 'userPhotos'));          
        },
        filename: function (req, file, cb) {
          cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.posix.extname(file.originalname));
        } 
      });   
}
var mediaForProject = multer.diskStorage({
    destination: "project/temp",
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });
var uploadContribute = multer({ storage: mediaForProject });
var uploadVideo = multer({ storage: mediaForProject });
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
                    cookie: {maxAge: 600000} //cookies expire in 10 minutes
                }));  // used to generate session tokens
app.engine('.hbs', exphbs({ extname: '.hbs' })); // tells server that hbs file extensions will be processed using handlebars engine
app.set('view engine', '.hbs');
/*------------------Routing Started ------------------------*/

/* Sets header to not cache the pages
   This disables the behaviour where user has access to restricted pages after logout 
   MUST be applied before the other routes*/
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});


//function call to make sure user is logged in ** USED for recording page**.
function ensureLogin(req, res, next) {
    if (!req.session.authenticate) {
      res.redirect("/login");
    } else {
      next();
    }
  };

// PROJECT UPLOAD page
app.post("/upload-project", uploadContribute.fields([{name: "image", maxCount: 1}, {name: "video", maxCount: 1}]), (req, res) => {
    // FRONT-END guarantees that all values are present, escept 'category' which is optional;
    // Project image and video is in /project/temp folder and of proper format

    // flags for validating fields
    var validateResult = true;
    var validateLength = true;
    //checks for the required text fields in req.body
    function checkTextFieldExist (key){
        if (req.body[key] === undefined || req.body[key] == ""){
            //console.log ("req.body key:", req.body[key], key);
            validateResult = false;
            res.status(400).send("validation error");            
        }
        // ensure userID is a number greater than 0
        if (key == 'userID') {
            if (isNaN(req.body[key]) || req.body[key] < 0){
                validateResult = false;
                res.status(400).send("validation error");
            }
        }
    }

    // checks against the length of each input field against their max field lengths
    function checkFieldLength (value, key){                      
        if (req.body[key]){
            if (req.body[key].length > value){
                validateLength = false;
                res.status(400).send("validation error - field length");
            }
        }
        if (req.files[key] != undefined){
            //console.log ("longfileLength:", req.files[key][0].path.length);
            if (req.files[key][0].path.length > value){
                validateLength = false;
                res.status(400).send("validation error - file path length");
            }
        }
    }

    //checks for the required fields in req.files
    function checkFilesFieldExist (key){
        if (req.files[key] === undefined || req.files[key] == ""){
            //console.log ("req.files key:", req.files[key], key);
            validateResult = false;
            res.status(400).send("validation error - file");            
        }
    }

    // Server side validation - text fields
    // note that category field is not required    
    var reqTextFields = ['userID', 'title', 'language', 'framework', 'platform', 'desc'];      
    reqTextFields.forEach(checkTextFieldExist);

    // Server side validation - files fields
    var reqFilesFields = ['image', 'video'];
    reqFilesFields.forEach(checkFilesFieldExist);
  
      // maps input field to their max length, and then checks against it
      new Map ([[ 'title', 30],
                [ 'language', 30],
                [ 'framework', 30],
                [ 'category', 20],
                [ 'image', 255],
                [ 'video', 255],
            ]).forEach(checkFieldLength); 

    // exits function if validation has failed
    if (validateResult !== true || validateLength !== true){
        return false;
    }

    //since multer-sftp does not work for multiple files, we are manually sftping the two files onto vm
    if (process.env.HOSTNAME !== 'studentworks'){
        sftp.connect({
            host: 'myvmlab.senecacollege.ca',
            port: 6185,
            username: 'student',
            privateKey:  require('fs').readFileSync('public/publicKey.txt')
            //password: process.env.vmpassword
        }).then(() => {
            sftp.put (req.files['image'][0].path, path.posix.join ('./StudentWorks', 'project', 'temp', req.files['image'][0].filename));
            sftp.put (req.files['video'][0].path, path.posix.join ('./StudentWorks', 'project', 'temp', req.files['video'][0].filename));
        }).catch((err)=> {
            console.log(err, 'Contribute: sftp error');
        })
    }
  
    // creates a project object that stores all the validated fields
    var project = {
        userID      : req.body.userID,
        title       : req.body.title,
        language    : req.body.language,
        framework   : req.body.framework,
        platform    : req.body.platform,
        category    : (req.body.category === undefined) ? "" : req.body.category,
        desc        : req.body.desc,        
        imageFilePath   : `temp/${req.files['image'][0].filename}`,
        videoFilePath   : `temp/${req.files['video'][0].filename}`
    }
    //console.log ("project object", project);

    // Updating DB with the data in project object
    var result;    
    async function addProjectInDB (project){ 
        dbconnect.connect();
        let promise = new Promise ((resolve, reject) =>{
            dbconnect.createProjectFromContribute(project, function (err,data){
                if (err){
                    reject(err);
                    throw err;
                }else {
                    // returns the projectID of the newly created project
                    resolve(data.insertId);
                }                
            });
        });
        // waits and captures the projectId
        result = await promise; 
        dbconnect.end();

        return new Promise ( function (resolve, reject){                                                                         
            // console.log ("projectId:", result);
            // Note: can only return one object back to next function, which is result
            resolve(result);                       
        });
    }

    function assocociateUserToProjectInDB (projectId) {        
        dbconnect.connect();
        dbconnect.associateUserToProject(project, projectId, (err, data) =>{
            if (err) {                
                throw err;
            }
        });
        dbconnect.end();        
    }

    addProjectInDB(project)  
    .then(assocociateUserToProjectInDB, null)
    .catch (function (rejectMsg){
        // stuff
    });
    res.status(200).send('success');
});

//MAIN Page
app.get("/", (req,res) =>{
    res.status(200).render('main', {authenticate :  req.session.authenticate,
                                    userID       :  req.session.userID,
                                    userType     :  req.session.userType});
});

//PROJECT page
app.get('/projectPage', (req,res) => {
    res.status(200).render('project', {    authenticate :  req.session.authenticate,
                                           userID       :  req.session.userID,
                                           userType     :  req.session.userType});
});

//PROFILE page
app.get('/profile', (req,res) => {
    if (req.session.authenticate){
        res.status(200).render('profile', {     authenticate :  req.session.authenticate,
                                                userID       :  req.session.userID,
                                                userType     :  req.session.userType});
        } else {
            res.status(200).redirect("/login");
        }
});

//PROJECT UPLOAD page
app.get('/contribute', (req,res) => {
    console.log(req.query.video);
    if (!req.session.authenticate){
        res.status(200).render('contribute', {  authenticate :  req.session.authenticate,
                                                userID       :  req.session.userID,
                                                userType     :  req.session.userType,
                                                videoFile    :  req.query.video});
    } else {
        res.status(200).redirect("/login");
    }
});

//RECORDING page + Upload Video
app.get('/recording', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/recording/recording.html'));                                  
});

app.post('/upload-video', uploadVideo.single('video-blob'), (req, res, next) => {
    console.log(req.file.path);
    var file = req.file.path;
    res.status(200).send(file);
    //next();
    //res.redirect("/");
    
});

//ADMINISTRATION page
app.get('/adminPage', (req,res) => {
    res.status(200).render('admin', {    authenticate :  req.session.authenticate,
                                            userID       :  req.session.userID,
                                            userType     :  req.session.userType});
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
            if (jsonResult.length < 1){
                //case of username not found
                req.session.msg = "Invalid Username/Password. Login Failed.";
                res.status(401).redirect('/login');
            } else {
                if (jsonResult[0].password === req.body.pass  && jsonResult[0].registrationStatus == true) {
                    //set your session information here                    
                    req.session.authenticate = true;
                    req.session.userName = username;
                    req.session.userID = jsonResult[0].userID;
                    req.session.userType = jsonResult[0].userType;
                    //redirect back to main page
                    res.status(200).redirect('/');                                  
                } else {
                    if (jsonResult[0].registrationStatus == false){
                        req.session.msg = "Login failed, please verify your email.";
                    }else {
                        req.session.msg = "Invalid Username/Password. Login Failed.";
                    }                    
                    res.status(401).redirect('/login');
                }
            }
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
        link="https://"+req.get('host')+"/verify?id="+rand+"&name="+req.body.name;;
        mailOptions = {
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : `Hello ${req.body.name},<br> 
                    Please Click on the link to verify your email.<br>
                    <a href="${link}">Click here to verify</a>
                    <input type="hidden" value=${req.body.name} name="userName"/>`
        }
        smtpTransport.sendMail(mailOptions, function(error, response){
            console.log('got into /sendMail');
            if(error){
                console.log(error);
                res.end("error");
            } else {
                req.session.msg = "Please check your email for a verification link.";
                return res.status(401).redirect('/register'); 
            }
        });
        return new Promise(function (resolve, reject){
            resolve('sendMail resolved');
        })
    }

    /* this will create a new user into the database based on the 3 fields supplied in login webform
        The user created user will be initially be a contriubtor, without a firstName, lastName or affiliated program
        The registrationCode will be the random value created when the email was sent
    */
    function addUsertoDb(){
        dbconnect.connect(); 
        var user = {
            firstName: 'NULL',
            lastName: 'NULL',
            email: req.body.email,
            password: req.body.password1,                
            username: req.body.name,
            userType: 'Contributor',
            program: 'NULL',
            registrationStatus : 'FALSE',
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
        //console.log('rejectMsg: ', rejectMsg);
        req.session.msg = rejectMsg;
        res.status(401).redirect('/register');
    });    
});

app.get('/verify',function(req,res){
    console.log(req.protocol+"://"+req.get('host'));
    var regCodeExist = false;

    function getRegCodeExistence() {        
        dbconnect.connect();
        dbconnect.getRegCodeExist(req.query.id, function (err, data) {
            if (err){
                throw err;
            } else {
                //console.log("regCode:", data[0].regCodeExist)
                regCodeExist = data[0].regCodeExist;
            }
        })
        dbconnect.end();
        return new Promise(function (resolve, reject){
            setTimeout(function() {
                if (regCodeExist == 1){
                    //console.log('resolved at getRegCodeExisitence');
                    resolve(req.query.id, regCodeExist);
                } else {
                    reject(`regCode ${req.query.id} was not found in database`);                    
                }
            }, 1000);
        });
    }

    function validateRegistration(regCode, regCodeExist){    
        console.log("inside validate registration");        
        //Update emailRegistration status in database
        dbconnect.connect();
        dbconnect.validateRegistration(regCode);
        dbconnect.end();
        req.session.msg = "Email successfully verified.";
        res.status(200).redirect('/login');
        return new Promise (function (resolve, reject) {
            setTimeout (function () {
                resolve("Email successfully verified");
            }, 1000);
        });
    }

    //if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
    if (req.query.id){
        console.log("Domain is matched. Information is from Authentic email");    
        getRegCodeExistence()
        .then(validateRegistration, null)
        .catch(function(rejectMsg) {
            console.log("email is not verified");
            console.log(rejectMsg);
            res.end(`<h1>Bad Request</h1>`);
        });
    } else {
        //console.log("from bad request:", req.protocol+"://"+req.get('host'));
        //console.log("from bad request:","http://"+host);        
        res.send("<h1>Request is from unknown source</h1>");
    }
});   //email verification end


//Forgot password
app.get("/login/forgotpass", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public/login/forgot.html'));
});

app.post("/login/forgotpassword", urlencodedParser,(req, res) => {
    var tempPass = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12); 
    var userExist = false;
    function getUserExistence(){
        dbconnect.connect();
        dbconnect.getUserExist(req.body.username1, function(err, data) {
            if (err) {throw err;}
            else {
                console.log(data[0].userExist);
                userExist = data[0].userExist;
            }
        });    
        dbconnect.end();
        return new Promise(function (resolve, reject){
            setTimeout(function() {
                if (userExist === 0){
                    reject(`Username "${req.body.username1}" is not in our system!`);                    
                } else {
                    resolve(userExist);
                }
            }, 1000);
        })
    }
    
    function getUser(){
        return new Promise(function(resolve, reject){
            dbconnect.connect();
            dbconnect.getOneUser(req.body.username1, function(err, data){
                if(err){
                    //need to update the page to say no user is found
                    reject();
                }
                //we have a user, go at it...
                else{
                        //grab user data
                        var user = JSON.parse(JSON.stringify(data));
                        //send an e-mail for user to access new password.
                        var passlink = "http://myvmlab.senecacollege.ca:6193/forgotpass/complete";
                        var newMailOptions = {
                            to : user[0].email,
                            subject : "StudentWorks Password Recovery",
                            html: "Hello, " + user[0].userName + "<br> A request has been made to change your password. <br> Your temporary password is: "+tempPass+"<br><a href=" + passlink + ">Click here to change your password</a>"
                        }
                        smtpTransport.sendMail(newMailOptions, function(error, response){
                            console.log('got into /sendMail');
                            if(error){
                                console.log(error);
                                res.end("error");
                                reject();
                            } else {
                                    res.status(200).redirect('/check-email');
                                    resolve();
                            }
                        });
                        
                    }
            });
         });
         dbconnect.end();
    }

    function updatePassword() {
        return new Promise(function (resolve, reject){
             dbconnect.connect();
             dbconnect.updatePasswordByUsername(req.body.username1, tempPass,function(err, data){
                 if (err){
                         console.log("could not update password");
                         reject();
                     }
                     else{
                         resolve();   
                     }
              });
          dbconnect.end();
         });
     };
     getUserExistence()
     .then(getUser, null)
     .then(updatePassword, null)
     .catch(function(rejectMsg){
        console.log('rejectMsg: ', rejectMsg);
        req.session.msg = rejectMsg;
        res.status(401).redirect('/login');
    });   
      
});

app.get("/check-email", (req, res) => {
    res.render('email');
});

app.get("/forgotpass/complete", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public/registration/complete.html'));
});

//Finish the password resetting (can be used apart from 'Forgetting a password')
app.post('/complete', urlencodedParser, function(req,res){
    dbconnect.connect();
    var password;
    function checkUser() {
        return new Promise(function(resolve, reject){
            dbconnect.connect();
            dbconnect.getOneUser(req.body.username, function (err, data) {
                if (err) { 
                    console.log (err); throw err;
                } else {                        
                    //validate the data here!!
                    var jsonResult = JSON.parse(JSON.stringify(data));
                    if (jsonResult.length < 1){
                        //case of username not found
                        req.session.msg = "Invalid Username/Password. Failed to update password.";
                        res.status(401).redirect('/login');
                    } else {
                        if (jsonResult[0].password === req.body.oldpassword  && jsonResult[0].registrationStatus == true) {
                                resolve("passwords match!");                          
                        } else {
                            if (jsonResult[0].registrationStatus == false){
                                req.session.msg = "Password entry failed, please verify your email.";
                            }else {
                                req.session.msg = "Invalid Username/Password.Failed to update password.";
                            }                    
                            res.status(401).redirect('/login');
                            reject();
                        }
                    }
                }
            });
        });
    }
    function getUser(){ 
        return new Promise(function (resolve, reject){
            
            dbconnect.getOneUser(req.body.username, function (err, data) {
                if (err) { 
                    console.log (err); throw err;
                } else {          
                    //validate the data here!!
                    var user = JSON.parse(JSON.stringify(data));
                    if (user.length < 1){
                        //case of username not found
                        req.session.msg = "Invalid Username/Password. Login Failed.";
                        res.status(401).redirect('/login');
                    } else {
                        if (user[0].password === req.body.oldpassword  && user[0].registrationStatus == true) {
                            //Set user password to new password
                            var password = req.body.password1;
                            resolve();
                        }
                        else {
                            req.session.msg = "Passwords did not match.";
                            reject("Password did not match.");
                        }
                    }
                }
            dbconnect.end();
            });
        });
    };

    function updatePassord() {
       return new Promise(function (resolve, reject){
            dbconnect.connect();
            dbconnect.updatePasswordByUsername(req.body.username, req.body.password1,function(err, data){
                if (err){
                        console.log("could not update password");
                        reject();
                    }
                    else{
                        req.session.authenticate = true;
                        resolve(res.redirect('/'));   
                    }
             });
         dbconnect.end();
        });
    };
    checkUser()
    .then(getUser, null)
    .then(updatePassord, null)
    .catch(function(rejectMsg){
        console.log('rejectMsg: ', rejectMsg);
        req.session.msg = rejectMsg;
        res.status(401).redirect('/register');
    });    
    
});

app.post ('/profile', upload.single("img-input"), function (req,res){
    console.log ('got to profile');
    if (!req.body){
        return res.sendStatus(400).redirect('/profile');
    }
    
    const formData = req.body;
    const formFile = req.file;
    //console.log ("server.js => formFile", JSON.stringify(req.file));
    //console.log ("description:", req.body.description);
    var user = {
        userName : req.body.username,        
        firstName:  req.body.fname,
        lastName : req.body.lname,
        email    : req.body.email,    
        program  : req.body.program,
        description: req.body.description,
        imagePath: (req.file == null) ? null : `/userPhotos/${req.file.filename}`
    }
    dbconnect.connect();
    dbconnect.updateUserProfile(user, function(err, data) {
        if (err){
            res.send (err);
            throw err;
        } else{
            // console.log ("inside updateUserProfile:", user);
            // tells the ajax that request was successful
            res.send("success");
        }
    });
    dbconnect.end();    
})
/*------------------Routing End ------------------------*/

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

    app.get('/api/getUserByID/id/:id', function(req, res) {
    var userID = req.params.id;
    if (req.params.id && !isNaN(req.params.id)){
        dbconnect.connect();
        var results = dbconnect.getOneUserByID(userID, function(err, data){
            if (err){
                console.log ("Error at getUserByID: ", err);
                throw err;
            } else {
                res.writeHead(200, {"Content-type":"application/json"});
			    res.end(JSON.stringify(data));
            }
        });  
        dbconnect.end();      
    } else {
        res.status(400).end('Bad request, invalid userId');
    }

})

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
    dbconnect.end();	
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

app.get('/api/getOneProject/id/:id', function(req, res){
    var projectID = req.params.id;
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
        res.status(400).end('Invalid project id provided');
    }
});


/* NOT USED sends a list of 6 projects for rendering
   additional projects can be sent by changing the page number */
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


//logout route - 
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
})

/* Catches all unhandled requests */
app.use(function(req, res){
    res.status(404).send("Page not found");
});

/*--------------------Routing Over----------------------------*/


//Get a proper port
var port = process.env.PORT || 3000;
const server = https.createServer(sslOptions, app).listen(port, () => {
    console.log("Express Listening on port: " + port);
});
