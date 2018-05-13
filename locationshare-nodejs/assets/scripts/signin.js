'use strict';

var signin = {};
 
signin.init = function() {
    $("#signup-form").submit(function(event) {
        event.preventDefault();
        let json_raw = $(this).serializeArray();
        let json_submit = {};
        for (let i = 0; i < json_raw.length; i++)
            json_submit[json_raw[i].name] = json_raw[i].value;
        if (!json_submit.password.match(/^\w{6,20}$/)) {
            $("#error-message").text("Password must be 6-20 characters long!");
            return;
        } else if (json_submit.password !== json_submit.confirmpassword) {
            $("#error-message").text("Password doesn't match!");
            return;
        }
        if ($("#major option:selected").val() == 0) {
            $("#error-message").text("Please select your major!");
        } else {
            json_submit.major = $("#major option:selected").val();
        }

        $.post("/signup", json_submit, function(result) {
            let status = result.status;
           
            if (status === 3) $("#error-message").text("Password must be 6-20 characters long");
            else if (status === 1) $("#error-message").text("User already exists");
            else if (status === 2) $("#error-message").text("Password doesn't match");
            else if (status === 4) $("#error-message").text("Please select your major");
            else if (status === 0) {
                window.location = "/dashboard";
            }
        })
    });
}

$(document).ready(function() {
    signin.init();
});
