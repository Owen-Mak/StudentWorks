// LOCAL
let prjUrl = "http://localhost:3000/api/getAllProjectsAdmin";
let userUrl = "http://localhost:3000/api/getAllUsers";
let aprUrl = "http://localhost:3000/api/approveProject/";
let dwnUrl = "http://localhost:3000/api/takedownProject/";
let serAdm = "http://localhost:3000/api/serverAdmin";

// PRODUCTION
//let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getAllProjectsAdmin";
//let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getAllUsers";

// DATA
let allProjects = "";
let allUsers;

$(document).ready(() => {
    if ($("#userType").text() != "Admin") {
        //alert("Opps, how did we get here?");  // SET IN PRODUCTION
        //window.location.replace("/"); // Extra security check
    }

    renderUserMenu(); // defined in usermenu.js

    // Title
    $("#pageTitleID").html("Administration");

    // MENU ##
    renderLeft();

    // BODY ##
    $.getJSON(prjUrl, (data) => {
        allProjects = data;
        live();
    });

    $.getJSON(userUrl, (data) => {
        allUsers = data;
    });

    // STATS ##
    renderRight();

});

// MENU ---------------------------
function renderLeft() {
    let linksHtml = "" +
        "<div class='btn-group'>" +
        "  <a class='btn text-right'id='aprPrj'>Live Projects</a><br/>" +
        "  <a class='btn text-right'id='penPrj'>Pending Approval</a><br/>" +
        "  <a class='btn text-right'id='allUsr'>Contributors</a><br/>" +
        "  <a class='btn text-right'id='netw'>Traffic</a><br/>" +
        "</div>";

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

    $("#netw").click(() => {
        $("#div2").empty();
        traffic();
    });
}

// BODY ---------------------------
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
            let id = value.projectID;

            tableGuts += "<tr>" +
                "<td><a href='/" + value.ImageFilePath + "'><img src='/images/icon2.png' id='im'/></a></td>" +
                "<td><a href='/projectPage/?id=" + value.projectID + "'>" + value.title + "</a></td>" +
                "<td>user</td>" +
                "<td>" + date + "</td>" +
                "<td><a href='#' onclick='takedownPrj(" + id + ")'><img id='im2' src='/images/cancel.png'/><a>";
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
        if (value.status == "pending") {
            let date = _getDateApr(value.creationDate);
            let id = value.projectID;

            tableGuts += "<tr>" +
                "<td><a href='/" + value.ImageFilePath + "'><img src='/images/icon2.png' id='im'/></a></td>" +
                "<td><a href='/projectPage/?id=" + value.projectID + "'>" + value.title + "</a></td>" +
                "<td>user</td>" +
                "<td>" + date + "</td>" +
                "<td><a href='#' onclick='approvePrj(" + id + ")'><img id='im2' src='/images/ok.png'/><a>";
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
            "<td>" + value.program + "</td>" +
            "<td>" + value.email + "</td>" +
            "<td>" + date + "</td>" +
            "<td></td>";
        "</tr>";

    });
    tableHtml += tableGuts + "</table>";

    $("#div2").html(tableHtml);
    return;
}

function traffic() {
}

function approvePrj(id) {
    $.get(aprUrl + id, (data) => {
        if (data == "changed") {
            $.get(prjUrl, (data) => {
                allProjects = data;
                $("#div2").empty();
                pending();
            })
        } else {
            alert("Server is unable to process request at this time");
        }
    });
    return false;
}

function takedownPrj(id) {
    $.get(dwnUrl + id, (data) => {
        if (data == "changed") {
            $.get(prjUrl, (data) => {
                allProjects = data;
                $("#div2").empty();
                live();
            })
        } else {
            alert("Server is unable to process request at this time");
        }
    });
    return false;
}

// STATS --------------------------
function renderRight() {
    $.get(serAdm, (data) => {

        let size = data.substring(0, 4);
        console.log(allProjects);

        let prjNum = allProjects.length;
        console.log(prjNum);

        let statHtml = "" +
            "<div class='panel panel-primary'>" +
            "  <div class='panel-body'>" + size +
            "    <span class='glyphicon glyphicon-hdd' id='storage'></span>" +
            "  </div>" +
            "</div>" +
            "<div class='panel panel-primary'>" +
            "  <div class='panel-body'>Projects: " + prjNum +
            "  </div>" +
            "</div>";

        $("#div3").html(statHtml);
    });
}

// HELPERS -----------------------
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


