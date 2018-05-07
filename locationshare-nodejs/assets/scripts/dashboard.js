'use strict';

var dashboard = {};

function simulateSwipeCardOut(itself) {
    if(itself === undefined) 
        return;

    let leaveInfo = {}, tabID = $(itself).attr('id').substring(0, $(itself).attr('id').indexOf('-'));
    leaveInfo["tabID"] = tabID;
    $.post("/simulateSwipeCardOut", leaveInfo, function(result) {
        if (result.status === -1) {
            window.location.replace("/login");
        }else if (result.status === 5) {
            alert("Leaving table " + tabID + " failure");
        }else if(result.status === 1) {
            console.log("swipeout:", tabID);

            let buttonin = $(itself).prev();
            $(itself).remove();
            buttonin.show();
            $("#library-status").find("button").each(function(){
                $(this).attr("disabled", false);
            });
        }
    });
};

function simulateSwipeCardIn(libID) {
    if (libID === undefined)
        return;

    let occupyInfo = {};
    occupyInfo["libID"] = libID;
    $.post("/simulateSwipeCardIn", occupyInfo, function(result) {
        if (result.status === -1) {
            window.location.replace("/login");
        }else if (result.status === 3) {
            alert("Library " + libID + " is full");
        }else if (result.status === 5) {
            alert("swipe in failure");
        }else if (result.status === 1) {
            console.log("swipein:", result.tabID);

            let tabID = result.tabID;
            let buttonin = $("#" + libID + "-btnin"), buttonout = $("<button>").attr("id", tabid + "-btnout").attr("onclick", "simulateSwipeCardOut(this)").text("Leave");
            $(buttonin).hide().after(buttonout);
            $("#library-status").find("button").each(function(){
                $(this).attr("disabled", true);
            });
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
        let libs = result["libraries"], occupation = result["occupation"];
        let libTable = $("#library-status");
        let ths = "<th>Libraries</th><th>Status</th><th>Swipe Card</th>";
        let thead = $("<thead>").append($("<tr>").append(ths));
        let tbody = $("<tbody>");
        
        for (let i = 0; i < libs.length; i++) {
            let td1 = $("<td>").text(libs[i].libName);
            let td2 = $("<td>").attr("id", libs[i].libID + "-taken").append($("<span>")).append("/").append($("<span>").text(libs[i].libCapacity));
            let td3 = $("<td>").append($("<button>").attr("id", libs[i].libID + "-btnin").attr("onclick", 'simulateSwipeCardIn(\"' + libs[i].libID + '\")').text("occupy"));
            tbody.append($("<tr>").append(td1).append(td2).append(td3));
            libraries.push(libs[i].libName);
            capList.push(libs[i].libCapacity);
        }

        libTable.append(thead).append(tbody);

        if (occupation.libID != undefined) {
            $("#library-status").find("button").each(function(){
                $(this).attr("disabled", true);
            });
            let btn = $("<button>").attr("id", occupation.tabID + "-btnout").attr("onclick", "simulateSwipeCardOut(this)").text("Leave");
            $("#" + occupation.libID + "-btnin").hide().after(btn);
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
        let resdiv = $("#reservation");
        if (result.length == 0) {
            resdiv.append("You don't have any reservation.");
        } else {
            for (let t in result) {
                let time = moment(Number(t)).format("M-D h a");
                let id = t + "+" + result[t].replace(/( )+/g,"-");
                let span = $("<span>").addClass("list-group-item").attr("id", id + "+span").
                    html("<span style=\"float:left;\">" + time + ": " + result[t] + "</span>").appendTo(resdiv);
                let a = $("<a>").attr("id", id).
                    attr("href", "#").css({"float": "right"}).text("Cancel").
                    click(cancelReservation).appendTo(span);
            }
        }
    });
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
            alert("Success");
        })
    }
}

$(document).ready(function() {
    dashboard.init();
});
