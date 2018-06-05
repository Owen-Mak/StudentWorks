var httpRequest;

// READY function that gets called when HTML finishes parsing
// console.log are used for deguggin and can be seen from BROWSER console not server.
$(document).ready(() => {
    console.log("main.js Page loaded");


    // Old format
    httpRequest = new XMLHttpRequest();
    if (!httpRequest)
        console.log("Cannot create an XMLHTTP instance");

    httpRequest.onreadystatechange = showContents;
    httpRequest.open('GET', "myvmlab.senecacollege.ca:6193/api/getAllProjects", true);
    httpRequest.open('GET', "localhost:3000/api/getAllProjects", true);
    httpRequest.send();

    console.log("end of main.js");
});


//
function showContents() {
    if (httpRequest.readyState === 4) {
        console.log("Ready state is: 4, status is: " + httpRequest.status);
        if (httpRequest.status === 200) {
            var jsData = JSON.parse(httpRequest.responseText);
            console.log("jsData");
        }
    }



}

