$(document).ready(() => {
    let userType = $("#userType").text();
    if(userType != "Admin"){
        console.log("User is not logged in on ADMIN page. Add logic in production");
    } 

    renderUserMenu();

    $("#pageTitleID").html("Administration");

});