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


app.get('*', (req, res) =>{
    res.send("hmm, looks like we took a wrong term somewhere. Lets go back.");
})

module.exports = app;
