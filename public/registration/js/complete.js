var passCheck = true; //for password check
var rPassCheck = true; //for reetype password check

function validateForm() {

    if(passCheck && rPassCheck){
        return true;
    }else{
        return false;
    }
 }

//PASSWORD VALIDATION

function validPass() {
	var pass = document.complete.password1.value.trim();
	var pattern = /^(?=.*\d)[0-9a-zA-Z]{8,}$/;

	//console.log(pass);
	if(pass == "") {
		document.querySelector("#errorMsg").innerHTML = '- This field is required';
		passCheck = false;

	} else if (pass.length < 8) {
		document.querySelector("#errorMsg").innerHTML = '- Must be at least 8 characters long';
		passCheck = false;

	}else if(!pass.match(pattern)){
		document.querySelector("#errorMsg").innerHTML = '- Must contain at least 1 number';
			passCheck = false;

	}else{
		document.querySelector("#errorMsg").innerHTML = "";
			passCheck = true;
	}
	return passCheck;
}
	

// RETYPE NAMPASSWORD VALIDATION

function validRPass() {
	var pass = document.complete.password2.value.trim();
	if (pass == "") {
		document.querySelector("#errorMsg2").innerHTML = '- This field is required';
		rPassCheck = false;
	} else if (!(pass == document.complete.password1.value.trim())) {
		document.querySelector("#errorMsg2").innerHTML = '- The passwords must match';
		rPassCheck = false;
	}else{
		document.querySelector("#errorMsg2").innerHTML = "";
		rPassCheck = true;
	}
	return rPassCheck;
}
