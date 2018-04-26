'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dashboard = require("./dashboard");

let tableCoord = {}, occupiedCoord = [];

// Get tables' coordinates
var scanTable = {
    TableName: "Tables",
    ProjectionExpression: "tabID, longitude, latitude",
};

docClient.scan(scanTable, function(err, data) {
	if (err) throw err;

	tableCoord = {}
	data.Items.forEach(item => {
		tableCoord[item.tabID] = {
			"longitude": item.longitude,
			"latitude": item.latitude
		};
	});
});

// Periodically update Status
updateHeat();
setInterval(updateHeat, 5000);

function updateHeat() {
	let occupied = dashboard.returnOccupancy();
	occupiedCoord = [];
	occupied.forEach(tabID => occupiedCoord.push(tableCoord[tabID]));
}

exports.getHeatData = function(req, res) {
    return res.send(occupiedCoord);
}
