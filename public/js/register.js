

(function ($) {
    'use strict';
   
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
    
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
    
        $(window).on('click',function(){
            isClick = 0;
        });

        $(window).on('load', function () {
            var inputs = $("#errorMessage").val();
            if (inputs)
                alert(inputs)
        })
    
        $(myCalendar).on('apply.daterangepicker',function(ev, picker){
            isClick = 0;
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
    
        });
    
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
    
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
    
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
    
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });   
        
      

        function validateConfirmPassword(){
            var password = $('.js-validation-password').val();
            var confirmPassword = $('.js-validation-confirmPassword').val();

            if(password !== '' && confirmPassword !== '' && confirmPassword === password)
            {
                $('#confirmPasswordSpan').css("color","black")
                $('#confirmPassword').css("border-bottom","1px solid #AAA");
                $('#PasswordSpan').css("color","black")
                $('#password').css("border-bottom","1px solid #AAA");   

                $('#js-message-confirmPassword').prop('style', 'display: none');
              

                return true

            }
            else if (password !== '' && confirmPassword !== '' && confirmPassword !== password )
            {
                $('#confirmPasswordSpan').css("color","#cc0033")
                $('#confirmPassword').css("border-bottom","3px solid #cc0033");
                $('#js-message-confirmPassword').text('Mật khẩu không khớp')
                $('#js-message-confirmPassword').prop('style', 'display: block');
            

                return false
            }
            else if (password === '' && confirmPassword !== '')
            {
                $('.js-validation-password').focus()
                $('.js-validation-confirmPassword').val('')
               

                $('#PasswordSpan').css("color","#cc0033")
                $('#password').css("border-bottom","3px solid #cc0033");

                $('#js-message-password').text('Hãy nhập mật khẩu trước khi Confirm ')
                $('#js-message-password').prop('style', 'display: block');
     
                return false
            }


            else
            {
                $('#confirmPasswordSpan').css("color","black")
                $('#confirmPassword').css("border-bottom","1px solid #AAA");
                $('#PasswordSpan').css("color","black")
                $('#password').css("border-bottom","1px solid #AAA");   
                $('#js-message-password').prop('style', 'display: none');
            }
            return false
        }

        $('.js-validation-confirmPassword').on('blur',function(){
            $('#confirmPasswordSpan').css("color","black")
            $('#confirmPassword').css("border-bottom","1px solid #AAA");
            $('#PasswordSpan').css("color","black")
            $('#password').css("border-bottom","1px solid #AAA");  
            validateConfirmPassword()

        })

        $('.js-validation-confirmPassword').on('click',function(){
            $('.js-message-confirmPassword').prop('type', 'hidden');
          });

        function validatePassword(){
            var password = $('.js-validation-password').val();
            var confirmPassword = $('.js-validation-confirmPassword').val();
            if (password === '')
            {
                // $('#PasswordSpan').css("color","#cc0033")
                // $('#confirmPassword').css("border-bottom","3px solid #cc0033");
                // $('#js-message-password').text('Hãy nhập mật khẩu')
                // $('#js-message-password').prop('style', 'display: block');
                return false
            }
            else if(password !== '' && confirmPassword !== '' && password !== confirmPassword )
            {
                $('#confirmPasswordSpan').css("color","#cc0033")
                $('#confirmPassword').css("border-bottom","3px solid #cc0033");
                $('#js-message-confirmPassword').text('Mật khẩu không khớp')
                $('#js-message-confirmPassword').prop('style', 'display: block');
                return false;
            }
            else
            {
                $('#PasswordSpan').css("color","black")
                $('#Password').css("border-bottom","1px solid #AAA");
                $('#confirmPasswordSpan').css("color","black")
                $('#confirmPassword').css("border-bottom","1px solid #AAA");

                $('#js-message-password').prop('style', 'display: none');
                $('#js-message-confirmPassword').text('')
                return true
            }
        }

        $('.js-validation-password').on('blur',function(){
            validatePassword();  
        });
        
        function validatePhone(){
            var phone = $('.js-validation-phone').val();
            var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
            if(phone !== ''){
                if (vnf_regex.test(phone) == false) 
                {   $('#phoneSpan').css("color","#cc0033")
                    $('#phone').css("border-bottom","3px solid #cc0033");
                    $('#js-message-phone').text('Số điện thoại không đúng định dạng')
                    $('#js-message-phone').prop('style', 'display: block');
                    return false

                }
                else{
                    $('#js-message-phone').prop('style', 'display: none');
                    $('#phoneSpan').css("color","black")
                    $('#phone').css("border-bottom","1px solid #AAA");
                    return true
                }
            }
            else{
                $('#js-message-phone').prop('style', 'display: none');
               return false
            }
        }

        $('.js-validation-phone').on('blur',function(){
            validatePhone()
        });

        $('.js-validation-phone').on('click',function(){
            $('.js-message-phone').prop('type', 'hidden');
          });

        function validateUsername()
        {
            var username = $('.js-validation-username').val();
            if (username !== '')
            {
                $.getJSON(`/account/existUsername?username=${username}`, function(data){
                    if (data === false)
                    {
                        $('#usernameSpan').css("color","#cc0033")
                        $('#username').css("border-bottom","3px solid #cc0033");
                        $('#js-message-username').text('Tên đăng nhập đã tồn tại')
                        $('#js-message-username').prop('style', 'display: block');
                        return false
                    }
                    else
                    {
                        $('#js-message-username').prop('style', 'display: none');
                        $('#usernameSpan').css("color","black")
                        $('#username').css("border-bottom","1px solid #AAA");
                        return true
                    }
                })
            }
            else
            {
                $('#js-message-username').prop('style', 'display: none');
                return false
            }
        }

        $('.js-validation-username').keyup(function(){
            validateUsername()
        });  

        $('.js-validation-username').on('click',function(){
            $('.js-message-username').prop('type', 'hidden');
          });

        function validateEmail(){
            var email = $('.js-validation-email').val();
            var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if(email !== ''){
                if (vnf_regex.test(email) == false) 
                { 
                    $('#emailSpan').css("color","#cc0033")
                    $('#email').css("border-bottom","3px solid #cc0033");
                    $('#js-message-email').text('Email không đúng định dạng')
                    $('#js-message-email').prop('style', 'display: block');
                    return false

                }
                else{
                    $('#js-message-email').prop('style', 'display: none');
                    $('#emailSpan').css("color","black")
                    $('#email').css("border-bottom","1px solid #AAA");
                    return true
                }
            }
            else{
                $('#js-message-email').prop('style', 'display: none');
               return false
            }
        }

        $('.js-validation-email').on('blur',function(){
            validateEmail()
        });  

        $('.js-validation-email').on('click',function(){
            $('.js-message-email').prop('type', 'hidden');
          });

        function validateFullname(){
            var fullname = $('.js-validation-fullname').val();
            if (fullname !== '')
            {
                $('#js-message-fullname').prop('style', 'display: none');
                return true
            }
            else
            {
                // $('.js-message-fullname').val('Hãy nhập họ tên')
                // $('.js-message-fullname').prop('type', 'text');
                return false    
            }
        }

        function validateDOB(){
            var dob = $('.js-validation-DOB').val();
            var vnf_regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
            if(dob !== ''){
                if (vnf_regex.test(dob) === false) 
                { 
                    $('#js-message-DOB').text('Ngày sinh không đúng định dạng')
                    $('#js-message-DOB').prop('style', 'display: block');
                    $('#DOBSpan').css("color","#cc0033")
                    $('#DOB').css("border-bottom","3px solid #cc0033");
                    return false
                }
                else{
                    var date = new Date(dob.split("/").reverse().join("-"))
                    var curDate = new Date()
                    if (date.getFullYear() >= 1900 && curDate.getFullYear() - date.getFullYear() >= 7)
                    {
                        $('#DOBSpan').css("color","black")
                        $('#DOB').css("border-bottom","1px solid #AAA");
                        $('#js-message-DOB').prop('style', 'display: none');
                        return true
                    }
                    else
                    {
                        $('#js-message-DOB').text('Bạn còn quá nhỏ')
                        $('#js-message-DOB').prop('style', 'display: block');
                        $('#DOBSpan').css("color","#cc0033")
                        $('#DOB').css("border-bottom","3px solid #cc0033");

                        return false
                    }
                }
            }
            else{
                $('#js-message-DOB').prop('style', 'display: none');
               return false
            }

            //=============
            // var dob = $('.js-validation-DOB').val();
            // if (dob !== '')
            // {
            //     $('.js-message-DOB').prop('type', 'hidden');
            //     return true
            // }
            // else
            // {
            //     $('.js-message-DOB').val('Hãy chọn ngày sinh')
            //     $('.js-message-DOB').prop('type', 'text');
            //     return false  
            // }
        }

        $('.js-validation-DOB').on('blur',function(){
            validateDOB()
        });
        
        $('.js-validation-DOB').on('click',function(){
            $('.js-message-DOB').prop('type', 'hidden');
          });

        $('#frmRegister').on('submit',function(e){
            if (validateUsername() === false)
            {
                $('.js-validation-username').focus()
            }
            else if (validatePassword() === false)
            {
                $('.js-validation-password').focus()
            }
            else if (validateConfirmPassword() === false)
            {
                $('.js-validation-confirmPassword').focus()
            }
            else if (validateEmail() === false)
            {
                $('.js-validation-email').focus()
            }
            else if (validateFullname() === false)
            {
                $('.js-validation-fullname').focus()
            }
            else if (validateDOB() === false)
            {
                $('.js-validation-DOB').focus()
            }
            else if (validatePhone() === false)
            {
                alert("phone")
                $('.js-validation-phone').focus()
            }
            else 
            {
                return true
            }

            e.preventDefault()
            alert("Vui lòng điền thông tin đầy đủ và hợp lệ")
            return false      

            // if (validateUsername() && validatePassword() && validateConfirmPassword() && validateEmail() 
            //     && validateFullname() && validateDOB() && validatePhone())
            // {
            //     alert("vô key")
            //     $('#frmRegister').off('submit').submit() 
            //     return true   
            // }
            // else{
            //     e.preventDefault()
            //     alert("Vui lòng điền thông tin đầy đủ và hợp lệ")
            //     return false      
            // }
               
        })

        
        // $('#frmRegister').on('submit',function(e){
        //     e.preventDefault()
        //     if (validateConfirmPassword() && validatePhone() && validateUsername() && validateEmail())
        //     {
        //         $('#frmRegister').off('submit').submit()
        //     }
        //     else
        //     {
        //         alert("Hãy nhập đủ thông tin")
        //     }
        // });
        
    } catch(er) {console.log(er);}

    
    try {
        var selectSimple = $('.js-select-simple');
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }

})(jQuery);