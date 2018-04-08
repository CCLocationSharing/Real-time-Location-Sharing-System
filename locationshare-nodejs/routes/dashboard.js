'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.getLibraryCapacity = function(req, res) {
    var libQuery = {
	    TableName: "Libraries",
	    ProjectionExpression: "libID, libName, libCapacity",
	};

	docClient.scan(libQuery, function(err, libraries) {
		if (err) throw err;
		res.json(libraries.Items);
	});
}

exports.getLibraryStatus = function(req, res) {
    var libTakenQuery = {
	    TableName: "LibraryAvailability",
	    ProjectionExpression: "libID, taken",
	};

	docClient.scan(libTakenQuery, function(err, taken) {
		if (err) throw err;
		res.json(taken.Items);
	});
}

/*exports.getFriendList = function(req, res) {

}*/