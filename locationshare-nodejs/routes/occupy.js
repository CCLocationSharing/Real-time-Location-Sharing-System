'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

let modifyList = [];

setInterval(updateOccupancy, 60000);

function updateOccupancy() {
    let tempList = modifyList, occupy = new Set(), release = new Set();
    modifyList = [];
    for (let mod in modifyList) {
        if (mod.type === "o") {
            occupy.add(mod.tabID);
            release.remove(mod.tabID);
        } else {
            release.add(mod.tabID);
            occupy.remove(mod.tabID);
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
        console.log("Updated "+tabID+" to be "+toOccupy);
    });
}

exports.postOccupy = function(req, res) {
    if (req.body.tabID === undefined)
        return res.status(400).send("Table ID is not given.");

    modifyList.push({"tabID": tabID, "type": "o"});
}

exports.postRelease = function(req, res) {
    if (req.body.tabID === undefined)
        return res.status(400).send("Table ID is not given.");

    modifyList.push({"tabID": tabID, "type": "r"});
}
