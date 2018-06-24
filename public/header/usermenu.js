function renderUserMenu(){
    // There are 3 types of user: visitor, regular and admin
    let userType = $("#userType").text();
    let userMenu = ""; 

    if(userType === "Visitor"){
        userMenu += "<ul>";
        userMenu += "  <li><a href='login'>Login</a></li>";
        userMenu += "  <li><a href='register'>Register</a></li>";
        userMenu += "  <li><a href='login/forgotpass'>Forgot password</a></li>";
        userMenu += "</ul>";
    }else {
        userMenu += "<ul>";
        userMenu += "  <li><a href='/profile/profile.html'>Profile</a></li>";
        userMenu += "  <li><a href='/contribute/contribute.html'>Contribute</a></li>";
        userMenu += "  <li><a href='/login'>Logout</a></li>";
        userMenu += "</ul>";
    }

    $("#userMenu").html(userMenu);
}
