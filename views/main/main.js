var httpRequest;

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

            var unqArr = [];
            var html = "";
            var count = 0;

            // Language LIST ........................
            $.each(jsData, (key, value) => {
                if (value.language) {
                    if (!unqArr.includes(value.language)) {
                        unqArr[count++] = value.language;
                        html += "<li href='#'>" + value.language + "</li>";
                    }
                }
            });
            $("#lngList").append(html);

            // Framework LIST ......................
            html = "";
            cout = 0;
            unqArr = []
            $.each(jsData, (key, value) => {
                if (value.framework) { // checks for null
                    if (!unqArr.includes(value.framework)) {
                        unqArr[count++] = value.framework;
                        html += "<li href='#'>" + value.framework + "</li>";
                    }
                }
            });
            $("#frmList").append(html);

            // Year LIST ......................
            html = "";
            cout = 0;
            unqArr = []
            $.each(jsData, (key, value) => {
                if (value.creationDate) {
                    var year = value.creationDate.substring(0, 4);
                    if (!unqArr.includes(year)) {
                        unqArr[count++] = year;
                        html += "<li href='#'>" + year + "</li>";
                    }
                }
            });
            $("#yearList").append(html);


            // BODY TILES ------------------------
            var projectCount = Object.keys(jsData).length; // Assuming 6 or less at the moment
            var count = 1;
            $.each(jsData, (key, value) => {
                var html = "";
                var title = value.title;
                var year = value.creationDate ? value.creationDate.substring(0, 4) : "";
                var image = value.ImageFilePath;
                var language = value.language;
                var framework = value.framework;
                var id = value.projectID;

                html += renderTile(title, year, image, language, framework, id);

                //$("#mainBody").append(html);
            });

            var start = 0;
            renderSixProjectTiles(jsData, start);
            start +=6;
        }
    }
}

function renderSixProjectTiles(jsData, start){
    // RENDER only 6 projects
    for(var projects=0; projects<6; projects++){
        var html ="";
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

    return html;
}

////////
// This function creates one Tile at the time on the MAIN page 
function renderTile(title, year, icon, language, framework, id) {
    var imageShow = '<img src="' + icon + '" class="img-responsive center-block;" style="height: 220px; margin:auto;" alt="icon" >';
    var titleShow = (title == "empty") ? "Future Project" : title + " [ <strong>" + year + "</strong> ] ";
    var footer;
    var link;

    if (language || framework) {
        var languageShow = (language) ? "<b>Language: </b>" + language : "";
        var frameworkShow = (framework) ? ", <b>Framework: </b> " + framework : "&nbsp;";
        footer = languageShow + frameworkShow;
    } else {
        footer = "<div style='text-align: center;'><a href='#' >Contribute</a></div>";
    }

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

/////
// This functions is an event handler to start PROJECT page
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

///////
// This function shows the PROJECT page
function showProject() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);

            if (jsData[0].title != "empty") {
                var year = jsData[0].creationDate ? jsData[0].creationDate.substring(0, 4) : "";
                var videoLink = jsData[0].VideoUrl;
                var languageShow = (jsData[0].language) ? "<p><b>Language: </b>" + jsData[0].language + "</p>" : "";
                var frameworkShow = (jsData[0].framework) ? "<p><b>Framework: </b> " + jsData[0].framework + "</p>": "";
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
                console.log("Link id: " + videoLink);
                console.log(jsData);
            }
        }
    }
}

