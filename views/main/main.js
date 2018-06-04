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
                if (!unqArr.includes(value.language)) {
                    unqArr[count++] = value.language;
                    html += "<li href='#'>" + value.language + "</li>";
                }
            });
            $("#lngList").append(html);

            // Framework LIST ......................
            html= "";
            cout = 0;
            unqArr = []
            $.each(jsData, (key, value) => {
                if (!unqArr.includes(value.framework)) {
                    unqArr[count++] = value.framework;
                    html += "<li href='#'>" + value.framework + "</li>";
                }
            });
            $("#frmList").append(html);

            // Year LIST ......................
            html= "";
            cout = 0;
            unqArr = []
            $.each(jsData, (key, value) => {
                var year = value.creationDate.substring(0, 4);
                if (!unqArr.includes(year)) {
                    unqArr[count++] = year;
                    html += "<li href='#'>" + year + "</li>";
                }
            });
            $("#yearList").append(html);


            // BODY TILES ------------------------
            var projectCount = Object.keys(jsData).length; // Assuming 6 or less at the moment
            var count = 1;
            $.each(jsData, (key, value) =>{
                var title = value.title;
                var image = value.ImageFilePath; 

                var year = value.creationDate.substring(0, 4);
                var framework = value.framework;
                var language = value.language;
                var html = "";

                var finalIm = '<img src="' + image + '"';
                finalIm += ' class="img-responsive center-block" alt="icon" >';
                console.log(finalIm);

                html += "<div class='col-md-4'>";
                html += "<div class='panel panel-default' style='width:360px;' >";
                html += "   <div class='panel-heading'><h4>" + title + " ( " +year +" )</h4></div>";
                html += "   <div class='panel-body' style='height:270px; '>" + finalIm + "</div>";
                html += "   <div class='panel-footer'> <b>Language: </b>" + language
                 + ", <b>Framework: </b> " + framework + "</div>"
                html += "</div>";

                count++;
                $("#mainBody").append(html);
            });
            //------------------------------
        }
    }
}
