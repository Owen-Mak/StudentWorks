var userCheck = true;
var curPassCheck = true;
var passCheck = true; //for password check
var rPassCheck = true; //for reetype password check

function validateForm() {

    if(validUser(userCheck) && validCurPass(curPassCheck) && validPass(passCheck) && validRPass(rPassCheck)){
        return true;
    }else{
        return false;
    }
 }


 function validUser(str) {
	var name = document.complete.username.value.trim();
	if(name == "") {
		document.querySelector("#errorMsg1").innerHTML = '- This field is required';
		userCheck = false;
	}else{
		document.querySelector("#errorMsg1").innerHTML = "";
        userCheck = true;
	}
	return userCheck;
}


function validCurPass(str) {
	var oldpass = document.complete.oldpassword.value.trim();
	if(oldpass == "") {
		document.querySelector("#errorMsg2").innerHTML = '- This field is required';
		curPassCheck = false;
	}else{
		document.querySelector("#errorMsg2").innerHTML = "";
        curPassCheck = true;
	}
	return curPassCheck;
}


//PASSWORD VALIDATION

function validPass() {
	var pass = document.complete.password1.value.trim();
	var pattern = /^(?=.*\d)[0-9a-zA-Z]{8,}$/;

	//console.log(pass);
	if(pass == "") {
		document.querySelector("#errorMsg3").innerHTML = '- This field is required';
		passCheck = false;

	} else if (pass.length < 8) {
		document.querySelector("#errorMsg3").innerHTML = '- Must be at least 8 characters long';
		passCheck = false;

	}else if(!pass.match(pattern)){
		document.querySelector("#errorMsg3").innerHTML = '- Must contain at least 1 number';
			passCheck = false;

	}else{
		document.querySelector("#errorMsg3").innerHTML = "";
			passCheck = true;
	}
	return passCheck;
}
	

// RETYPE NAMPASSWORD VALIDATION

function validRPass() {
	var pass = document.complete.password2.value.trim();
	if (pass == "") {
		document.querySelector("#errorMsg4").innerHTML = '- This field is required';
		rPassCheck = false;
	} else if (!(pass == document.complete.password1.value.trim())) {
		document.querySelector("#errorMsg4").innerHTML = '- The passwords must match';
		rPassCheck = false;
	}else{
		document.querySelector("#errorMsg4").innerHTML = "";
		rPassCheck = true;
	}
	return rPassCheck;
}
