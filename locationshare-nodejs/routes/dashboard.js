'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

let libraries = {}, status = {}, occupied = new Set();

// Get libraries name
var scanTable = {
    TableName: "Libraries",
    ProjectionExpression: "libID, libName, tables",
};

docClient.scan(scanTable, function(err, data) {
	if (err) throw err;

	libraries = data.Items;
});

// Periodically update Status
updateStatus();
setInterval(updateStatus, 10000);

function updateStatus() {
	var scanTable = {
	    TableName: "Tables",
	    ProjectionExpression: "libID, tabID, tabCapacity, occupied"
	};

	docClient.scan(scanTable, function(err, taken) {
		if (err) throw err;

		status = {};
		occupied = new Set();
		taken.Items.forEach(item => {
			if (status[item.libID] === undefined)
				status[item.libID] = {"capacity": 0, "taken": 0};
			if (item.occupied === true) 
				status[item.libID].taken += item.tabCapacity;
			status[item.libID].capacity += item.tabCapacity;

			if (item.occupied)
				occupied.add(item.tabID);
		});
	});
}


exports.returnOccupancy = function() {
	return occupied;
}

exports.returnLibraries = function() {
	return libraries;
}

exports.getLibraryCapacity = function(req, res) {
	let result = {};
	libraries.forEach(lib => result[lib.libID] = lib.libName);
    return res.send(libraries);
}

exports.getLibraryStatus = function(req, res) {
    return res.send(status);
}

exports.getDashboard = function(req, res) {
	if (req.session.user === undefined) return res.redirect("/");
	res.render("dashboard.html", {styles: ["dashboard"], home : "active"});
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