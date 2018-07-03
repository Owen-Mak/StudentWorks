$(document).ready(() => {
    let id = getQueryStr('id');

    // LOCAL
    //let url = "http://localhost:3000/api/getOneProject/id/"+id;

    // PRODUCTION
    let url = "http://myvmlab.senecacollege.ca:6193/api/getOneProject/id/"+id;

    $.getJSON(url, (jsData) => {
        let year = jsData[0].creationDate ? jsData[0].creationDate.substring(0, 4) : "";
        let videoLink = "../" + jsData[0].VideoUrl;

        let contributors = "<br><h4><u>Developers:</u></h4>";
        $.each(jsData[0].users, (key, value) => {
            contributors += " <p>" + value.firstName + " " + value.lastName + "</p>";
        });

        let languageShow = (jsData[0].language) ? "<p><b>Language: </b>" + jsData[0].language + "</p>" : "";
        let frameworkShow = (jsData[0].framework) ? "<p><b>Framework: </b> " + jsData[0].framework + "</p>" : "";
        let category = (jsData[0].category) ? "<p><b>Category: </b> " + jsData[0].category + "</p>" : "";
        let desc = (jsData[0].description) ? "<p>" + jsData[0].description + "</p>" : "";

        // Title
        let title = jsData[0].title + " (" + year + ")";

        // Video and Info
        let prjHtml = "";
        prjHtml += "<div class='container'>";
        prjHtml += "   <div class='row'>";
        prjHtml += "      <div class='col-md-8' id='videoCol' >";
        prjHtml += "            <video id='videoID' height='400' controls > <source src='" + videoLink + "' type='video/mp4'></video>";
        prjHtml += "      </div>";
        prjHtml += "      <div class='col-md-4' id='infoCol'";
        prjHtml += contributors;
        prjHtml += "         <br><br><h4 class='prjTitle'><u>Project info:</u></h4>" + languageShow + frameworkShow + category;
        prjHtml += "      </div>";
        prjHtml += "   </div>";
        prjHtml += "   <div class='row'>";
        prjHtml += "      <br><br><h3>Description</h3>" + desc;
        prjHtml += "   </div>";
        prjHtml += "</div>";

        renderUserMenu();
        $("#pageTitleID").html(title);
        $("#projectBody").html(prjHtml);
        $("#tileNav").empty();

    })
});

function getQueryStr(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
