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

function implementOccupy(tables, index, user, res, libid) {
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
        		implementOccupy(tables, index + 1, user, res, libid);
        	}
        }else{
        	let updateOccupationAtUsers = {
        		TableName: "Users",
        		Key: {"username": user},
        		UpdateExpression: "set #occupation = :map",
        		ExpressionAttributeNames: {"#occupation": "occupation"},
        		ExpressionAttributeValues: {":map": {"libID": libid, "tabID": tables[index]}}
        	}

        	docClient.update(updateOccupationAtUsers, function(err, data) {
        		if (err) {
        			//failed
        			return res.send({status: 5});
        		}else {
        			//succeed
                    res.locals.session.user.occupation = {"libID": libid, "tabID": tables[index]};
        			return res.send({status: 1, tabID: tables[index]});
        		}
        	});
        }
    });
}

exports.swipeCardIn = function (req, res) {
	if (req.session.user === undefined) {
        return res.send({status: -1});
    }

    if (req.body.libID === undefined) {
    	return res.status(400).send("parameters missing");
    }

	let user = req.session.user.username;
    let libid = req.body.libID;
	let capacity = capacities[libid], nameprefix = namePrefixes[libid];
	let alltables = [];

	for (let i = 0; i < capacity; i++) {
		alltables.push(nameprefix + i);
	}

	implementOccupy(alltables, 0, user, res, libid);
};

exports.swipeCardOut = function (req, res) {
	if (req.session.user === undefined) {
        return res.send({status: -1});
    }

    if (req.body.tabID === undefined) {
    	return res.status(400).send("parameters missing");
    }

    let user = req.session.user.username;
    let tabid = req.body.tabID;
	let release = {
        TableName: "Tables",
        Key: {"tabID": tabid},
        UpdateExpression: "set #occupied = :a",
        ExpressionAttributeNames: {"#occupied": "occupied"},
        ExpressionAttributeValues: {":a": false}
    };
    docClient.update(release, function(err, data) {
        if (err) {
        	return res.send({status: 5});
        }else {
        	let updateOccupationAtUsers = {
                TableName: "Users",
                Key: {"username": user},
                UpdateExpression: "set #occupation = :map",
                ExpressionAttributeNames: {"#occupation": "occupation"},
                ExpressionAttributeValues: {":map": {}}
            }
            docClient.update(updateOccupationAtUsers, function(err, data) {
                if (err) {
                    throw err;
                }else {
                    res.locals.session.user.occupation = {};
                    return res.send({status: 1});
                }
            });
        }
    });
}