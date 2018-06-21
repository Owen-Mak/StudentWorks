
$(document).ready(() => {
  httpRequest = new XMLHttpRequest();
  if (!httpRequest)

  id = 2;
  httpRequest.onreadystatechange = renderProfile;
  httpRequest.open('GET', "http://myvmlab.senecacollege.ca:6193/api/getProjectsByUser/UserID/" + 2, true);
  //httpRequest.open('GET', "http://localhost:3000/api/getProjectsByUser/UserID/" + id, true);
  httpRequest.send();
});

function renderProfile() {
  if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {

          var jsData = JSON.parse(httpRequest.responseText);

          let projectList = "";
          let projectStatusList = "";
          let projectYearList = "";
          $.each(jsData, (key, value) => {
			
            projectList += "<li>"+ value.title + "</li>";
            projectStatusList += "<li>NO STATUS IN OUR MODEL</li>";
            projectYearList += "<li>"+ value.creationDate.substring(0, 4) + "</li>";
        });

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

