// Seneca StudentWorks 2018
// Author: Yuriy Kartuzov

// Globals used JSON API requests and tracking pages (safe)
var httpRequest;
var start;
var pageNum;
var lastPage;

// This function get called when main.js and main.html are loaded
$(document).ready(() => {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    httpRequest.onreadystatechange = renderFirstPage;
    //httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    httpRequest.open('GET', "http://localhost:3000/api/getAllProjects", true);

    httpRequest.send();
});

function renderFirstPage() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {

            var jsData = JSON.parse(httpRequest.responseText);
            lastPage = false;
            pageNum = 1;

            // 1. NAVIGATION
            // List
            renderNavigation(jsData);

            // 2. TILE navigation (has to be rendered before tiles, but appears after tiles ) TODO refactor
            renderTileNavigation();

            // 3. six BODY Tiles
            start = 0;
            renderSixProjectTiles(jsData);

            // 4. BUTTONS event handlers
            //NEXT
            $("#prevBtn").click(() => {
                $("#mainBody").empty();
                start -= 12;
                if (start < 0)
                    start = 0;

                renderSixProjectTiles(jsData);
            });

            // PREV
            $("#nextBtn").click(() => {
                if (!lastPage) {
                    $("#mainBody").empty();
                    renderSixProjectTiles(jsData);
                }
            });
        }
    }
}

function renderNavigation(data) {
    let languageList = "";
    let frameworkList = "";
    let yearList = "";

    let languageArr = [];
    let frameworkArr = [];
    let yearArr = [];

    // Building HTLM for Filtering lists: Framework, Language, Year
    $.each(data, (key, value) => {
        if (value.language) {
            if (!languageArr.includes(value.language)) {
                languageArr.push(value.language);
                languageList += "<li> <a href='#' onclick='prepareFilter(\"language\" ,\"" + value.language + "\")'>";
                languageList += value.language + "</a></li>";
            }
        }

        if (value.framework) {
            if (!frameworkArr.includes(value.framework)) {
                frameworkArr.push(value.framework);
                frameworkList += "<li> <a href='#' onclick='prepareFilter(\"framework\" ,\"" + value.framework + "\")'>";
                frameworkList += value.framework + "</a></li>";
            }
        }

        if (value.creationDate) {
            var year = value.creationDate.substring(0, 4);
            if (!yearArr.includes(year)) {
                yearArr.push(year);
                yearList += "<li> <a href='#' onclick='prepareFilter(\"year\" ,\"" + year + "\")'>";
                yearList += year + "</a></li>";
            }
        }
    });

    $("#lngList").append(languageList);
    $("#frmList").append(frameworkList);
    $("#yearList").append(yearList);
}

function renderSixProjectTiles(jsData) {

    // Main loop for six projects
    for (var projects = 0; projects < 6; projects++) {

        if (start <= (jsData.length - 1)) { // if curent project

            var title = jsData[start].title;
            var year = jsData[start].creationDate ? jsData[start].creationDate.substring(0, 4) : "";
            var image = jsData[start].ImageFilePath;
            var language = jsData[start].language;
            var framework = jsData[start].framework;
            var id = jsData[start].projectID;

            var prjHtml = renderTile(title, year, image, language, framework, id);
            $("#mainBody").append(prjHtml);

            start++;
            lastPage = false;
        }
        else { // Render Empty tile
            var prjHtml = renderEmptyTile();
            $("#mainBody").append(prjHtml);

            lastPage = true;
            start++;
        }
    }

    let numOfProjects = jsData.length;
    let currPage = start / 6;
    let totalPage = Math.floor(numOfProjects / 6) + 1;
    $("#pageId").html("<span>" + currPage + " &nbsp; &#47; &nbsp; " + totalPage + "</span>");

}

