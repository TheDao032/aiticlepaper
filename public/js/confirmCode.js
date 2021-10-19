function validateCode() {
  return new Promise(function (resolve, reject) {
    var code = $("#code").val();
    if (code !== "") {
      $.getJSON(`/account/checkCode?code=${code}`, function (data) {
        if (data) {
          $("#js-message-code").prop("type", "hidden");
        } else {
          $("#js-message-code").val("Mã không đúng");
          $("#js-message-code").prop("type", "text");
        }
        resolve(data)
      });
    } else {
      $("#js-message-username").prop("type", "hidden");
      return false;
    }
  });
}

$('#code').on('click',function(){
  $('#js-message-code').prop('type', 'hidden');
});

$("#frmConfirmCode").on("submit", async function (e) {
  e.preventDefault();
  if (await validateCode()) $("#frmConfirmCode").off("submit").submit();
});
