'use strict';

var gre = {};

gre.init = function() {
    $("#startdate-form").submit(function(event) {
        event.preventDefault();
        let json_info = $(this).serializeArray(), json_submit = {};
        json_submit[json_info[0].name] = json_info[0].value;
        $.post("/postGreStartDate", json_submit, function(result) {
            let status = result.status;
            if (status === 1) $("#form-feedback").text("日期不能早于今日！");
            else if (status === 0) {
                $("#form-feedback").text("设置成功！页面将于2秒后刷新。");console.log(result.result);
//                setTimeout(function() {
//                    window.location = "/gre";
//                }, 2000);
            }
        });
    });

    if($("#startdate").length) {
        let startdate = new Date($("#startdate").value()), today = new Date();
        $("#datediff").text(Math.floor((today - startdate) / (1000 * 60 * 60 * 24)) + 1);
    }
}

$(document).ready(function() {
    gre.init();
});
