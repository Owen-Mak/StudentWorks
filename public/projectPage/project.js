
$(document).ready(() => {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    id = getQueryStr('id');
    httpRequest.onreadystatechange = renderProject;
    httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getOneProject?id="+id, true);
    //httpRequest.open('GET', "http://localhost:3000/api/getOneProject?id=" + id, true);
    httpRequest.send();
});


// This function shows the PROJECT page
function renderProject() {
    if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);

            if (jsData[0].title != "empty") {
                let year = jsData[0].creationDate ? jsData[0].creationDate.substring(0, 4) : "";
                let videoLink = "../" + jsData[0].VideoUrl;
                
                let contributors = "<br><h4><u>Contributors:</u></h4>";
                $.each(jsData[0].users, (key, value) => {
                    contributors += " <p>" + value.firstName + " " + value.lastName + "</p>";
                });

                let languageShow = (jsData[0].language) ? "<p><b>Language: </b>" + jsData[0].language + "</p>" : "";
                let frameworkShow = (jsData[0].framework) ? "<p><b>Framework: </b> " + jsData[0].framework + "</p>" : "";
                let category = (jsData[0].category) ? "<p><b>Category: </b> " + jsData[0].category + "</p>" : "";
                let desc = (jsData[0].description) ? "<p>" + jsData[0].description + "</p>" : "";

                // Title
                let prjHtml = "<h2 style='text-align: center;'>" + jsData[0].title + " (" + year + ") </h2><br>";

                // Video and Info
                prjHtml += "<div class='container'>";
                prjHtml += "   <div class='row'>";
                prjHtml += "      <div class='col-md-8' id='videoCol' style='border:solid;' >";
                prjHtml += "            <video id='videoID' height='400' controls > <source src='" + videoLink + "' type='video/mp4'></video>";
                prjHtml += "      </div>";
                prjHtml += "      <div class='col-md-4' id='infoCol'";
                prjHtml +=           contributors;
                prjHtml += "         <br><br><h4 class='prjTitle'><u>Project info:</u></h4>" + languageShow + frameworkShow + category;
                prjHtml += "      </div>";
                prjHtml += "   </div>";
                prjHtml += "   <div class='row'>";
                prjHtml += "      <br><br><h3>Description</h3>" + desc;
                prjHtml += "   </div>";
                prjHtml += "</div>";

                $("#projectBody").html(prjHtml);
                $("#tileNav").empty();
            }
        }
    }
}

function getQueryStr(name, url){
    if( !url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
