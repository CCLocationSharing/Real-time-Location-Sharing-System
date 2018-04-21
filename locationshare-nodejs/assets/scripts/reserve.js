'use strict';

var reserve = {};

function reRender(date, lib) {
    let justfortest = {};
    justfortest["library"] = lib;
    justfortest["date"] = date;

    let stringBuilder = "<tbody id=\"temp\">";

    $.get("/renderForPicker", justfortest, function(result, reRenderDone) {
        if(result === undefined) {
            console.log("result is undefined");
            return;
        }

        result.forEach(function(item) {
            let table = item.table;
            let timesections = item.data.timesections;

            stringBuilder = stringBuilder + "<tr><th scope=\"row\">" + table + "<\/th>";
            let prefix = "<td class=\"rsv\" onclick=\"selecttime(this)\"><input type=\"checkbox\" id=\"";
            let suffix = "\/><span><\/span><\/td>";

            timesections.forEach(function(item) {
                let section = item.timesection;
                let r = item.reservable;
                if(r === true) {
                    let id = table+"+"+section;
                    stringBuilder = stringBuilder + prefix + id + "\"" + suffix;
                }else {
                    let id = table+"+"+section;
                    stringBuilder = stringBuilder + prefix + id + "\"" + " disabled " + suffix;
                }
                if(section === 22) {
                    stringBuilder = stringBuilder + "<\/tr>";
                }
            });
        });
        reRenderDone(stringBuilder);

        function reRenderDone(stringBuilder) {
            stringBuilder = stringBuilder + "<\/tbody>"; 
            $('#reserve_table').append(stringBuilder);
        }
    });
}

function selecttime(itself) {
    if(itself != undefined) {
        let checkbox = $(itself).find("input")[0];
        if(checkbox.checked === undefined || checkbox.checked === false) {
            checkbox.checked = true;
        }else {
            checkbox.checked = false;
        }
    }
}

function show(date, lib) {
    if(date === undefined || date === null) {
        var now_str = moment().format();
    }else {
        var now_str = moment(date).format();
    }
    if($("#temp").length > 0) {
        $("#temp")[0].remove();
    }
    $('#library')[0].value = lib;
    $('#date')[0].value = now_str;
    reRender(now_str, lib);
}

reserve.init = function () {
    let now = moment();
    let minDate = moment().startOf('date');
    let maxDate = moment().add(6, 'day');
    let default_lib = "carpenter";

    //default, now, carpenter hall
    show(now, default_lib);

    //pikaday plugin
    var picker = new Pikaday({ 
        field: $('#datepicker')[0],
        trigger: $('#datepickerTrigger')[0],
        minDate: minDate,
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
            
            let lib = "carpenter";
            if($('#library')[0].value != undefined) {
                lib = $('#library')[0].value;
                show(date, lib);
            }
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
