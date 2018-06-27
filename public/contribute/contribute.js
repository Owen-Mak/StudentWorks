let language = "";
let framework = "";
let platform = "";

$(document).ready(() => {
    let userID = $("#userID").text();

    renderUserMenu();

    $("#pageTitleID").html("Project Upload");

    renderEmptyTile();

    $("#titleInput").change(() => {
        let val = $("#titleInput").val();
        $(".panel-heading").html("<h4>" + val + "</h4>");
    });

    // LANGUAGE CHANGE
    $("#lngList").change(() => {
        let val = $("#lngList option:selected").val();
        language = (val != "default") ? val : "";
        $("#lngInput").val("");
        renderFooter();
    });

    $("#lngInput").change(() => {
        let val = $("#lngInput").val();
        language = val;
        $("#lngList").val("default");
        renderFooter();

    });

    // FRAMEWORK CHANGE
    $("#frmList").change(() => {
        let val = $("#frmList option:selected").val();
        framework = (val == "default") ? "" : val;
        $("#frmInput").val("");
        renderFooter();
    });

    $("#frmInput").change(() => {
        let val = $("#frmInput").val();
        framework = val;
        $("#frmList").val("default");
        renderFooter();
    });


    // PLATFORM CHANGE
    $("#pltList").change(() => {
        let val = $("#pltList option:selected").val();
        platform = (val != "default") ? val : "";
        $("#pltInput").val("");
        renderFooter();
    });

    $("#pltInput").change(() => {
        let val = $("#pltInput").val();
        platform = val;
        $("#pltList").val("default");
        renderFooter();
    });

    // CATEGORY CHANGE
    $("#ctgList").change(() => {
        $("#ctgInput").val("");
    });

    $("#ctgInput").change(() => {
        $("#ctgList").val("default");
    });

    $("#photo").change(function () {
        displayImage(this);
    });

});

function renderEmptyTile() {
    let tileHtml = "" +
        "<div class='col-md-8'>" +
        "  <div class='panel panel-default swTile'>" +
        "    <div class='panel-heading' style='text-align: center;'></div>" +
        "    <div class='panel-body'>" +
        "      <img src='/images/empty.png' id='img' class='img-responsive center-block swPrjImage' alt='icon'>" +
        "    </div>" +
        "  <div class='panel-footer' style='text-align: right;'></div>" +
        "</div>";

    $("#mainBody").html(tileHtml);
}

function renderFooter() {
    let footerHtml = "";

    if (language != "")
        footerHtml += "<b>Language: </b>" + language;

    if (framework != "")
        footerHtml += footerHtml ? ", <b>Framework: </b>" + framework : "<b>Framework: </b>";

    if (platform != "")
        footerHtml += footerHtml ? ", <b>Platform: </b>" + platform : "<b>Platform: </b>";

    $(".panel-footer").html(footerHtml);
}

function displayImage(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#img').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

