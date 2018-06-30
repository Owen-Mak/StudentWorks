
document.getElementById("register").onsubmit = function () {
	var username = document.forms["register"]["NAME"].value;
	var pass = document.forms["register"]["password1"].value;
	var email = document.forms["register"]["to"].value;
  
	var submit = true;
	var userPattern =  /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
	var passwordPattern = /^(?=.*\d)[0-9a-zA-Z]{8,}$/;
	var emailPattern = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  
  
	/**  Username **/
  
	if (username == null || username == "") {
	  nameError = "- This field is required";
	  document.getElementById("user_error").innerHTML = nameError;
	  submit = false;
	}
  

	/** Password **/
  
	if (pass == null || pass == "") {
	  passwordError = "- This field is required";
	  document.getElementById("pass_error").innerHTML = passwordError;
	  submit = false;
	}
	


	  /** Email **/
  
	if (email == null || email == "") {
	  emailError = "- Please enter your email";
	  document.getElementById("email_error").innerHTML = emailError;
	  submit = false;
	}
  

  
	/* To remove warning after user inputs correct info */
  
	function removeUserWarning() {
	  document.querySelector("#user_error").innerHTML = "";
	}
  
	function removePassWarning() {
	  document.querySelector("#pass_error").innerHTML = "";
	}
  
	function removeEmailWarning() {
	  document.querySelector("#email_error").innerHTML = "";
	}
	document.getElementById("NAME").onkeyup = removeUserWarning;
	document.getElementById("password1").onkeyup = removePassWarning;
	document.getElementById("to").onkeyup = removeEmailWarning;

	return submit
  }
  
  