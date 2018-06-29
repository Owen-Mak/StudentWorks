$(document).ready(() => {
  if ($("#userType").text() === "Visitor"){
    renderUserMenu(); // so they can log in
    return;
  } 

  let id = $("#userID").text();

  // LOCAL
  //let prjUrl = "http://localhost:3000/api/getProjectsByUser/UserID/" + id;
  //let usrUrl = "http://localhost:3000/api/getUserByID?id=" + id;

  // PRODUCTION
  let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getProjectsByUser/UserID/" + id;
  let usrUrl = "http://myvmlab.senecacollege.ca:6193/api/getUserByID?id=" + id;

  $.getJSON(prjUrl, (jsData) => { renderProjectList(jsData); });
  $.getJSON(usrUrl, (jsData) => { renderUserDetails(jsData); });
});


function renderProjectList(jsData) {
  let projectList = "";
  let projectStatusList = "";
  let projectYearList = "";

  $.each(jsData, (key, value) => {
    projectList += "<li>" + value.title + "</li>";
    projectStatusList += "<li>" + value.status + "</li>";
    projectYearList += "<li>" + value.creationDate.substring(0, 4) + "</li>";
  });

  renderUserMenu(); // function declared in usermenue.js
  $("#pageTitleID").html("Your Profile");
  $("#projectName").html(projectList);
  $("#projectStatus").html(projectStatusList);
  $("#projectYear").html(projectYearList);
}

function renderUserDetails(jsData) {
  let fName = jsData[0].firstName ? jsData[0].firstName : "First Name";
  let lName = jsData[0].lastName ? jsData[0].lastName : "Last Name";
  let email = jsData[0].email ? jsData[0].email : "sample@email.com";
  let program = jsData[0].program ? jsData[0].program : "Program of study";
  let username = jsData[0].username ? jsData[0].username : "Username";


  $("#fname").attr({ "placeholder": fName });
  $("#lname").attr({ "placeholder": lName });
  $("#email").attr({ "placeholder": email });
  $("#program").attr({ "placeholder": program });
  $("#username").attr({ "placeholder": username });
}


$(function () {
  $('#img-preview').click(function () {
    $('#img-input').trigger('click');
  });

  $("#img-input").change(function () {
    readImage(this);
  });

  var readImage = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var html = '<img src="' + e.target.result + '">'
        $('#img-preview').html(html);
      }

      reader.readAsDataURL(input.files[0]);
    }
  };
});

