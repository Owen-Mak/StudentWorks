
/**** basic validation for input fields: Name, Last Name, and Email ****/

document.getElementById("login").onsubmit = function () {
	var username = document.forms["login"]["username1"].value;
	var pass = document.forms["login"]["pass"].value;
  
	var submit = true;
  
	/** First Name **/
  
	if (username == null || username == "") {
	  nameError = "- This field is required";
	  document.getElementById("errorMsg").innerHTML = nameError;
	  submit = false;
	}
	
	if (pass == null || pass == "") {
		nameError = "- This field is required";
		document.getElementById("errorMsg2").innerHTML = nameError;
		submit = false;
	  }
	  
	/* To remove warning after user inputs correct info */
  
	function removeUserWarning() {
	  document.querySelector("#errorMsg").innerHTML = "";
	}
  
	function removePasswordWarning() {
	  document.querySelector("#errorMsg2").innerHTML = "";
	}
  

	document.getElementById("username1").onkeyup = removeUserWarning;
	document.getElementById("pass").onkeyup = removePasswordWarning;
	return submit
  }
  
  