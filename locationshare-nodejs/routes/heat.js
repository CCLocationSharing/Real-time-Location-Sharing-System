'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dashboard = require("./dashboard");

let tableCoord = {};

// Get tables' coordinates
var scanTable = {
    TableName: "Libraries",
    ProjectionExpression: "libID, longitude, latitude",
};

docClient.scan(scanTable, function(err, data) {
	if (err) throw err;

	tableCoord = {}
	data.Items.forEach(item => {
		tableCoord[item.libID] = {
			"longitude": item.longitude,
			"latitude": item.latitude
		};
	});
});

exports.getHeatData = function(req, res) {
	let status = dashboard.returnStatus();
    return res.send({coords: tableCoord, status: status});
}
