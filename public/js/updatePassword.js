function validateConfirmPassword(){

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        
        if(password !== '' && confirmPassword !== '' && confirmPassword === password)
        {
            $('.js-message-confirmPassword').prop('type', 'hidden');
            return true
        }
        else if (password !== '' && confirmPassword !== '' && confirmPassword !== password)
        {
                $('.js-message-confirmPassword').val('Mật khẩu không khớp')
                $('.js-message-confirmPassword').prop('type', 'text');
        }
        else if (password === '' && confirmPassword !== '')
        {
            $('.js-message-password').val('Hãy nhập mật khẩu')
            $('.js-message-password').prop('type', 'text');
            $('#confirmPassword').val('')
            $('#password').focus()
        }
        else
        {
            $('.js-message-confirmPassword').val('Hãy xác nhận lại mật khẩu')
            $('.js-message-confirmPassword').prop('type', 'text');
        }
        return false
        
}

function validateCurPassword()
{ 
    return new Promise(function (resolve, reject) {
        var curPassword = $('#curPassword').val();

        if (curPassword !== ''){
            $.getJSON(`/account/checkPassword?password=${curPassword}`, function(data){
                if (data === false)
                {
                    // $('.js-message-confirmPassword').prop('type', 'hidden');
                    $('#confirmPassword').val('');
                    $('#password').val('');
                    $('.js-message-curPassword').val('Mật khẩu không đúng')
                    $('.js-message-curPassword').prop('type', 'text');
                }
                resolve(data)
            })
        }
        else
        {
            $('.js-message-confirmPassword').prop('type', 'hidden');
            $('.js-message-curPassword').val('Hãy nhập mật khẩu hiện tại')
            $('.js-message-curPassword').prop('type', 'text');
            resolve(false)
        } 
    })
}

function validatePassword(){
    return new Promise(function (resolve, reject) {
        var password = $('#password').val();
        if (password === '')
        {
            $('.js-message-password').val('Hãy nhập mật khẩu')
            $('.js-message-password').prop('type', 'text');
            return false
        }
        else
            return true
    })
}

$('#curPassword').on('click',function(){
    $('.js-message-curPassword').prop('type', 'hidden');
});

$('#password').on('blur',function(){
    $('.js-message-password').prop('type', 'hidden');
});

$('#confirmPassword').on('click',function(){
    $('.js-message-confirmPassword').prop('type', 'hidden');
});

// $('#confirmPassword').on('blur',function(){
//     validateConfirmPassword()
// });


$("#frmUpdatePassword").on("submit",async function (e) {
    e.preventDefault();
    if ($('#curPassword').length)
    {
        if (await validateCurPassword())
        {
            if (validatePassword() && validateConfirmPassword())
            {
                $("#frmUpdatePassword").off("submit").submit();
                return true
            }
        }                  
    }
    else
    {
        if ( validatePassword() && validateConfirmPassword())
        {
            $("#frmUpdatePassword").off("submit").submit();
            return true
           
        }       
    }
    return false
    //Check auth nếu auth thì check validate
    // if (validatePassword() && validateConfirmPassword()) $("#frmUpdatePassword").off("submit").submit();
  });