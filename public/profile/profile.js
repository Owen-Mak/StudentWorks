
$(document).ready(() => {
  httpRequest = new XMLHttpRequest();
  if (!httpRequest)
      console.log("Cannot create an XMLHTTP instance");

      console.log("IM LOADED");

  id = 2;
  httpRequest.onreadystatechange = renderProfile;
  httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getOneProject?id="+id, true);
  //httpRequest.open('GET', "http://localhost:3000/api/getProjectsByUser/UserID/" + id, true);
  httpRequest.send();
});

function renderProfile() {
  if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {

        console.log("I got something");

          var jsData = JSON.parse(httpRequest.responseText);

          let projectList = "";
          let projectStatusList = "";
          let projectYearList = "";

            projectList += "<li>"+ jsData[0].title + "</li>";
            projectStatusList += "<li>NO STATUS IN OUR MODEL</li>";
            projectYearList += "<li>"+ jsData[0].creationDate.substring(0, 4) + "</li>";

            console.log(projectList);
            console.log(projectStatusList);
            console.log(projectYearList);


          $("#projectName").html(projectList);
          $("#projectStatus").html(projectStatusList);
          $("#projectYear").html(projectYearList);
      }
  }
}


$(function() {
    $('#img-preview').click(function() {
      $('#img-input').trigger('click');
    });
    
    $("#img-input").change(function() {  
      readImage(this);
    });
   
    var readImage = function(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
   
        reader.onload = function(e) {
          var html = '<img src="' + e.target.result + '">'
          $('#img-preview').html(html);
        }
   
        reader.readAsDataURL(input.files[0]);
      }
    };
  });

