'use strict';

var signin = {};

signin.init = function() {
    $("#login-form").submit(function(event) {
        event.preventDefault();

        if ($("#remember").is(":checked")){
            $.cookie("username", $("#username").val() , {expires: 7});
            $.cookie("password", $("#password").val() , {expires: 7});
            $.cookie("remember", $("#remember").prop("checked") , {expires: 7});
        }
        else{
            $.cookie("username",'');
            $.cookie("password",'');
            $.cookie("remember", false);
        }

        let json_raw = $(this).serializeArray();
        let json_submit = {};
        for (let i = 0; i < json_raw.length; i++) {
            json_submit[json_raw[i].name] = json_raw[i].value;
        }
        $.post("/login", json_submit, function(result) {
            let status = result.status;
            if (status === 1) $("#error-message").text("Username does not exist");
            else if (status === 2) $("#error-message").text("Wrong password");
            else if (status === 0) {
                window.location = "/" + result.redirect;
            }
        });
    });

    $("#username").val($.cookie("username"));
    $("#password").val($.cookie("password"));
    $("#remember").prop("checked", $.cookie("remember") === "true");
}

$(document).ready(function() {
    signin.init();
});
