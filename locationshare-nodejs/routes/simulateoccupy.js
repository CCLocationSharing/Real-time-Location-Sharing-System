'use strict'

var moment = require('moment');
var async = require('async');
var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});
var docClient = new AWS.DynamoDB.DocumentClient();

var capacities = {"carpenter": 56, "olin": 200, "uris":125, "gates":20, "mann":60, "law": 35};
var namePrefixes = {"carpenter": "CH", "olin": "OL", "uris":"UL", "gates":"GATES", "mann":"MANN", "law": "LAW"};

function shuffle(array) {
	for(let i = array.length; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = array[j];
		array[j] = array[i-1];
		array[i-1] = temp;
	}
	return array;
};

function implementOccupy(tables, index, user, time, res) {
	let param = {
        TableName: "Tables",
        Key: {"tabID": tables[index]},
        UpdateExpression: "set #o = :a",
        ConditionExpression:"#o = :b",
        ExpressionAttributeNames: {"#o": "occupied"},
        ExpressionAttributeValues: {":a": true, ":b": false}
    };
    docClient.update(param, function(err, data) {
        if (err) {
        	if (index + 1 >= tables.length) {
        		return res.send({status: 3});
        	}else {
        		implementOccupy(tables, index + 1, user, time, res);
        	}
        }else{
        	let occupation = {
        		TableName: "Tables",
        		Key: {"tabID": tables[index]},
        		UpdateExpression: "set #occupation = :map",
        		ExpressionAttributeNames: {"#occupation": "occupation"},
        		ExpressionAttributeValues: {":map": {"username": user, "startTime": time}}
        	}
        	docClient.update(occupation, function(err, data) {
        		if (err) {
        			//brush in failed
        			return res.send({status: 5});
        		}else {
        			//brush in succeed
        			return res.send({status: 1, tabID: tables[index]});
        		}
        	});
        }
    });
}

exports.brushCardIn = function (req, res) {
	if (req.session.user === undefined) {
        return res.send({status: -1});
    }

    if (req.body.time === undefined || req.body.libID === undefined) {
    	return res.status(400).send("parameters missing");
    }

	let user = req.session.user.username;
	let time = req.body.time, libid = req.body.libID;
	let capacity = capacities[libid], nameprefix = namePrefixes[libid];
	let alltables = [];

	for (let i = 0; i < capacity; i++) {
		alltables.push(nameprefix + i);
	}

	alltables = shuffle(alltables);
	implementOccupy(alltables, 0, user, time, res);
}

exports.brushCardOut = function (req, res) {
	if (req.session.user === undefined) {
        return res.send({status: -1});
    }

    if (req.body.time === undefined || req.body.tabID === undefined) {
    	return res.status(400).send("parameters missing");
    }

    let user = req.session.user.username;
	let time = req.body.time, tabid = req.body.tabID;

	let release = {
        TableName: "Tables",
        Key: {"tabID": tabid},
        UpdateExpression: "set #occupied = :a, occupation.#key = :b",
        ConditionExpression:"occupation.#user = :c",
        ExpressionAttributeNames: {"#occupied": "occupied", "#key": "endTime", "#user": "username"},
        ExpressionAttributeValues: {":a": false, ":b": time, ":c": user}
    };
    docClient.update(release, function(err, data) {
        if (err) {
        	//brush out failed
        	return res.send({status: 5});
        }else {
        	//brush in succeed
        	return res.send({status: 1});
        }
    });
}