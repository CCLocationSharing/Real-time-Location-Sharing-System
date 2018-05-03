'use strict';

var signin = {};
 
signin.init = function() {
    $("#signup-form").submit(function(event) {
        event.preventDefault();
        let json_raw = $(this).serializeArray();
        let json_submit = {};
        for (let i = 0; i < json_raw.length; i++) {
            json_submit[json_raw[i].name] = json_raw[i].value;
        }

        $.post("/signup", json_submit, function(result) {
            console.log(result);
            let status = result.status;
           
            if (status === 3) $("#error-message").text("Password must be 6-20 characters long");
            else if (status === 1) $("#error-message").text("User already exists");
            else if (status === 2) $("#error-message").text("Password doesn't match");
            else if (status === 0) {
                window.location = "/dashboard";
            }
        })
    });
}

$(document).ready(function() {
    signin.init();
});
