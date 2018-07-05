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
        renderRight();
        live();
    });

    $.getJSON(userUrl, (data) => {
        allUsers = data;
    });


});

// MENU ---------------------------
function renderLeft() {
    let linksHtml = "" +
        "<div class='btn-group'>" +
        "  <a class='btn text-right'id='aprPrj'>Live Projects</a><br/>" +
        "  <a class='btn text-right'id='penPrj'>Pending Approval</a><br/>" +
        "  <a class='btn text-right'id='allUsr'>Contributors</a><br/>" +
        "  <a class='btn text-right'id='netw'>Traffic</a><br/>" +
        "  <a class='btn text-right'id='logs'>Logs</a><br/>" +
        "</div>";

    $("#div1").html(linksHtml);

    // Event handlers   
    $("#aprPrj").click(() => {
        $("#div2").empty();
        live();
        setactiveLink("#aprPrj");
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

    $("#logs").click(() => {
        $("#div2").empty();
        logs();
    });
}

function setactiveLink(tag) {
    var tags = ["#aprPrj", "#penPrj", "allUsr", "netw", "logs"];

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
    let tableHtml = "<div id='penPrjTitle'>List of projects waiting for approval</div>" +
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

function logs() {

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

        let size = data.match(/[0-9]{1,}/g);
        let git = data.split('\n')[1];
        let prjNum = allProjects.length;
        let usrNum = allUsers.length;

        let statHtml = "" +
            "<div class='panel panel-primary'>" + // Storage space Pane
            "  <div class='panel-body'>" + size + " MB" +
            "    <span class='glyphicon glyphicon-hdd' id='storage'></span>" +
            "  </div>" +
            "</div>" +
            "<div class='panel panel-primary'>" + // Projects and User pages
            "  <div class='panel-body'>" +
            "     <div style='float:left;'><span  class='glyphicon glyphicon-folder-open'></span>" + " " + prjNum + "</div>" +
            "     <div style='float:right;'><span  class='glyphicon glyphicon-user'></span>" + " " + usrNum + "</div>" +
            "  </div>" +
            "</div>" +
            "<div class='panel panel-primary'>" + // Git branch
            "  <div class='panel-body' id='gitBody'>" +
            "     <div style='float:left;'><img id='gitIm' src='/images/git.png' /></div>" +
            "     <div style='float: right; width:55%;'>" + git + "</div>" +
            "  </div>" +
            "</div>" +
            "<canvas id='myChart' width='400' height='400'></canvas>";

        $("#div3").html(statHtml);

        // Adding a chart - TO debug
        /*var ctx = document.getElementById('myChart').getContext('2d');
        var myBarChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: languages,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        }); */
        
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

function languages() {
    langArr = [];
    $.each(allProjects, (key, value) => {
        if (value.language) {
            if (!langArr.includes(value.language)) {
                langArr.push(value.language);
            }
        }
    });
    return langArr;
}