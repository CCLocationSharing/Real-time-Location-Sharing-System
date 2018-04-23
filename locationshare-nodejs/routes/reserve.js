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
var getTableElements = function(url, tableList, res) {

    if(tableList === undefined) {
        console.log("undefined param @tableList");
        return;
    }

    let dateParam = getUrlParam(url, "date");
    //@param {moment Object}
    let queryDate = moment(dateParam);
    //@param {Number}
    let queryDay = queryDate.dayOfYear(), queryHour, queryTime;
    //@param {Number} representing epoch time
    let endOfDay = moment(queryDate).hour(23).valueOf();
    //@param {Number}
    let today = moment().dayOfYear();

    if(queryDay < today || queryDay - today > 6) {
        console.log("invalid query date.", queryDay, today);
        return;
    }
    if(queryDay == today) {
        let thirtyMBefore = queryDate.subtract(30, 'minute');
        queryHour = thirtyMBefore.hour();
        queryTime = thirtyMBefore.valueOf();
    }else {
        queryDate.hour(7);
        queryHour = queryDate.hour();
        queryTime = queryDate.valueOf();
    }

    async.map(tableList, function(tabid, callback) {
        let param = {
            TableName: "Reservations",
            ProjectionExpression:"startTime, endTime",
            KeyConditionExpression: "#tb = :id and #et between :qt and :ed",
            ExpressionAttributeNames:{
                "#tb": "tabID",
                "#et": "endTime"
            },
            ExpressionAttributeValues: {
                ":id": tabid,
                ":qt": queryTime,
                ":ed": endOfDay
            }
        };

        let date = getDefaultDate(queryDate);

        docClient.query(param, function(err, data) {
            if(err) {
                console.log("err when querying if the specific table is reserved in a time period:",err);
            }else {
                if(!data.Items) {
                    let item = {
                        "table": tabid,
                        "data": date
                    };
                    callback(null,item);
                }else {
                    data.Items.forEach(function(item) {
                        let start = moment(item.startTime).hour();
                        let end = moment(item.endTime).hour();
                        for(let k = start; k <= end; k++) {
                            date.timesections[k - 8].reservable = false;
                        }
                    });
                    let item = {
                        "table": tabid,
                        "data": date
                    };
                    callback(null,item);
                }
            }
        });
    }, function(err, results) {
        if(err) {
            throw err;
        } else {
            if(results === undefined) {
                return;
            }else {
                return res.json(results);
            }
        }
    }); 
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

    timeSection[0].timesection = "0" + timeSection[0].timesection;
    timeSection[1].timesection = "0" + timeSection[1].timesection;
    return timeSection;
};

/**
 * generate default json object {"day": , "timesections": json array}
 * @function
 * @param {moment Object} time
 */
var getDefaultDate = function(time) {
    let date = {};
    let day = time.dayOfYear();

    date["day"] = day;
    date["timesections"] = getDefaultTimeSections();

    //if time == today then modify today
    let today = moment().dayOfYear();
    if(day == today) {
        let hour = time.hour();
        date.timesections.forEach(function(item) {
            if(item.timesection <= hour) {
                item.reservable = false;
            }
        });
    }
    return date;
};

/**
 * get two params from url
 * @function
 */
var getUrlParam = function(url, name) {  
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
    let r = url.substr(17).match(reg); 

    if (r != null) {
        return unescape(r[2]); 
    }else {
        return null; 
    }   
};


exports.getRender = function(req, res) {
    let url = req.url;    
    let libid = getUrlParam(url, "library");

    if(libid === undefined || libid === null) {
        console.log("lacking library ID");
        return;
    }

    var tables = {
        TableName: "Tables",
        ProjectionExpression:"tabID",
        KeyConditionExpression: "#lb = :id",
        FilterExpression: "#r = :a",
        ExpressionAttributeNames:{
            "#lb": "libID",
            "#r": "reservable"
        },
        ExpressionAttributeValues: {
            ":id": libid,
            ":a": true
        }
    }

    docClient.query(tables, function(err, data) {
        if(err) {
            console.log("err when querying tables from given library:", err);
        } else {
            let tableList = [];
            data.Items.forEach(function(item) {
                tableList.push(item.tabID);
            });
            getTableElements(url, tableList, res);
        }
    });
}

exports.postReservation = function(req, res) {
    if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }

    let tabid = req.body.tabID;
    let starttime = Number(req.body.startTime), endtime = Number(req.body.endTime);

    var overlap = {
        TableName: "Reservations",
        KeyConditionExpression: "#tb = :id and #et >= :stparam",
        FilterExpression: "#st <= :etparam",
        ExpressionAttributeNames:{
            "#tb": "tabID",
            "#et": "endTime",
            "#st": "startTime"
        },
        ExpressionAttributeValues: {
            ":id": tabid,
            ":stparam": starttime,
            ":etparam": endtime
        }
    };    
        
    docClient.query(overlap, function(err, data) {
        if(err) {
            console.log("starttime", starttime);
            console.log("query overlap:", err);
        }else {
            if(data.Count === 0) {
                var reservation = {
                    TableName: "Reservations",
                    Item: {
                        "tabID": tabid,
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
                        
                        if(h1 < 10) {
                            IDs.push(tabid+"+0"+h1);
                        }else {
                            IDs.push(tabid+"+"+h1);
                        }

                        if(h1 < h2) {
                            if(h2 < 10) {
                                IDs.push(tabid+"+0"+h2);
                            }else {
                                IDs.push(tabid+"+"+h2);
                            }
                        }
                        return res.json({"IDs": IDs});
                    }
                });
            }else {
                console.log("Fail", JSON.stringify(data, null, 2));
            }
        }
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
