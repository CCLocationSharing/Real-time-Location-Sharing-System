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
var io = require("socket.io")(http);
var crypto = require("crypto");

var getTablesFromLib = function(libid) {
    var tables = {
        TableName: "Tables",
        ProjectionExpression:"tabID",
        KeyConditionExpression: "#lb = :id",
        ExpressionAttributeNames:{
            "#lb": "libID"
        },
        ExpressionAttributeValues: {
            ":id": libid
        }
    }

    let tableList = []

    docClient.query(params, function(err, data) {
        if(err) {
            throw err;
        } else {
            data.Items.forEach(function(item) {
                tableList.push(item.tabID);
            });
        }
    });

    return tableList;
}

var getDefaultTimeSections = function() {
    let timeSection = []
    for(let j = 0; j < 15; j++) {
        let section = {};
        section["timesection"] = j + 8;
        section["reservable"] = true;
        timeSection[j] = section;
    }

    return timeSection;
}

var getDefaultDates = function(currTime) {
    let dates = {}
    dates["dates"] = [];

    let currDay = currTime.dayOfYear();
    let currHour = currTime.hour();

    for(let i = 0; i < 5; i++) {
        let thisDay = {};
        thisDay["day"] = currDay + i;
        thisDay["timesections"] = getDefaultTimeSections();
        dates[i] = thisDay;
    }

    //modify today
    //dates[0]
    $.each(dates[0].timesections, function(i, value, array) {
        if(array[i].timesection <= currHour) {
            array[i].reservable = false;
        }
    });

    return dates;
}

exports.getReservation = function(req, res) {
    let libid = req.body.lib;
    let tableList = getTablesFromLib(libid);

    let currTime = moment();
    let currDay = currTime.dayOfYear();
    let thirtyMBefore = currTime.subtract(30, 'minute');
    let queryTime = thirtyMBefore.milliseconds();
    let queryHour = thirtyMBefore.hour();

    //get the default json result
    let dates = getDefaultDates(currTime);

    for(let i = 0; i < tableList.length; i++) {
        let tabid = tableList[i];
        let param = {
            TableName: "Reservations",
            ProjectionExpression:"startTime, endTime",
            KeyConditionExpression: "#tb = :id and #et >= :qt",
            ExpressionAttributeNames:{
                "#tb": "tabID",
                "#et": "endTime"
            },
            ExpressionAttributeValues: {
                ":id": tabid,
                ":qt": queryTime
            }
        }

        docClient.query(param, function(err, data) {
            if(err) {
                throw err;
            } else {
                //forbidden these time sections
                data.Items.forEach(function(item) {
                    let day = moment().millisecond(item.startTime).dayOfYear();
                    let start = moment().millisecond(item.startTime).hour();
                    let end = moment().millisecond(item.endTime).hour();

                    let index = day - currDay;
                    if(index < 0) {
                        console.log("get invalid query items");
                        return res.json({status: 1});
                    }else {
                        if(dates[index].day != day) {
                            console.log("get wrong query items");
                            return res.json({status: 1});
                        }else {
                            for(let k = start; k <= end; k++) {
                                //k - 8
                                dates[index].timesections[k - 8].reservable = false;
                            }
                        }
                    }
                });
            }
        });
    }
    return res.json(dates);
}

exports.postReservation = function(req, res) {
    if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }

    //let reservations = JSON.parse(req.body.reservations);

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
