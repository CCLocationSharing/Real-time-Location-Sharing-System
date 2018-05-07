'use strict';

var dashboard = {};

function simulateBrushCardOut(itself) {
    if(itself === undefined || itself === null) 
        return;

    let leaveInfo = {};
    let idstr = $(itself).attr('id');
    let tabID = idstr.substring(0, idstr.indexOf('-'));
    leaveInfo["tabID"] = tabID;
    leaveInfo["time"] = moment().valueOf();
    $.post("simulateBrushCardOut", leaveInfo, function(result) {
        if (result.status === 5) {
            alert("Leaving table " + tabID + " failure");
        }else if(result.status === 1) {
            console.log("brushout:", tabID);
            let buttonin = $(itself).prev();
            $(itself).remove();
            buttonin.show();
            $("#library-status").find("button").each(function(){
                $(this).attr("disabled", false);
            });
        }
    });
};

function simulateBrushCardIn(libID) {
    if (libID === undefined || libID === null)
        return;

    let occupyInfo = {};
    occupyInfo["libID"] = libID;
    occupyInfo["time"] = moment().valueOf();
    $.post("/simulateBrushCardIn", occupyInfo, function(result) {
        if (result.status === 3) {
            alert("Library " + libID + " is full");
        }else if (result.status === 5) {
            alert("brush in failure");
        }else if (result.status === 1) {
            console.log("brush In", result.tabID);
            let tabid = result.tabID;
            let buttonname = "#" + libID + "-btnin";
            $(buttonname).hide();
            $("#library-status").find("button").each(function(){
                $(this).attr("disabled", true);
            });
            let buttonout = $("<button>").attr("id", tabid + "-btnout").attr("onclick", "simulateBrushCardOut(this)").text("Leave");
            $(buttonname).after(buttonout);
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
    
    $.get("/libraryCapacity", function(libs) {
        let libTable = $("#library-status");
        let thead = "<thead><tr><th>Libraries</th><th>Status</th><th>Brush Card</th></tr></thead>";
        libTable.append(thead);
        libTable.append("<tbody>");

        for (let i = 0; i < libs.length; i++) {
            let td1 = "<td >" + libs[i].libName + "</td>";
            let td2 = "<td id=" + libs[i].libID + "-taken><span></span><span>" + "/" + libs[i].libCapacity + "</span></td>";
            let td3 = "<td><button id=\"" + libs[i].libID + "-btnin\" onclick=\'simulateBrushCardIn(\"" + libs[i].libID + "\")\'>occupy</button></td>";
            libTable.append("<tr>"+ td1 + td2 + td3 + "</tr>");
            libraries.push(libs[i].libName);
            capList.push(libs[i].libCapacity);
        }
        libTable.append("</tbody>");

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
