// Globals 
var httpRequest;
var start;
var prjNum;
var lastPAge;
var remainder;

// READY function that gets called when HTML finishes parsing
// console.log are used for deguggin and can be seen from BROWSER console not server.
$(document).ready(() => {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    httpRequest.onreadystatechange = showContents;
    //httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    httpRequest.open('GET', "http://localhost:3000/api/getAllProjects", true);

    httpRequest.send();
});


function showContents() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);

            prjNum = jsData.length;
            lastPage = false;
            var html = "";
            let languageList = "";
            let frameworkList = "";
            let yearList = "";

            let languageArr = [];
            let frameworkArr = [];
            let yearArr = [];

            // Language LIST ........................
            $.each(jsData, (key, value) => {
                if (value.language) {
                    if (!languageArr.includes(value.language)) {
                        languageArr.push(value.language);
                        languageList += "<li href='#'>" + value.language + "</li>";
                    }
                }

                if (value.framework) {
                    if (!frameworkArr.includes(value.framework)) {
                        frameworkArr.push(value.framework);
                        frameworkList += "<li href='#'>" + value.framework + "</li>";
                    }
                }

                if (value.creationDate) {
                    var year = value.creationDate.substring(0, 4);
                    if (!yearArr.includes(year)) {
                        yearArr.push(year);
                        yearList += "<li href='#'>" + year + "</li>";
                    }
                }


            });

            $("#lngList").append(languageList);
            $("#frmList").append(frameworkList);
            //$("#yearList").append(yearList);


            // BODY TILES ------------------------
            start = 0;
            renderSixProjectTiles(jsData);

            // TILE NAViGATION --------------------
            html = "";
            html += '<button type="button" class="btn btn-default" id="prevBtn" aria-label="Left Align">'; // PREVIOUS Button
            html += '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></button>';

            html += '<button type="button" class="btn btn-default" id="nextBtn" aria-label="Right Align">'; // NEXT Button
            html += '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></button>';
            $("#tileNav").append(html);


            $("#prevBtn").click(() => {
                $("#mainBody").empty();
                start -= 12;
                if (start < 0)
                    start = 0;

                renderSixProjectTiles(jsData);
            });

            $("#nextBtn").click(() => {
                if (!lastPage) {
                    $("#mainBody").empty();
                    renderSixProjectTiles(jsData);
                }
            });

        } // status
    } // ready state
} // showContent function



// Renders 6 tiles per page
function renderSixProjectTiles(jsData) {

    // Main loop for six projects
    for (var projects = 0; projects < 6; projects++) {
        if (start > (jsData.length - 1)) {
            // render empty tile
            html = renderEmptyTile();
            $("#mainBody").append(html);
            lastPage = true;
            remainder++;
            start++;
        } else {//
            lastPage = false;
            var html = "";
            var title = jsData[start].title;
            var year = jsData[start].creationDate ? jsData[start].creationDate.substring(0, 4) : "";
            var image = jsData[start].ImageFilePath;
            var language = jsData[start].language;
            var framework = jsData[start].framework;
            var id = jsData[start].projectID;

            html += renderTile(title, year, image, language, framework, id);
            $("#mainBody").append(html);
            start++;
        }

    }

    return html;
}

// Renders single tile
function renderTile(title, year, icon, language, framework, id) {
    var imageShow = '<img src="' + icon + '" class="img-responsive center-block;" style="height: 220px; margin:auto;" alt="icon" >';
    var titleShow = title + " (<strong>" + year + "</strong>) ";
    var languageShow = (language) ? "<b>Language: </b>" + language : "";
    var frameworkShow = (framework) ? ", <b>Framework: </b> " + framework : "&nbsp;";
    var footer = languageShow + frameworkShow;

    html = "";
    html += "<div class='col-md-4'>";
    html += "<div class='panel panel-default' style='width:360px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' >";
    html += "   <div class='panel-heading' style='text-align: center;'><h4>" + titleShow + "</h4></div>";
    html += "       <a href='#' id='prjLink" + id + "' class ='tileLink' style='text-decoration: none;' onclick='readyProject(" + id + ")'>";
    html += "          <div class='panel-body' style='height:250px; '>" + imageShow + "</div>";
    html += "       </a>";
    html += "   <div class='panel-footer' style='text-align: right;'> " + footer + "</div>";
    html += "</div>";

    return html;
}

// Renders empty tile
function renderEmptyTile() {
    var imageShow = '<img src="images/empty.png" class="img-responsive center-block;" style="height: 220px; margin:auto;" alt="icon" >';
    var footer = "<div style='text-align: center;'><a href='#' >Contribute</a></div>";

    html = "";
    html += "<div class='col-md-4'>";
    html += "<div class='panel panel-default' style='width:360px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' >";
    html += "   <div class='panel-heading' style='text-align: center;'><h4>Future Proejct</h4></div>";
    html += "       <a href='#' class ='tileLinkEmpty' style='text-decoration: none;'>";
    html += "          <div class='panel-body' style='height:250px; '>" + imageShow + "</div>";
    html += "       </a>";
    html += "   <div class='panel-footer' style='text-align: right;'> " + footer + "</div>";
    html += "</div>";

    return html;
}




// Event handler to start rendering PROJECT page
function readyProject(id) {
    document.getElementById('prjLink' + id).onclick = () => {
        httpRequest = new XMLHttpRequest();
        if (!httpRequest)
            console.log("Cannot create an XMLHTTP instance");

        httpRequest.onreadystatechange = showProject;
        //httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getOneProject?id="+id, true);
        httpRequest.open('GET', "http://localhost:3000/api/getOneProject?id=" + id, true);
        httpRequest.send();
    };
}

// This function shows the PROJECT page
function showProject() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);

            if (jsData[0].title != "empty") {
                var year = jsData[0].creationDate ? jsData[0].creationDate.substring(0, 4) : "";
                var videoLink = jsData[0].VideoUrl;
                var languageShow = (jsData[0].language) ? "<p><b>Language: </b>" + jsData[0].language + "</p>" : "";
                var frameworkShow = (jsData[0].framework) ? "<p><b>Framework: </b> " + jsData[0].framework + "</p>" : "";
                var desc = (jsData[0].description) ? "<p>" + jsData[0].description + "</p>" : "";
                var html = "";

                // Title
                html += "<h2 style='text-align: center;'>" + jsData[0].title + " [ " + year + " ] </h2><br>";

                // Video and Info
                html += "<div class='container'>";
                html += "   <div class='row'>";
                html += "      <div class='col-md-8' id='videoCol'>";
                html += "         <div class='embed-responsive embed-responsive-16by9'>";
                html += "            <iframe class='embed-responsive-item' id='prjVideo' src='" + videoLink + "'></iframe>";
                html += "         </div>";
                html += "      </div>";
                html += "      <div class='col-md-4' id='infoCol'>";
                html += "         <br><h4> Contributors:</h4> <p>Vasia Jopovych</p><p>Vaselisa Pizdaivanovna</p><p>Johnny Waters</p>";
                html += "         <br><h4 id='prjTitle'> Project info:</h4>" + languageShow + frameworkShow;
                html += "      </div>";
                html += "   </div>";
                html += "   <div class='row'>";
                html += "      <h3>Description</h3>" + desc;
                html += "   </div>";
                html += "</div>";

                $("#mainBody").html(html);
                $("#tileNav").empty();
            }
        }
    }
}
