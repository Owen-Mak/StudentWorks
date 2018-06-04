var httpRequest;

// READY function that gets called when HTML finishes parsing
// console.log are used for deguggin and can be seen from BROWSER console not server.
$(document).ready(() => {
    console.log("main.js Page loaded");


    // Old format
    httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    httpRequest.onreadystatechange = showContents;
    httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    //httpRequest.open('GET', "http://localhost:3000/api/getAllProjects", true);

    httpRequest.send();

    console.log("end of main.js");
});


function showContents() {
    if (httpRequest.readyState === 4) {
        console.log("Ready state is: 4, status is: " + httpRequest.status);
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

                html += renderTile(title, year, image, language, framework);

                $("#mainBody").append(html);
            });
            //------------------------------
        }
    }

    function renderTile(title, year, icon, language, framework) {
        var imageShow = '<img src="' + icon + '" class="img-responsive center-block" alt="icon" >';
        var titleShow = (title == "empty") ? "Future Project" : title + " [ <b>" + year + "</b> ] ";
        var footer;

        if (language || framework) {
            var languageShow = (language) ? "<b>Language: </b>" + language : "";
            var frameworkShow = (framework) ? ", <b>Framework: </b> " + framework : "&nbsp;";
            footer = languageShow + frameworkShow;
        } else {
            footer = "<div style='text-align: center;'><a href='#' >Contribute</a></div>";
        }


        html = "";
        html += "<div class='col-md-4'>";
        html += "<div class='panel panel-default' style='width:360px;' >";
        html += "   <div class='panel-heading' style='text-align: center;'><h4>" + titleShow + "</h4></div>";
        html += "   <div class='panel-body' style='height:270px; '>" + imageShow + "</div>";
        html += "   <div class='panel-footer' style='text-align: right;'> " + footer + "</div>";
        html += "</div>";

        return html;
    }

    function renderTileEmpty() {

    }
}
