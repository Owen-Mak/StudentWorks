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
    //httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    httpRequest.open('GET', "http://localhost:3000/api/getAllProjects", true);

    httpRequest.send();

    console.log("end of main.js");
});


function showContents() {
    if (httpRequest.readyState === 4) {
        console.log("Ready state is: 4, status is: " + httpRequest.status);
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);
            //console.log(jsData);
            // BUILD index.html

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


            // BODY ------------------------
            var projectCount = Object.keys(jsData).length; // Assuming 6 or less at the moment
            var count = 1;
            $.each(jsData, (key, value) =>{
                var title = value.title;
                var image = value.ImageFilePath; 
                console.log(image);
                var year = value.creationDate.substring(0, 4);
                var framework = value.framework;
                var language = value.language;
                var html = "";

                html += "<div class='col-md-4'>";
                html += "<div class='panel panel-default'>";
                html += "<div class='panel-heading'>";
                html += "<h4 class='text-centre'>" + title + "</h4></div>";
                html += "<div class='panel-body text-center'>";
                html += "<p class='lead'> <strong> <img src='" + image + "' alt='icon'> </strong> </p> </div>";
                html += "<ul class='list-group list-group-flush text-center'>";
                html += "<li class='list-group-item'> <i class='icon-ok text-danger'></i>" + language + "</li>";
                html += "<li class='list-group-item'> <i class='icon-ok text-danger'></i>" + framework + "</li>";
                html += "<li class='list-group-item'> <i class='icon-ok text-danger'></i>" + year + "</li>";
                html += "</ul></div>";

                count++;

                $("#mainBody").append(html);

            });
            //------------------------------
        }
    }
}
