'use strict';

var dashboard = {};

function simulateSwipeCardOut(libID, tabID) {
    let leaveInfo = {};
    leaveInfo["tabID"] = tabID;
    $.post("/simulateSwipeCardOut", leaveInfo, function(result) {
        if (result.status === -1) {
            window.location.replace("/login");
        }else if (result.status === 5) {
            alert("Leaving table " + tabID + " failure");
        }else if(result.status === 1) {
            $("#occupyButton").show();
            $("#leaveButton").hide();
            $("input[type=radio]").attr("disabled", false);
            $("input[value="+libID+"]").next().remove();
        }
    });
};

function simulateSwipeCardIn() {
    let checked = $("input:checked");
    if (checked.length != 1) {
        alert("Invalid selection.");
        return;
    }
    let occupyInfo = {}, libID = checked.attr("value");
    occupyInfo["libID"] = libID;
    $.post("/simulateSwipeCardIn", occupyInfo, function(result) {
        if (result.status === -1) {
            window.location.replace("/login");
        }else if (result.status === 3) {
            alert("Library " + libID + " is full.");
        }else if (result.status === 5) {
            alert("Swipe in failed.");
        }else if (result.status === 1) {
            let tabID = result.tabID;
            $("#occupyButton").hide();
            $("input[type=radio]").attr("disabled", true);
            $("input[value="+libID+"]").after($("<span>").text(" Occupied"));
            $("#leaveButton").show().attr("onclick", "simulateSwipeCardOut(\""+libID+"\",\""+tabID+"\")");
        }
    });
};

dashboard.init = function() {
    let libraries = [], takenList = [], capList = [];
    let libChart = new Chart($("#libChart"), {
        type: 'bar',
        data: {
            labels: libraries,
            datasets: [{
                data: takenList,
                backgroundColor: '#9ec2e2',
                fill: true,
                borderColor: '#9ec2e2',
                borderWidth: 2,
                pointBackgroundColor: '#9ec2e2'
            }, {
                data: capList,
                fill: false,
                borderColor: '#d6e3ef',
                borderWidth: 1,
                pointBackgroundColor: '#d6e3ef'
            }]     
        },
        options: {
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: true
            },
            legend: {
                display: false
            }
        }
    });
    
    $.get("/libraryCapacity", function(result) {
        let libs = result["libraries"], occupied = result["occupation"];
        let libTable = $("#library-status");
        let ths = "<th>Libraries</th><th>Status</th><th>Swipe Card</th>";
        let thead = $("<thead>").append($("<tr>").append(ths));
        let tbody = $("<tbody>");
        libTable.append(thead).append(tbody);
        
        for (let i = 0; i < libs.length; i++) {
            let td1 = $("<td>").text(libs[i].libName);
            let td2 = $("<td>").attr("id", libs[i].libID + "-taken").append($("<span>")).append("/").append($("<span>").text(libs[i].libCapacity));
            let td3 = $("<td>").append($("<input>").attr("type", "radio").attr("value", libs[i].libID).attr("name", "occupyRadio"));
            tbody.append($("<tr>").append(td1).append(td2).append(td3));
            libraries.push(libs[i].libName);
            capList.push(libs[i].libCapacity);
        }

        let leaveButton = $("<button>").attr("id", "leaveButton").text("Leave");
        let occupyButton = $("<button>").attr("id", "occupyButton").text("Occupy");
        occupyButton.attr("onclick", "simulateSwipeCardIn()");
        if (occupied.libID != undefined) {
            $("input[type=radio]").attr("disabled", true);
            $("input[value="+occupied.libID+"]").attr("checked", true).after($("<span>").text(" Occupied"));
            leaveButton.attr("onclick", "simulateSwipeCardOut(\""+occupied.libID+"\",\""+occupied.tabID+"\")");
            tbody.append($("<td>")).append($("<td>")).append($("<td>").append(occupyButton.hide()).append(leaveButton));
        } else {
            tbody.append($("<td>")).append($("<td>")).append($("<td>").append(occupyButton).append(leaveButton.hide()));
        }

        
        $.get("/libraryStatus", function(takens) {
            for (let i = 0; i < libs.length; i++) {
                let libID = libs[i].libID;
                let text = takens[libID].taken;
                let p = $("#" + libID + "-taken").find("span")[0];
                $(p).text(text);
                takenList.push(takens[libID].taken);
            }
            libChart.update();
        });
        libChart.update();
    });

    $.get("/getUserReservation", function(result) {
        let resdiv = $("#reservation"), empty = true;
        for (let t in result) {
            empty = false;
            let time = moment(Number(t)).format("M-D h a");
            let id = t + "+" + result[t].replace(/( )+/g,"-");
            let span = $("<span>").addClass("list-group-item").attr("id", id + "+span").
                html("<span style=\"float:left;\">" + time + ": " + result[t] + "</span>").appendTo(resdiv);
            let a = $("<a>").attr("id", id).
                attr("href", "#").css({"float": "right"}).text("Cancel").
                click(cancelReservation).appendTo(span);
        }
        if (empty) resdiv.append("You don't have any reservations.");
    });

    if (!navigator.geolocation)
        $("#suggestionLocation").text("Unfortunately, geolocation is not supported by your browser. We will only use other feature to give you suggestions.");
    $("#suggestionButton").on("click", function(event) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                predict(position);
            }, function(error) {
                if (error.code == error.PERMISSION_DENIED)
                    $("#suggestionLocation").text("You blocked us from accessing your geolocation. We will only use other feature to give you suggestions.");
                predict(null);
            });
        } else predict(null);
    });
}

let loading;
function predict() {
    // predict
    $("#suggestionResult").text("Loading");
    loading = setInterval(addDot, 200);
    setTimeout(stopLoading, 5000);
}

let nDot = 0;

function addDot() {
    if (nDot < 6) {
        $("#suggestionResult").append(".");
        nDot += 1;
    } else {
        $("#suggestionResult").text("Loading");
        nDot = 0;
    }
}

function stopLoading() {
    clearInterval(loading);
    $("#suggestionResult").text("We suggest you go home.");
}

function cancelReservation(event) {
    let idlist = event.target.id.split("+");
    let time = moment(Number(idlist[0])).format("MM-DD-YYYY h a");
    let table = idlist[1].replace(/(-)+/g,' ');
    let text = "Are you sure to cancel you reservation on " + time + " at " + table + "?";
    if (confirm(text)) {
        let param = {time: idlist[0], table: table}
        let id = event.target.id.replace("+", "\\+");
        $.post("/cancelReservation", param, function() {
            $("#" + id).parent().remove();
            let resdiv = $("#reservation");
            if (resdiv.children().length == 0) resdiv.append("You don't have any reservations.");
            alert("Success");
        })
    }
}

$(document).ready(function() {
    dashboard.init();
});
