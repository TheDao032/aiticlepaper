//Ở validate function không có focus() khi rỗng

$(window).keydown(function(event){
  if(event.keyCode == 13) {
    event.preventDefault();
    return false;
  }
});

(function ($) {
  "use strict";

  var browserWindow = $(window);
  browserWindow.on("load", function () {
    $("#preloader").fadeOut("slow", function () {
      $(this).remove();
    });

    var inputs = $("#message").val();
    if (inputs)
        alert(inputs)
  });
  
  if ($.fn.classyNav) {
    $("#newspaperNav").classyNav();
  }



  function validateSignIn(){
    //Đồng bộ khúc này hiu hiu
    return new Promise(function(resolve, reject){
      var username = $('#usernameLI').val();
      var password = $('#passwordLI').val();
      if (username !== '' && password !== '')
      {
            $.getJSON(`/account/checkSignIn?username=${username}&password=${password}`,  function(data){
              if (data === false)
              {
                $('#usernameLI').val('');
                $('#passwordLI').val('');
                $('#js-message-signIn').val('Tên đăng nhập hoặc mật khẩu không đúng')
                $('#js-message-signIn').prop('type', 'text');
              }
              else
              {
                  $('#js-message-signIn').prop('type', 'hidden');
              }
              return resolve(data)
            })            
      }
      else{
        $('#usernameLI').val('');
        $('#passwordLI').val('');
        $('#js-message-signIn').val('Vui lòng điền đủ tên đăng nhập và mật khẩu')
        $('#js-message-signIn').prop('type', 'text');
        return false
      }
    })
  }
  
  $('#usernameLI').on('click',function(){
    $('#js-message-signIn').prop('type', 'hidden');
  });

  $('#passwordLI').on('click',function(){
    $('#js-message-signIn').prop('type', 'hidden');
  });


  
  $('#frmLogin').on('submit', async function(e){
    e.preventDefault()
    if (await validateSignIn())
      $('#frmLogin').off('submit').submit();
  })
  //validate đưng nhập

  // $(document).ready(function () {
  //   $("#form").validate({
  //     rules: {
  //       username: "required",
  //       password: "required", 
  //     },
  //     messages: {
  //       username: "Vui lòng nhập username",
  //       password: "Vui lòng nhập password",
  //     },
  //   });
  // });


})(jQuery);



