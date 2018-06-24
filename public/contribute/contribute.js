$(document).ready(() => {
    userID = $("#userID").text();
    let url = "";

    // LOCAL
    url = "http://localhost:3000/api/getOneProject/?id=" + userID;   

    // PRODUCTION
    //url = "http://myvmlab.senecacollege.ca:6193/api/getOneProject/?id=" + userID;   

    $.getJSON(url, (data) => {
        console.log(data);
    });

    renderUserMenu();


});