function renderTile(title, year, icon, language, framework, id) {
    let imageShow = '<img src="' + icon + '" class="img-responsive center-block swPrjImage" alt="icon" >';
    let titleShow = title + " (<strong>" + year + "</strong>) ";
    let languageShow = (language) ? "<b>Language: </b>" + language : "";
    let frameworkShow = (framework) ? ", <b>Framework: </b> " + framework : "&nbsp;";
    let footer = languageShow + frameworkShow;

    let tileHtml = "";
    tileHtml += "<div class='col-md-4'>";
    tileHtml += "<div class='panel panel-default swTile'>";
    tileHtml += "   <div class='panel-heading' style='text-align: center;'><h4>" + titleShow + "</h4></div>";
    tileHtml += "       <a href='projectPage/project.html?id=" + id + "' class ='tileLink'>";
    tileHtml += "          <div class='panel-body' style='height:250px; '>" + imageShow + "</div>";
    tileHtml += "       </a>";
    tileHtml += "   <div class='panel-footer' style='text-align: right;'> " + footer + "</div>";
    tileHtml += "</div>";

    return tileHtml;
}

function renderEmptyTile() {
    let image = '<img src="images/empty.png" class="img-responsive center-block swPrjImage" alt="icon" >';
    let footer = "<div style='text-align: center;'><a href='#' >Contribute</a></div>";

    let emptyTileHtml = "";
    emptyTileHtml += "<div class='col-md-4'>";
    emptyTileHtml += "<div class='panel panel-default swTile swEmptyTile'>";
    emptyTileHtml += "   <div class='panel-heading' style='text-align: center;'><h4>Future Proejct</h4></div>";
    emptyTileHtml += "       <a href='../contribute/contribute.html' class ='tileLinkEmpty'>";
    emptyTileHtml += "          <div class='panel-body' style='height:250px; '>" + image + "</div>";
    emptyTileHtml += "       </a>";
    emptyTileHtml += "   <div class='panel-footer' style='text-align: right;'> " + footer + "</div>";
    emptyTileHtml += "</div>";

    return emptyTileHtml;
}

function renderTileNavigation() {
    let tileNav = "";
    tileNav += '<div class="row center">';
    tileNav += '<div style="display: inline;"><button type="button" class="btn btn-default" id="prevBtn" aria-label="Left Align">'; // PREVIOUS Button
    tileNav += '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button></div>';
    tileNav += '<div id="pageId"  style="display: inline; class="center"></div>';
    tileNav += '<div  style="display: inline;"><button type="button" class="btn btn-default" id="nextBtn" aria-label="Right Align">'; // NEXT Button
    tileNav += '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button><div>';
    tileNav += '</div>'

    $("#tileNav").append(tileNav);
}

// FILTERING - 2 functions
function prepareFilter(key, value) {
    $("#mainBody").empty();
    $("#tileNav").empty();

    let httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    httpRequest.onreadystatechange = renderFilter(key, value);
    //httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    httpRequest.open('GET', "http://localhost:3000/api/getAllProjects", true);
    httpRequest.send();
}

// Render Filtering
function renderFilter(sKey, sValue) {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {

            let jsData = JSON.parse(httpRequest.responseText);
            let newData = [];

            if (sKey == "language") {
                //$("#langNavID").attr({"class" : "active" });
                $.each(jsData, (key, value) => {
                    if (value.language == sValue) newData.push(value);
                });
            }
            else if (sKey == "framework") {
                //$("#frmNavID").attr({"class" : "active" });
                $.each(jsData, (key, value) => {
                    if (value.framework == sValue) newData.push(value);
                });
            }
            else if (sKey == "year") {
                //$("#yrNavID").attr({"class" : "active" });
                $.each(jsData, (key, value) => {

                    if (value.creationDate) {
                        console.log(value.creationDate);
                        var year = value.creationDate.substring(0, 4);
                        if (year == sValue) newData.push(value);
                    }
                });
            }

            start = 0;
            renderTileNavigation();
            renderSixProjectTiles(newData);

            $("#prevBtn").click(() => {
                $("#mainBody").empty();
                start -= 12;
                if (start < 0)
                    start = 0;

                renderSixProjectTiles(newData);
            });

            $("#nextBtn").click(() => {
                if (!lastPage) {
                    $("#mainBody").empty();
                    renderSixProjectTiles(newData);
                }
            });
        }
    }
}
