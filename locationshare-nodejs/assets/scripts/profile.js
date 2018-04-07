'use strict';

var profile = {};

profile.init = function() {
    $("a[id^='remove-course']").css("cursor", "pointer").click(function() {
        let code = $(this).prop("id").substring(14);
        $.post("/removeCourse", {course: code}, function(result) {
            location.reload();
        });
    });

    $("a[id^='remove-friend']").css("cursor", "pointer").click(function() {
        let name = $(this).prop("id").substring(14);
        $.post("/removeFriend", {friend: name}, function(result) {
            location.reload();
        });
    });

    $("a[id^='remove-post']").css("cursor", "pointer").click(function() {
        let id = $(this).prop("id").substring(12);
        $.post("/removeTutorPost", {id: id}, function(result) {
            location.reload();
        });
    });

    $("#edit").css("cursor", "pointer").click(function() {
        $("#email").prop("hidden", true);
        $("#edit-form").prop("hidden", false);
        $("#edit-picture").prop("hidden", false);
    });

    $("#edit-submit").click(function(event) {
        event.preventDefault();
        let form_data = new FormData();
        form_data.append("email", $("#input-email").val());
        form_data.append("bio", $("#input-bio").val());
        form_data.append("password", $("#input-password").val());
        form_data.append("confirm", $("#input-password-confirm").val());
        if ($("#input-picture").prop("files"))
            form_data.append("picture", $("#input-picture").prop("files")[0]);
        $.ajax({
            type: "POST",
            url: "/profile",
            data: form_data,
            contentType: false,
            processData: false,
            success: function(result) {
                let status = result.status;
                if (status === 1) $("#error-message").text("Password doesn't match");
                else if (status === 2) $("#error-message").text("Password must be 6-20 characters long");
                else if (status === 3) $("#error-message").text("Invalid email");
                else if (status === 4) $("#error-message").text("Not an image");
                else if (status === 5) $("#error-message").text("Image over 5MB");
                else if (status === 0) location.reload();
            }
        });
    });
}

$(document).ready(function() {
    profile.init();
});
