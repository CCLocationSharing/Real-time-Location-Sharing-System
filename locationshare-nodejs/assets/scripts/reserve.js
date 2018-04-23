'use strict';

var reserve = {};

/*@param {string} date. @param {string} lib*/
function reRender(date, lib) {
    let renderParams = {};
    renderParams["library"] = lib;
    renderParams["date"] = date;

    let stringBuilder = "<tbody id=\"temp\">";

    $.get("/renderForPicker", renderParams, function(result, reRenderDone) {
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

function getDateString(date) {
    let today = moment().dayOfYear(), day = date.dayOfYear();
    if(day === today) {
        return moment().format();
    }else {
        return moment(date).format();
    }
}

//change library will call show function, the first parameter is null
//initialization will call show function, 2 parameters are passed
//picker will call show function, the second paramter is null
/*
*function
*@param {string} date, @param {string} lib
*/
function show(date, lib) {
    //clear the old table
    if($("#temp").length > 0) {
        $("#temp")[0].remove();
    }

    if(date === undefined || date === null) {
        date = moment($('#date')[0].value).format();
    }

    //standardization
    date = getDateString(date);

    if(lib === undefined || lib === null) {
        lib = $('#library')[0].value;
    }else {
        $('#library')[0].value = lib;
    }

    reRender(date, lib);
}

reserve.init = function () {
    let minDate = moment().startOf('date');
    let maxDate = moment().add(6, 'day');

    //default value for picker
    let defaultDate = moment().format("MM-DD-YYYY"), defaultLibrary = "carpenter";
    $('#datepicker')[0].value = defaultDate;
    $('#library')[0].value = defaultLibrary;
    $('#date')[0].value = defaultDate;

    //default render
    show(defaultDate, defaultLibrary);

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
            let datestr = picker.toString();
            date = moment(datestr).format("MM-DD-YYYY");
            $('#datepicker')[0].value =date;
            $('#date')[0].value = date;
            show(date, null);
        }
    });

    $("#reserve-form").submit(function(event) {
        event.preventDefault();

        let formInfo = $(this).serializeArray(), reserveInfo = {};
        formInfo.forEach(function(item) {
            if(item.value === undefined || item.value === "") {
                $("#error-message").text("empty");
                return;
            }
        });

        let date = moment(formInfo[1].value, "MM-DD-YYYY");
        let start = formInfo[2].value.substring(0,2), end = formInfo[3].value.substring(0,2);
        
        let startTime = moment(date).hour(start).startOf('hour');        
        let endTime = moment(date).hour(end).endOf('hour');

        
        reserveInfo["tabID"] = formInfo[0].value;
        reserveInfo["startTime"] = startTime.valueOf();
        reserveInfo["endTime"] = endTime.valueOf();
        reserveInfo["producedTime"] = moment().valueOf();

        console.log("1:", formInfo, reserveInfo);

        $.post("/makeReservations", reserveInfo, function(result) {
            if(result === undefined || result.IDs === undefined) {
                console.log("unsuccessful reservation");
            }else {
                result.IDs.forEach(function(item) {
                    $("#"+item).attr("disabled");
                    show(date.format(), formInfo[4].value);
                });
            }
        });
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
