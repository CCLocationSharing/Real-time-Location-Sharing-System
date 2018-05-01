'use strict';

var dashboard = {};

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
        let thead = "<thead><tr><th>Libraries</th><th>Status</th></tr></thead>";
        libTable.append(thead);
        libTable.append("<tbody>");

        for (let i = 0; i < libs.length; i++) {
            let td1 = "<td >" + libs[i].libName + "</td>";
            let td2 = "<td id=" + libs[i].libID + "-taken></td>";
            libTable.append("<tr>"+ td1 + td2 +"</tr>");
            libraries.push(libs[i].libName)
        }
        libTable.append("</tbody>");

        $.get("/libraryStatus", function(takens) {
            for (let i = 0; i < libs.length; i++) {
                let libID = libs[i].libID;
                let text = takens[libID].taken + "/" + takens[libID].capacity;
                $("#" + libID + "-taken").text(text);
                takenList.push(takens[libID].taken);
                capList.push(takens[libID].capacity);
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
                    text(time + ": " + result[t]).appendTo(resdiv);
                let a = $("<a>").attr("id", id).
                    attr("href", "#").css({float: "right"}).text("Cancel").
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
        let param = {time: idlist[0], table: idlist[1]}
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
