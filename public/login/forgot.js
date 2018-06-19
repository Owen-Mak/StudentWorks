var userCheck = true; 
var passCheck = true;


function validateForm() {
   console.log(userCheck);
   if(userCheck){
       return true;
   }else{
       return false;
   }
}


function validUser(str) {
	var name = str;
	if(name == "") {
		document.querySelector("#errorMsg2").innerHTML = '- This field is required';
		userCheck = false;
	}else{
		document.querySelector("#errorMsg2").innerHTML = "";
        userCheck = true;
	}
	return userCheck;
}



