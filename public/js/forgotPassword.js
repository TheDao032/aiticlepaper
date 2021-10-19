function validateUsername() {
  var username = $("#usernameLI").val();
  return new Promise(function(resolve, reject){
  if (username !== "") {
    $.getJSON(`/account/existUsername?username=${username}`, function (data) {
      if (!data) {
        $("#js-message-username").prop("type", "hidden");
      } else {
        $("#js-message-username").val("Tên đăng nhập không tồn tại");
        $("#js-message-username").prop("type", "text");
      }
      resolve(!data)
    });
  } else {
    $("#js-message-username").prop("type", "hidden");
    return false;
  }
})
}

$('#usernameLI').on('click',function(){
  $('#js-message-username').prop('type', 'hidden');
});

$("#frmForgotPassword").on("submit", async function (e) {
  e.preventDefault();
  if (await validateUsername()) $("#frmForgotPassword").off("submit").submit();
});
