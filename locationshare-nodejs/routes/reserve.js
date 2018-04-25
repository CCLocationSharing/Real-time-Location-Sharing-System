'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var express = require('express');
var app = express();
var http = require("http").Server(app);
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
            ProjectionExpression:"reserved",
            KeyConditionExpression: "#tb = :id",
            ExpressionAttributeNames:{
                "#tb": "tabID"
            },
            ExpressionAttributeValues: {
                ":id": tabid
            }
        };
        docClient.query(param, function(err, data) {
            callback(err, {"table": tabid, "reserved": data.Items[0].reserved});
        });
    }, function(err, results) {
        if (err) throw err;
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
    var param = {
        TableName: "Tables",
        Key: {"tabID": table},
        UpdateExpression: "set #res = list_append(#res, :newres)",
        ExpressionAttributeNames: {"#res": "reserved"},
        ExpressionAttributeValues: {
            ":newres": reserve
        }
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



/*
exports.postAdminUpdate = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login?from=dashboard");
    if (req.session.user.type !== "admin") return res.send({status: 1});
    let cells = JSON.parse(req.body.cells);
    for (let i = 0; i < cells.length; i++)
        cells[i] = new Date(cells[i]);
    Timetable.remove({date: {$in: cells}}, function(err, results) {
        if (req.body.username !== "" || req.body.course !== "") {
            let inserts = [];
            for (let i = 0; i < cells.length; i++) {
                inserts.push({date: cells[i], username: req.body.username, course: req.body.course, order_date: new Date()});
            }
            Timetable.collection.insert(inserts, function(err, result) {
                return res.send({status: 0});
            });
        }
    });
}

exports.postOrder = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login?from=dashboard");

    let new_order_json = JSON.parse(JSON.stringify(req.body));
    console.log(new_order_json);
    res.send({status: 1});


    let transporter = nodemailer.createTransport({
         service: 'QQ', // no need to set host or port etc.
         auth: {
             user: '525916424@qq.com',
             pass: 'wkwpiumfvijnbhda'
         }
    });

    let mailOptions = {
        from: '"UTop Tutor 👻" <525916424@qq.com>',
        to: 'utoptutoring@gmail.com',
        subject: 'UTop Tutor - Order Confirmation ✔',
        html: '<b>To be implemented</b>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error);
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
*/
/*    new_post.save(function(err, result) {
        if (err) throw err;
        res.send({status: 0});
    });

};
*/
