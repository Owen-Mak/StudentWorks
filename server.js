'use strict';

/* Server */
let express = require("express");
let app = express();

/* Middleware */
let fs = require('fs');
let path = require('path');

/* ROUTES */
/* root */
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + "/views/index.html"));
});


/* TO DO: We need to have a proper html file for our login page */
app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + "/views/login.html"));
});



/* No route found */
app.get('*', (req, res) =>{
    res.send("hmm, looks like we took a wrong term somewhere. Lets go back.");
})



/* Listen on port 3000 */
app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})
