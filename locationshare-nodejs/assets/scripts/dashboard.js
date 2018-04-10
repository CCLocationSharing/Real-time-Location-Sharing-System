'use strict';

var dashboard = {};

dashboard.init = function() {
    var socket = io.connect();

    let libTable = $("#library-status");
    let libIDToRow = [];

    let thead = "<thead><tr><th>Libraries</th><th>Status</th></tr></thead>";
    libTable.append(thead);
    libTable.append("<tbody>");

    $.get("/libraryCapacity", function(result) {
        for (let i = 0; i < result.length; i++) {
            capList[i] = result[i].libCapacity;
            let libID = result[i].libID, name = result[i].libName;
            let cap = result[i].libCapacity;
            let td1 = "<td id=" + libID + ">" + name + "</td>";
            let td2 = "<td cap=" + cap + "></td>";
            libTable.append("<tr>"+ td1 + td2 +"</tr>");
            libIDToRow[result[i].libID] = i + 1;
        }

        $.get("/libraryStatus", function(result) {
            for (let i = 0; i < result.length; i++) {
                takenList[i] = result[i].taken;
                let row = libIDToRow[result[i].libID];
                let td = libTable.find("tr").eq(row).find("td").eq(1);
                td.text(result[i].taken + "/" + td.attr("cap"));
            }
            libChart.update();
        });
        libChart.update();
    });

    libTable.append("</tbody>");
}

$(document).ready(function() {
    dashboard.init();
});
