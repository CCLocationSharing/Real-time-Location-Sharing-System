'use strict';

var admin = {};

admin.init = function() {
    let d = new Date()
    document.getElementById("start-date").valueAsDate = d;
    d.setDate(d.getDate() + 6);
    document.getElementById("end-date").valueAsDate = d;

    $("#update-form").submit(function(event) {
        event.preventDefault();
        let json_raw = $(this).serializeArray();
        let json_submit = {}, cells = [];
        for (let i = 0; i < json_raw.length; i++) {
            if (json_raw[i].name === "username" || json_raw[i].name === "course") {
                json_submit[json_raw[i].name] = json_raw[i].value;
            } else {
                let name = json_raw[i].name;
                let d = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
                let date = new Date(d);
                date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                date.setHours(name.substring(9));
                cells.push(date);
            }
        }
        json_submit.cells = JSON.stringify(cells);
        $.post("/postAdminUpdate", json_submit, function(result) {
            let status = result.status;
            if (status === 1) $("#form-feedback").text("Unauthorized");
            else if (status === 0) {
                $("#retrieve-form").trigger("submit");
            }
        });
    });
}

$(document).ready(function() {
    admin.init();
});
