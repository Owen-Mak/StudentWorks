var userCheck = true; //for first name
var emailCheck = true; //for last name
console.log(document.register.email.value.trim());

function validateForm() {

   if(userCheck && emailCheck){
	   //alert("true");
       return true;
   }else{
	   //alert("false");
       return false;
   }
}


function validUser() {
    var pattern =  /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/;
	var name = document.register.name.value.trim();

	if(name == "") {
		document.querySelector("#errorMsg").innerHTML = '- This field is required';
		userCheck = false;

	} else if (name.length > 12) {
		document.querySelector("#errorMsg").innerHTML = '- Cannot exceed 12 characters';
		userCheck = false;

	}else if(!name.match(pattern)){
		document.querySelector("#errorMsg").innerHTML = '- Cannot contain special characters';
        userCheck = false;

	}else{
		document.querySelector("#errorMsg").innerHTML = "";
        userCheck = true;
	}
	return userCheck;
}



function validEmail() {
    var pattern =  /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
	var email = document.register.email.value.trim();

	if(email == "") {
		document.querySelector("#errorMsg2").innerHTML = '- This field is required';
		emailCheck = false;

	}else if(!email.match(pattern)){
		document.querySelector("#errorMsg2").innerHTML = '- Enter a valid email address';
        emailCheck = false;

	}else{
		document.querySelector("#errorMsg2").innerHTML = "";
        emailCheck = true;
	}
	return emailCheck;
}

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