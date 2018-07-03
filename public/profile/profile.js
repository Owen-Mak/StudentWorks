var fNameCheck = true;
var lNameCheck = true;
var emailCheck = true; //for email


function validateForm() {

	if(validfName(fNameCheck) && validlName(lNameCheck) && validEmail(emailCheck)){
       return true;
   }else{
       return false;
   }
}


function validfName() {
  var pattern = /^[a-zA-Z\s-]+$/;
	var name = document.profile.fname.value.trim();

	if(name == "") {
		document.querySelector("#errorMsg1").innerHTML = '- This field is required';
		fNameCheck = false;

	}else if(!name.match(pattern)){
		document.querySelector("#errorMsg1").innerHTML = '- Cannot contain special characters';
    fNameCheck = false;

	}else{
		document.querySelector("#errorMsg1").innerHTML = "";
    fNameCheck = true;
	}
	return fNameCheck;
}

function validlName() {

  var pattern = /^[a-zA-Z\s-]+$/;
  var name = document.profile.lname.value.trim();

  if (name == "") {
    document.querySelector("#errorMsg2").innerHTML = '- This field is required';
    lNameCheck = false;

  } else if (!name.match(pattern)) {
    document.querySelector("#errorMsg2").innerHTML = '- Cannot contain special characters';
    lNameCheck = false;

  } else {
    document.querySelector("#errorMsg2").innerHTML = "";
    lNameCheck = true;
  }
  return lNameCheck;
}



function validEmail() {
    var pattern =  /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
	var email = document.profile.email.value.trim();

	if(email == "") {
		document.querySelector("#errorMsg3").innerHTML = '- This field is required';
		emailCheck = false;

	}else if(!email.match(pattern)){
		document.querySelector("#errorMsg3").innerHTML = '- Enter a valid email address';
        emailCheck = false;

	}else{
		document.querySelector("#errorMsg3").innerHTML = "";
        emailCheck = true;
	}
	return emailCheck;
}



/**************************************************** */


$(document).ready(() => {
  if ($("#userType").text() === "Visitor"){
    renderUserMenu(); // so they can log in
    return;
  } 

  let id = $("#userID").text();

  // LOCAL
  //let prjUrl = "http://localhost:3000/api/getProjectsByUser/UserID/" + id;
  //let usrUrl = "http://localhost:3000/api/getUserByID/id/" + id;

  // PRODUCTION
  let prjUrl = "http://myvmlab.senecacollege.ca:6193/api/getProjectsByUser/UserID/" + id;
  let usrUrl = "http://myvmlab.senecacollege.ca:6193/api/getUserByID/id/" + id;

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
  let fName = (jsData[0].firstName && jsData[0].firstName != "NULL") ? jsData[0].firstName : "First Name";
  let lName = (jsData[0].lastName && jsData[0].lastName != "NULL") ? jsData[0].lastName : "Last Name";
  let email = jsData[0].email ? jsData[0].email : "sample@email.com";
  let program = jsData[0].program ? jsData[0].program : "Program of study";
  let username = jsData[0].userName ? jsData[0].userName : "Username";
  let host = "http://myvmlab.senecacollege.ca:6193";
  let imagePath = jsData[0].imagePath ? host + jsData[0].imagePath :"../images/empty.png";

  $("#fname").attr({ "placeholder": fName });
  $("#lname").attr({ "placeholder": lName });
  $("#email").attr({ "placeholder": email });
  $("#program").attr({ "placeholder": program });
  $("#username").attr({ "placeholder": username });
  $("#imgPreview").attr({ "src": imagePath });
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

window.addEventListener("load", function () {
  function sendData() {
    var XHR = new XMLHttpRequest();
    if (fname.value == ""){
      fname.value = fname.placeholder;
    }
    if (lname.value == ""){
      lname.value = lname.placeholder;
    }
    if (email.value == ""){
      email.value = email.placeholder;
    }
    if (program.value == ""){
      program.value = program.placeholder;
    }
    if (username.value == ""){
      username.value = username.placeholder;
    }
    // rebuild form using form data object such that file will be at the end of the form in post request
    var FD = new FormData();
    FD.append("fname", fname.value);
    FD.append("lname", lname.value);
    FD.append("email", email.value);
    FD.append("program", program.value);    
    FD.append("password", password.value);
    FD.append("username", username.value);
    FD.append("img-input", imgFile.files[0]);

    // the next course of action after successfully sending data
    XHR.addEventListener("load", function(event) {
      //alert(event.target.responseText);
      if (event.target.responseText == "success"){
        window.location.replace("/profile");
      }
    });

    XHR.addEventListener("error", function(event) {
      //alert('Event error:', event);
    });

    XHR.open("POST", "/profile");
    XHR.send(FD);
  }
 
  // Access each element of the form
  var fname = document.getElementById("fname");
  var lname = document.getElementById("lname");
  var email = document.getElementById("email");
  var program = document.getElementById("program");
  var username = document.getElementById("username");
  var password = document.getElementById("password");
  var imgFile = document.getElementById("img-input");

  // intercepts submit event for profile form
  document.getElementById("profile").addEventListener("submit", function (event) {
    event.preventDefault();
    sendData();  
  }); // form submit event listener
}); // page load event listener

