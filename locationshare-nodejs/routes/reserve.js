'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var moment = require('moment');
var async = require('async');

/**
 * get results in json for render
 * @function
 * @param {String} url- url from get method, @param {Array} tableList - consists of reservable tables for the given library, @param res - HTTP RES
 */
var getTableElements = function(req, res, tableList) {

    async.map(tableList, function(tabid, callback) {
        let param = {
            TableName: "Tables",
            ProjectionExpression:"reservable, reserved",
            KeyConditionExpression: "#tb = :id",
            ExpressionAttributeNames:{
                "#tb": "tabID"
            },
            ExpressionAttributeValues: {
                ":id": tabid
            }
        };
        docClient.query(param, function(err, data) {
            if (err) throw err;
            let reserved = [];
            if (data.Items[0].reservable === true)
                callback(err, {"table": tabid, "reserved": data.Items[0].reserved});
            else {
                callback(err, null);
            }
        });
    }, function(err, data) {
        if (err) throw err;
        let results = [];
        data.forEach(table => {if (table !== null) results.push(table)});
        return res.json(results);
    }); 
}

exports.getRender = function(req, res) {
    let libid = req.query.library;
    
    if (libid === undefined) {
        return res.status(400).send("Missing libid");
    }

    var tables = {
        TableName: "Libraries",
        ProjectionExpression:"tables",
        KeyConditionExpression: "#lb = :id",
        ExpressionAttributeNames:{
            "#lb": "libID"
        },
        ExpressionAttributeValues: {
            ":id": libid
        }
    }

    docClient.query(tables, function(err, data) {
        if(err) throw err;
        
        let tableList = data.Items[0].tables;
        getTableElements(req, res, tableList);
    });
}

exports.postReservation = function(req, res) {
    if (req.session.user === undefined) {
        return res.status(401).send("Please log in first.");
    }
    let table = req.body.tabID;
    let starttime = moment(Number(req.body.startTime));
    let endtime = moment(Number(req.body.endTime));

    if(table === undefined || table === "" || 
        starttime === undefined || endtime === undefined) {
        return res.status(400).send("You didn't select any time slot.");
    }

    let reserve;
    if (starttime.hour() === endtime.hour()) reserve = [starttime.valueOf()];
    else reserve = [starttime.valueOf(), endtime.startOf("hour").valueOf()];
    let param = {
        TableName: "Tables",
        Key: {"tabID": table},
        UpdateExpression: "set #res = list_append(#res, :newres)",
        ExpressionAttributeNames: {"#res": "reserved"},
        ExpressionAttributeValues: {":newres": reserve}
    };    
        
    docClient.update(param, function(err, data) {
        if (err) throw err;
        return res.send("Success");
        /*
            if(data.Count === 0) {
                var reservation = {
                    TableName: "Reservations",
                    Item: {
                        "tabID": table,
                        "endTime": endtime,
                        "startTime": starttime,
                        "username": req.session.user.username,
                        "producedTime": req.body.producedTime
                    }
                };

                docClient.put(reservation, function(err, data) {
                    if(err) {
                        console.log("add item:", err);
                    }else {
                        console.log("Added item:", JSON.stringify(data, null, 2));
                        let IDs = [];
                        let h1 = moment(starttime).hour(), h2 = moment(endtime).hour();
                        let tableStr = table.replace(/( )+/g,"\\-");
                        
                        if(h1 < 10) {
                            IDs.push(tableStr+"\\+0"+h1);
                        }else {
                            IDs.push(tableStr+"\\+"+h1);
                        }

                        if(h1 < h2) {
                            if(h2 < 10) {
                                IDs.push(tableStr+"\\+0"+h2);
                            }else {
                                IDs.push(tableStr+"\\+"+h2);
                            }
                        }
                        return res.json({"IDs": IDs});
                    }
                });
            }else {
                console.log("Fail", JSON.stringify(data, null, 2));
            }*/
    });
}

exports.getReserve = function(req, res) {
    if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }
    res.render("reserve.html", {styles: ["reserve"], scripts: ["reserve"], reserve : "active"});
}