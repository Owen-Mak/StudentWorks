
/**** basic validation for input fields: Name, Last Name, and Email ****/

document.getElementById("profile").onsubmit = function () {
  var firstname = document.forms["profile"]["fname"].value;
  var lastname = document.forms["profile"]["lname"].value;
  var email = document.forms["profile"]["email"].value;

  var submit = true;
  var pattern = /^[a-zA-Z\s-]+$/;
  var emailPattern = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;


  /** First Name **/

  if (firstname == null || firstname == "") {
    nameError = "- This field is required";
    document.getElementById("fname_error").innerHTML = nameError;
    submit = false;
  }
  else if (!firstname.match(pattern)) {
    nameError = "- Only characters allowed";
    document.getElementById("fname_error").innerHTML = nameError;
    submit = false;
  }

  /** Last Name **/

  if (lastname == null || lastname == "") {
    lastnameError = "- This field is required";
    document.getElementById("lname_error").innerHTML = lastnameError;
    submit = false;
  }
  else if (!lastname.match(pattern)) {
    lastnameError = "- Only characters allowed";
    document.getElementById("lname_error").innerHTML = lastnameError;
    submit = false;
  }

    /** Email **/

  if (email == null || email == "") {
    emailError = "- Please enter your email";
    document.getElementById("email_error").innerHTML = emailError;
    submit = false;
  }

  else if (!email.match(emailPattern)) {
    emailError = "- Please enter a valid email";
    document.getElementById("email_error").innerHTML = emailError;
    submit = false;
  }

  /* To remove warning after user inputs correct info */

  function removeFNWarning() {
    document.querySelector("#fname_error").innerHTML = "";
  }

  function removeLNWarning() {
    document.querySelector("#lname_error").innerHTML = "";
  }

  function removeEmailWarning() {
    document.querySelector("#email_error").innerHTML = "";
  }
  document.getElementById("fname").onkeyup = removeFNWarning;
  document.getElementById("lname").onkeyup = removeLNWarning;
  document.getElementById("email").onkeyup = removeEmailWarning;
  return submit
}





/**************************************************** */


$(document).ready(() => {
  if ($("#userType").text() === "Visitor"){
    renderUserMenu(); // so they can log in
    return;
  } 

  let id = $("#userID").text();

  // LOCAL
  let prjUrl = "http://localhost:3000/api/getProjectsByUser/UserID/" + id;
  let usrUrl = "http://localhost:3000/api/getUserByID?id=" + id;

  // PRODUCTION
  //let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getProjectsByUser/UserID/" + id;
  //let usrUrl = "http://myvmlab.senecacollege.ca:6193/api/getUserByID?id=" + id;

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

