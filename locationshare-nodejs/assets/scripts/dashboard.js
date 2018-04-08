'use strict';

var dashboard = {};

dashboard.init = function() {
    var socket = io.connect();

    let libTable = $("#library-status");
    let libIDToRow = [];
    $.get("/libraryCapacity", function(result) {
        for (let i = 0; i < result.length; i++) {
            let libID = result[i].libID, name = result[i].libName;
            let cap = result[i].libCapacity;
            let td1 = "<td id=" + libID + ">" + name + "</td>";
            let td2 = "<td cap=" + cap + "></td>";
            libTable.append("<tr>"+ td1 + td2 +"</tr>");
            libIDToRow[result[i].libID] = i + 1;
        }

        $.get("/libraryStatus", function(result) {
            for (let i = 0; i < result.length; i++) {
                let row = libIDToRow[result[i].libID];
                let td = libTable.find("tr").eq(row).find("td").eq(1);
                td.text(result[i].taken + "/" + td.attr("cap"));
            }
        });
    });

    /*let usernameToRow = [];
    $.get("/friendList", function(result) {
        
    }*/
}

$(document).ready(function() {
    dashboard.init();
});
