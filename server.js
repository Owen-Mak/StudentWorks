const express=require('express');
const nodemailer = require("nodemailer");
const app=express();
const auth = require('./auth');
const dbconnect = require ('./db_connect');
const path = require("path");

app.use(auth); // For authenticating, please do not comment out until the project is done.
app.use(express.static('public')); 
app.use(express.static('project'));


//RECORDING page
app.get('/recording', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/recording/recording.html'));

    //res.status(200).render('recording', {    authenticate :  req.session.authenticate,
    //                                        userID       :  req.session.userID,
    //                                        userType     :  req.session.userType});
                                            
});

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Express Started on port " + port);
});
