function myFunction() {
    var x, y, text, text2;

    x = document.getElementById("usrname").value;
    x = document.getElementById("psword").value;


    if (x == '') {
        text = "- This field is required";
    } else {
        text = "";
    }
    document.getElementById("errorMsg").innerHTML = text;

    if (y == '' ) {
        text2 = "- This field is required";
    } else {
        text2 = "";
    }
    document.getElementById("errorMsg2").innerHTML = text;
}
