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