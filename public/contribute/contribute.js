$(document).ready(() => {
    userID = $("#userID").text();
    let url = "";

    url = "http://localhost:3000/api/getOneProject/?id=" + userID;   
    //url = "http://myvmlab.senecacollege.ca:6193/api/getOneProject/?id=" + userID;   

    $.getJSON(url, (data) => {
        console.log(data);
    });


});
