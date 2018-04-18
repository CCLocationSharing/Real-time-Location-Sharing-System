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

/**
 * get all libIDs for the given library
 * @function
 * @param {String} libid - HashKey libID for db query
 */
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
    };

    let tableList = [];

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

/**
 * generate default json array for "timesections": [{"timesection": , "reservable": }]
 * @function
 */
var getDefaultTimeSections = function() {
    let timeSection = [];
    for(let j = 0; j < 15; j++) {
        let section = {};
        section["timesection"] = j + 8;
        section["reservable"] = true;
        timeSection[j] = section;
    }

    return timeSection;
}

/**
 * generate default json object {"day": , "timesections": json array}
 * @function
 */
var getDefaultDate = function(time) {
    let date = {};

    let day = time.dayOfYear();
    let hour = time.hour();

    date["day"] = day;
    date["timesections"] = getDefaultTimeSections();

    //if time == today then modify today
    let today = moment().dayOfYear();
    if(day == today) {
        $.each(date.timesections, function(i, value, array) {
            if(array[i].timesection <= hour) {
                array[i].reservable = false;
            }
        });
    }
    return date;
}

exports.getRender = function(req, res) {
    let libid = req.body.library;
    let tableList = getTablesFromLib(libid);

    //query time variables
    //Date: moment, Day: the day of the year range 1-366
    //Hour: hour of the day range 0-23, Time: milliseconds
    let queryDate = req.body.date;
    let queryDay = queryDate.dayOfYear(), queryHour, queryTime;
    let endOfDay = moment(queryDate).hour(23).millisecond();
    let today = moment().dayOfYear();

    if(queryDay < today || queryDay - today > 4) {
        console.log("invalid query date.")
        return res.json({status: 1});
    }

    if(queryDay == today) {
        // must make reservations 30 mins before
        let thirtyMBefore = queryDate.subtract(30, 'minute');
        queryHour = thirtyMBefore.hour();
        queryTime = thirtyMBefore.milliseconds();
    }else {
        queryDate.hour(7);
        queryHour = queryDate.hour();
        queryTime = queryDate.milliseconds();
    }


    items = []
    for(let i = 0; i < tableList.length; i++) {
        let tabid = tableList[i];
        let param = {
            TableName: "Reservations",
            ProjectionExpression:"startTime, endTime",
            KeyConditionExpression: "#tb = :id and #et between :qt and :ed",
            FilterExpression: "#r = :a",
            ExpressionAttributeNames:{
                "#tb": "tabID",
                "#et": "endTime",
                "#r": "reservable"
            },
            ExpressionAttributeValues: {
                ":id": tabid,
                ":qt": queryTime,
                ":ed": endOfDay,
                ":a": true
            }
        };

        let date = getDefaultDate(queryDate);
        //those existing reservations between querytime and the end of day
        docClient.query(param, function(err, data) {
            if(err) {
                throw err;
            } else {
                if(!data.Items) {
                    return res.json(date);
                }

                //forbidden these time sections
                data.Items.forEach(function(item) {
                    let start = moment().millisecond(item.startTime).hour();
                    let end = moment().millisecond(item.endTime).hour();
                    for(let k = start; k <= end; k++) {
                        date.timesections[k - 8].reservable = false;
                    }
                });
            }
        });

        let item = {
            "table": tabid,
            "data": date
        };

        items.push(item);
    }
    return res.json(items);
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
