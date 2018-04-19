'use strict';

var reserve = {};

//append search result at search.html by using res.render() , using template
//need to specify the template of search.html
/*
reserve.init = function() {
    $("#info-form").submit(function(event) {
        event.preventDefault();
        let json_info = $(this).serializeArray(), json_time = $("#time-form").serializeArray();
        let json_submit = {}, cells = [];
        for (let i = 0; i < json_info.length; i++)
            json_submit[json_info[i].name] = json_info[i].value;
        for (let i = 0; i < json_time.length; i++) {
            if (json_time[i].name === "course")
                json_submit["course"] = json_time[i].value;
            else {
                let name = json_time[i].name;
                let d = name.slice(0, 4) + "-" + name.slice(4, 6) + "-" + name.slice(6, 8);
                let date = new Date(d);
                date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                date.setHours(name.substring(9));
                cells.push(date);
            }
        }
        json_submit.cells = JSON.stringify(cells);
        $.post("/postOrder", json_submit, function(result) {
            let status = result.status;
            if (status === 1) $("#form-feedback").text("To be implemented");
            else if (status === 0) {
                $("#form-feedback").text("Ordered successfully");
            }
        });
    });

    if($("#phone-input").length) $("#phone-input").mask("(999) 999-9999");
}*/
var reRender = function(date) {
    let tbody = $("#reserve_table");

    let justfortest = {};
    justfortest["library"] = "olin";
    justfortest["date"] = date;

    tbody.append("<tbody id=\"temp\">");
    $.get("/renderForPicker", justfortest, function(result) {
        console.log("result:",result);
        for(let i = 0; i < result.length; i++) {
            let stringBuilder = [];

            let item = result[i];
            let table = item.table;
            let timesections = item.data.timesections;

            stringBuilder[0] = "<th scope=\"row\">"+table+"<\/th>";
            let prefix = "<td class=\"rsv\"><input type=\"checkbox\" id=";
            let suffix = "\/><span><\/span><\/td>";

            for(let j = 0; j < timesections.length; j++) {
                let section = timesections[j].timesection;
                let r = timesections[j].reservable;
                if(r === true) {
                    let id = table+"+"+section;
                    stringBuilder[j + 1] = prefix + id + suffix;
                }else {
                    let id = table+"+"+section;
                    stringBuilder[j + 1] = prefix + id + " disabled " + suffix;
                }
            }

            tbody.append("<tr>");
            for(let j = 0; j < stringBuilder.length; j++) {
                tbody.append(stringBuilder[j]);
            }
            tbody.append("<\/tr>");
        }
    });

    tbody.append("<\/tbody>");
}

reserve.init = function () {
    let now = moment();
    let minDate = now;
    let maxDate = moment().add(7, 'day');

    let now_str = now.format();

    reRender(now_str);

    //pikaday plugin
    var picker = new Pikaday({ 
        field: $('#datepicker')[0],
        trigger: $('#datepickerTrigger')[0],
        minDate: now,
        maxDate: maxDate,
        disableDayFn: function(date) {
            if(date < minDate || date > maxDate) {
                return true;
            }else {
                return false;
            }
        },
        onSelect: function(date) {
            $('#datepicker')[0].value = picker.toString();
            $('#date')[0].value = picker.toString();
            $("#temp")[0].remove();
            let date_str = moment(date).format();
            reRender(date_str);
        }
    });

    //post reservations
    $('#reserve_form').submit(function(event) {
        event.preventDefault();
        let form_info = $(this).serializeArray(), producedTime = moment().millisecond();
    });

}

$(document).ready(function() {
    reserve.init();
});
