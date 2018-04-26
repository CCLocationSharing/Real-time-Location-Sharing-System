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

        for (let libID in libs) {
            let td1 = "<td >" + libs[libID] + "</td>";
            let td2 = "<td id=" + libID + "-taken></td>";
            libTable.append("<tr>"+ td1 + td2 +"</tr>");
            libraries.push(libs[libID])
        }
        libTable.append("</tbody>");

        $.get("/libraryStatus", function(takens) {
            for (let libID in libs) {
                let text = takens[libID].taken + "/" + takens[libID].capacity;
                $("#" + libID + "-taken").text(text);
                takenList.push(takens[libID].taken);
                capList.push(takens[libID].capacity);
            }
            libChart.update();
        });
        libChart.update();
    });
}

$(document).ready(function() {
    dashboard.init();
});
