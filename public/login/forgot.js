var userCheck = true; 
var passCheck = true;

function validateForm() {

   if(validUser(userCheck) && validPass(passCheck)){
       return true;
   }else{
       return false;
   }
}


function validUser(str) {
	var name = document.forgot.username1.value.trim();

	if(name == "") {
		document.querySelector("#errorMsg").innerHTML = '- This field is required';
		userCheck = false;
	}else{
		document.querySelector("#errorMsg").innerHTML = "";
        userCheck = true;
	}
	return userCheck;
}



function validPass(str) {
	var pass = document.forgot.pass.value.trim();

	if(pass == "") {
		document.querySelector("#errorMsg2").innerHTML = '- This field is required';
		passCheck = false;

	}else{
		document.querySelector("#errorMsg2").innerHTML = "";
        passCheck = true;
	}
	return passCheck;
}