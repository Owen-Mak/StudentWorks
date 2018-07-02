let allProjects;
let allUsers;

$(document).ready(() => {
    let userType = $("#userType").text();
    if (userType != "Admin") {
        console.log("User is not logged in on ADMIN page. Add logic for production");
    }

    // GET ALL DATA
    let prjUrl = "http://localhost:3000/api/getAllProjectsAdmin";
    let userUrl = "http://localhost:3000/api/getAllUsers";

    // PRODUCTION
    //let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getAllProjectsAdmin";
    //let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getAllUsers";


    renderUserMenu(); // defined in usermenu.js

    // Title
    $("#pageTitleID").html("Administration");

    // Left menu
    $.getJSON(prjUrl, (data) => {
        allProjects = data;
    });

    $.getJSON(userUrl, (data) => {
        allUsers = data;
    });

    // Render LEft
    renderLeft();


    // Right menu
    renderRight();

});

function renderLeft() {
    let linksHtml = "" +
        "<button type='button' id='aprPrj'>Live Projects</button><br/>" +
        "<button type='button' id='penPrj'>Pending Projects</button><br/>" +
        "<button type='button' id='allUsr'>Contributors</button><br/>" +
        "<button type='button' id='netw'>Network</button><br/>";
    $("#div1").html(linksHtml);

    // Event handlers   
    $("#aprPrj").click(() => {
        $("#div2").empty();
        live();
    });

    $("#penPrj").click(() => {
        $("#div2").empty();
        pending();
    });

    $("#allUsr").click(() => {
        $("div2").empty();
        users();
    });
}

function live() {
    let tableHtml = "<div id='TT'>List of all projects on display</div>" +
        "<table class='table'>" +
        "  <thead class='thead-light'><tr>" +
        "    <th scope='col'></th>" +
        "    <th scope='col'>Title</th>" +
        "    <th scope='col'>Submitted by</th>" +
        "    <th scope='col'>Date</th>" +
        "    <th scope='col'></th>" +
        "</tr></thead>";

    let tableGuts = "";
    $.each(allProjects, (key, value) => {
        if (value.status == "approved") {
            let date = value.creationDate.substring(0, 4);

            tableGuts += "<tr>" +
                "<td><a href='/" + value.ImageFilePath + "'><img src='/images/icon2.png' id='im'/></a></td>" +
                "<td><a href='/projectPage/?id=" + value.projectID + "'>" + value.title + "</a></td>" +
                "<td>user</td>" +
                "<td>" + date + "</td>" +
                "<td><a href='#' style='color:red;'><img id='im2' src='/images/cancel.png'/><a>";
            "</tr>";
        }
    });
    tableHtml += tableGuts + "</table>";

    $("#div2").html(tableHtml);
    return;
}

function pending() {
    let tableHtml = "<div id='penPrjTitle'>List of projects waiting approval</div>" +
        "<table class='table'>" +
        "  <thead class='thead-light'><tr>" +
        "    <th scope='col'></th>" +
        "    <th scope='col'>Title</th>" +
        "    <th scope='col'>Submitted by</th>" +
        "    <th scope='col'>Date</th>" +
        "    <th scope='col'></th>" +
        "</tr></thead>";

    let tableGuts = "";
    $.each(allProjects, (key, value) => {
        if (value.status == "approved") {
            let date = _getDateApr(value.creationDate);

            tableGuts += "<tr>" +
                "<td><a href='/" + value.ImageFilePath + "'><img src='/images/icon2.png' id='im'/></a></td>" +
                "<td><a href='/projectPage/?id=" + value.projectID + "'>" + value.title + "</a></td>" +
                "<td>user</td>" +
                "<td>" + date + "</td>" +
                "<td><a href='#' style='color:red;'><img id='im2' src='/images/ok.png'/><a>";
            "</tr>";
        }
    });

    if (tableGuts == "") {
        tableHtml += "<tr ><td colspan='5' id='emptyTable'>No pending projects</td></tr>";
    }
    tableHtml += tableGuts + "</table>";

    $("#div2").html(tableHtml);
    return;
}

function users() {
    let tableHtml = "<div id='usrTitle'>All registered users</div>" +
        "<table class='table'>" +
        "  <thead class='thead-light'><tr>" +
        "    <th scope='col'>Name</th>" +
        "    <th scope='col'>Program</th>" +
        "    <th scope='col'>Email</th>" +
        "    <th scope='col'>Since</th>" +
        "    <th scope='col'></th>" +
        "</tr></thead>";

    let tableGuts = "";
    $.each(allUsers, (key, value) => {
        let date = _getDate(value.registrationDate);

        tableGuts += "<tr>" +
            "<td>" + value.firstName + " " + value.lastName + "</td>" +
            "<td>" + value.program + "</td>"+
            "<td>" + value.email + "</td>" +
            "<td>" + date + "</td>" +
            "<td></td>";
        "</tr>";

    });
    tableHtml += tableGuts + "</table>";

    $("#div2").html(tableHtml);
    return;
}


function renderRight() {
}

function _getDateApr(dt) {
    let date = new Date(dt);
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return date.getDate() + " " + months[date.getMonth()];
}

function _getDate(dt) {
    let date = new Date(dt);
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[date.getMonth()] + " " + date.getFullYear();
}