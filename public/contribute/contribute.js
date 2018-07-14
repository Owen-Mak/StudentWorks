let gl_language = "";
let gl_framework = "";
let gl_platform = "";
let gl_category = "";

$(document).ready(() => {
    // Adding userID to the hidden field
    let userID = $("#userID").text();
    $("#userIDhtml").val(userID);

    // User Menu - defined in usermenu.js
    renderUserMenu();

    // Set the page title
    $("#pageTitleID").html("Project Upload");

    renderEmptyTile();

    $("#titleInput").change(() => {
        let val = $("#titleInput").val();
        $(".panel-heading").html("<h4>" + val + "</h4>");
    });

    // LANGUAGE CHANGE
    $("#lngList").change(() => {
        let val = $("#lngList option:selected").val();
        gl_language = (val != "default") ? val : "";
        $("#lngInput").val("");
        renderFooter();
    });

    $("#lngInput").change(() => {
        gl_language = $("#lngInput").val();
        $("#lngList").val("default");
        renderFooter();

    });

    // FRAMEWORK CHANGE
    $("#frmList").change(() => {
        let val = $("#frmList option:selected").val();
        gl_framework = (val == "default") ? "" : val;
        $("#frmInput").val("");
        renderFooter();
    });

    $("#frmInput").change(() => {
        gl_framework = $("#frmInput").val();
        $("#frmList").val("default");
        renderFooter();
    });

    // PLATFORM CHANGE
    $("#pltList").change(() => {
        let val = $("#pltList option:selected").val();
        gl_platform = (val != "default") ? val : "";
        $("#pltInput").val("");
        renderFooter();
    });

    $("#pltInput").change(() => {
        gl_platform = $("#pltInput").val();
        $("#pltList").val("default");
        renderFooter();
    });

    // CATEGORY CHANGE
    $("#ctgList").change(() => {
        let val = $("#ctgList option:selected").val(); 
        gl_category = (val != "default") ? val : "";
        $("#ctgInput").val("");
    });

    $("#ctgInput").change(() => {
        gl_category = (this).val();
        $("#ctgList").val("default");
    });

    // DISPLAY image
    $("#photo").change(function () {
        displayImage(this); // add validation to make sure what's passed in is a picture
        //displayColors();
    });

    // DISPLAY video
    $("#video").change(function () {
        displayVideo(this); // add validation to make sure what's passed in is video
    });

    // FORM SUBMISSION LOGIC
    //$("#uform").on("submit", submitProject);

});
window.addEventListener("load", function () {
    function submitProject() {
        var XHR = new XMLHttpRequest();
        //Validation
        
        if (gl_language == "") {
            $("#lngList").focus();
            return;
        } else if (gl_framework == "") {
            $("#frmList").focus();
            return;
        } else if (gl_platform == "") {
            $("#pltList").focus();
            return;
        }

        // Developer processing
        var developers = [];
        var devs = $("#devs").val().split(",");
        var roles = $("#roles").val().split(",");
        if(devs.length != roles.length){
            $("#devs").focus();
            return;
        }
        for(var i = 0; i<devs.length; i++){
            developers.push(devs[i]+':'+roles[i]);
        }
        
        // Image processing
        var date = new Date().getTime();
        //var media = [];
        //media.push (document.getElementById("photo").files[0]);
        //media.push (document.getElementById("video").files[0]);
        var image = document.getElementById("photo").files[0];

        // Video processing
        var video = document.getElementById("video").files[0];
    
        // Creating a processed form
        var formData = new FormData();
        formData.append("userID", $("#userID").val());
        formData.append("title", $("#titleInput").val());
        formData.append("language", gl_language);
        formData.append("framework", gl_framework);
        formData.append("platform", gl_platform);
        formData.append("category", gl_category);
        formData.append("desc", $("#desc").val());
        formData.append("developers", developers);

        formData.append("image", image);
        formData.append("video", video);

        // listening for server response to the POST request
        XHR.addEventListener("load", function(event) {        
            if (event.target.responseText == "success"){
                alert ("Your project is uploaded successfully! Thank you.");
                window.location.replace("/profile");
            } else if (event.target.responseText === "validation error"){
                alert ("Missing field");
            }
        });

        // Sending a form
        XHR.open("POST", "/upload-project");
        XHR.send(formData);
    }
    document.getElementById("uForm").addEventListener("submit", function (event) {
        event.preventDefault();
        submitProject();  
    });
});

function renderEmptyTile() {
    let tileHtml = "" +
        "<div class='panel panel-default swTile'>" +
        "  <div class='panel-heading' style='text-align: center;'></div>" +
        "  <div class='panel-body'>" +
        "    <img src='/images/empty.png' id='img' class='img-responsive center-block swPrjImage' alt='icon'/>" +
        "  </div>" +
        "  <div class='panel-footer' style='text-align: right;'></div>" +
        "</div>" +
        "<div id='colChoice'></div>" +
        "<div><video id='vd'controls hidden='hidden'><source src='' type='video/mp4'></video>" +
        "</div>";

    $("#mainBody").html(tileHtml);
}

// Render Tile footer: Language, gl_framework, Platform
// TODO to make a dynamic list from DB
function renderFooter() {
    let footerHtml = "";

    if (gl_language != "") {
        footerHtml += "<b>Language: </b>" + gl_language;
    }

    if (gl_framework != "") {
        footerHtml += (footerHtml != "") ? ", " : "";
        footerHtml += "<b>Framework: </b>" + gl_framework;
    }
    if (gl_platform != "") {
        footerHtml += (footerHtml != "") ? ", " : "";
        footerHtml += "<b>Platform: </b>" + gl_platform;
    }

    $(".panel-footer").html(footerHtml);
}

// Display image preview before uploaded
function displayImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// Display video preview before uploaded
function displayVideo(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#vd').removeAttr('hidden');
            $('#vd').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

// TODO - to finish
function displayColors() {
    console.log("i'm here");
}
