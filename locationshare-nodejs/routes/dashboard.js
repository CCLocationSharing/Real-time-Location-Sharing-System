'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

let libraries = {}
let status = {"carpenter": {"taken": 0}, "olin": {"taken": 0}, "uris": {"taken": 0}, "gates": {"taken": 0}, "mann": {"taken": 0}, "law": {"taken": 0}};

// Get libraries name
var scanTable = {
    TableName: "Libraries",
    ProjectionExpression: "libID, libName, libCapacity, tables",
};

docClient.scan(scanTable, function(err, data) {
	if (err) throw err;

	libraries = data.Items;
});



// Periodically update Status
//updateStatus();
//setInterval(updateStatus, 10000);

function updateStatus() {
	var scanTable = {
	    TableName: "Tables",
	    ProjectionExpression: "libID, tabID, reservable, occupied"
	};

	docClient.scan(scanTable, function(err, taken) {
		if (err) throw err;
		taken.Items.forEach(item => {
			if (!item.reservable && item.occupied) {
				status[item.libID].taken += 1;
			}
		});
	});
}


exports.returnStatus = function() {
	return status;
}

exports.returnLibraries = function() {
	return libraries;
}

exports.getLibraryCapacity = function(req, res) {
	let result = {};
	libraries.forEach(lib => result[lib.libID] = lib.libName);
    return res.send({"libraries": libraries, "occupation": req.session.user.occupation});
}

exports.getLibraryStatus = function(req, res) {
    return res.send(status);
}

exports.getDashboard = function(req, res) {
	if (req.session.user === undefined) return res.redirect("/");
	res.render("dashboard.html", {styles: ["dashboard"], home : "active", occupation: req.session.user.occupation});
}

exports.getUserReservation = function(req, res) {
	if (req.session.user === undefined) return res.redirect("/login");

	let param = {
        TableName: "Users",
        Key: {"username": req.session.user.username},
        ProjectionExpression: "reservation"
    }; 

    docClient.get(param, function(err, data) {
        if (err) throw err;
        return res.send(data.Item.reservation);
    });
}