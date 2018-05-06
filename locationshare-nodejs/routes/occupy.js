'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
var moment = require('moment');

var docClient = new AWS.DynamoDB.DocumentClient();

let modifyList = [];

setInterval(updateOccupancy, 5000);

function updateOccupancy() {
    let tempList = modifyList, occupy = new Set(), release = new Set();
    modifyList = [];
    for (let i = 0; i < tempList.length; i++) {
        let mod = tempList[i];
        if (mod.type === "o") {
            occupy.add(mod.tabID);
            release.delete(mod.tabID);
        } else {
            release.add(mod.tabID);
            occupy.delete(mod.tabID);
        }
    }
    occupy.forEach(tabID => {updateOccupancyDB(tabID, true);});
    release.forEach(tabID => {updateOccupancyDB(tabID, false);});
}

function updateOccupancyDB(tabID, toOccupy) {
    let param = {
        TableName: "Tables",
        Key: {"tabID": tabID},
        UpdateExpression: "set #o = :a",
        ExpressionAttributeNames: {"#o": "occupied"},
        ExpressionAttributeValues: {":a": toOccupy}
    };

    docClient.update(param, function(err, data) {
        if (err) throw err;
        //console.log("Updated "+tabID+" to be "+toOccupy);
    });
}

let n = 0;
setInterval(() => {
    if (n != 0) {
        let now = moment();
        console.log(now.format() + ": " + process.env.PORT + ": received " + n + " occupy requests.");
        n = 0;
    }
}, 1000);

exports.postOccupy = function(req, res) {
    n += 1;
    if (req.body.tabID === undefined) {
        modifyList.push({"tabID": "CH 002", "type": "o"});
        return res.send("Success");
    }

    modifyList.push({"tabID": req.body.tabID, "type": req.body.type});
    return res.send("Success");
}
