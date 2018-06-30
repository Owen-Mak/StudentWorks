document.getElementById("forgot").onsubmit = function () {
	var username = document.forms["forgot"]["username1"].value;
  
	var submit = true;
  
	/** First Name **/
  
	if (username == null || username == "") {
	  nameError = "- This field is required";
	  document.getElementById("errorMsg2").innerHTML = nameError;
	  submit = false;
	}
	 
	/* To remove warning after user inputs correct info */
  
	function removeUserWarning() {
	  document.querySelector("#errorMsg2").innerHTML = "";
	}
 

	document.getElementById("username1").onkeyup = removeUserWarning;
	return submit
  }
  
  

