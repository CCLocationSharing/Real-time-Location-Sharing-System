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
        if(checkbox.disabled) {
            return;
        }

        let prev = $(itself).prev(), next = $(itself).next();
        if(!prev.hasClass("rsv")) {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;

                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let table = id.substring(0, k), time = id.substring(k + 1);

                    $("#start")[0].value = time + ":00";
                    if(!next.find("input")[0].checked) {
                        $("#table")[0].value = table;
                        $("#end")[0].value = time + ":59";
                    }
                    $("td.rsv").not($(itself)).not(next).addClass("inactive");
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c2 = next.find("input")[0];
                if(!c2.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else {
                    $("#start")[0].value = c2.id.substring(c2.id.indexOf('+') + 1) + ":00";
                    next.next().removeClass("inactive");
                }
            }
        }else if(!next.hasClass("rsv")) {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;
                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let table = id.substring(0, k), time = id.substring(k + 1);

                    $("#end")[0].value = time + ":59";
                    if(!prev.find("input")[0].checked) {
                        $("#table")[0].value = table;
                        $("#start")[0].value = time + ":00";
                    }
                    $("td.rsv").not($(itself)).not(prev).addClass("inactive");
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c1 = prev.find("input")[0];
                if(!c1.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else {
                    $("#end")[0].value = c1.id.substring(c1.id.indexOf('+') + 1) + ":59";
                    prev.prev().removeClass("inactive");
                }
            }
        }else {
            if(checkbox.checked === undefined || checkbox.checked === false) {
                if(!$(itself).hasClass("inactive")) {
                    checkbox.checked = true;
                    let id = checkbox.id;
                    let k = id.indexOf('+');
                    let table = id.substring(0, k), time = id.substring(k + 1);
                    if(!prev.hasClass("inactive") && !next.hasClass("inactive")) {
                        $("#table")[0].value = table;
                        $("#start")[0].value = time + ":00";
                        $("#end")[0].value = time + ":59";
                        $("td.rsv").not($(itself)).not(prev).not(next).addClass("inactive");
                    }else if(prev.hasClass("inactive")) {
                        $("#start")[0].value = time + ":00";
                        next.next().addClass("inactive");
                    }else {
                        $("#end")[0].value = time + ":59";
                        prev.prev().addClass("inactive");
                    }
                }else {
                    return;
                }
            }else {
                checkbox.checked = false;
                let c1 = prev.find("input")[0], c2 = next.find("input")[0];
                if(!c1.checked && !c2.checked) {
                    $("td.rsv").each(function() {
                        if($(this).hasClass("inactive")) {
                            $(this).removeClass("inactive");
                        }
                    });
                    $("#table")[0].value = "";
                    $("#start")[0].value = "";
                    $("#end")[0].value = "";
                }else if(c1.checked) {
                    $("#end")[0].value = c1.id.substring(c1.id.indexOf('+') + 1) + ":59";
                    prev.prev().removeClass("inactive");
                }else {
                    $("#start")[0].value = c2.id.substring(c2.id.indexOf('+') + 1) + ":00";
                    next.next().removeClass("inactive");
                }
            }
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
    $('#date')[0].value = date;
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

        let reserve_info = {};
        let targets = [];
        $(":checkbox").each(function() {
            if($(this).checked) {
                targets.push($(this).id);
            }
        });

        console.log(targets);
        //reserve_info["username"] = ;
        reserve_info["producedTime"] = moment().millisecond();
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
