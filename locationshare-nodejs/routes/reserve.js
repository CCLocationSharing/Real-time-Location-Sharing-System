'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
var dashboard = require("./dashboard");
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

    dashboard.returnLibraries().forEach(lib => {
        if (lib.libID === libid)
            getTableElements(req, res, lib.tables);
    });
}

function tableParamReserve(req, starttime, endtime, table) {
    let tableParam = {
        TableName: "Tables",
        Key: {"tabID": table},
        ExpressionAttributeValues: {":user": req.session.user.username}
    };  
    if (starttime.hour() === endtime.hour()) {
        tableParam.UpdateExpression = "set reserved.#key = :user";
        tableParam.ExpressionAttributeNames = {"#key": starttime.valueOf()};
        tableParam.ConditionExpression = "attribute_not_exists(reserved.#key)";
    } else {
        tableParam.UpdateExpression = "set reserved.#key1 = :user, reserved.#key2 = :user";
        tableParam.ExpressionAttributeNames = {
            "#key1": starttime.valueOf(),
            "#key2": endtime.startOf("hour").valueOf()
        };
        tableParam.ConditionExpression = "attribute_not_exists(reserved.#key1) AND attribute_not_exists(reserved.#key2)";
    }
    return tableParam;
}

function userParamReserve(req, starttime, endtime, table) {
    let userParam = {
        TableName: "Users",
        Key: {"username": req.session.user.username},
        ExpressionAttributeValues: {":table": table}
    };
    if (starttime.hour() === endtime.hour()) {
        userParam.UpdateExpression = "set reservation.#key = :table";
        userParam.ExpressionAttributeNames = {"#key": starttime.valueOf()};
        userParam.ConditionExpression = "attribute_not_exists(reservation.#key)";
    } else {
        userParam.UpdateExpression = "set reservation.#key1 = :table, reservation.#key2 = :table";
        userParam.ExpressionAttributeNames = {
            "#key1": starttime.valueOf(),
            "#key2": endtime.startOf("hour").valueOf()
        };
        userParam.ConditionExpression = "attribute_not_exists(reservation.#key1) AND attribute_not_exists(reservation.#key2)";
    }
    return userParam;
}

function tableParamCancel(req, starttime, endtime, table) {
    let tableParam = {
        TableName: "Tables",
        Key: {"tabID": table}
    };  
    if (starttime.hour() === endtime.hour()) {
        tableParam.UpdateExpression = "remove reserved.#key";
        tableParam.ExpressionAttributeNames = {"#key": starttime.valueOf()};
    } else {
        tableParam.UpdateExpression = "remove reserved.#key1, reserved.#key2";
        tableParam.ExpressionAttributeNames = {
            "#key1": starttime.valueOf(),
            "#key2": endtime.startOf("hour").valueOf()
        };
    }
    return tableParam;
}

let reserveCount = 0, cancelCount = 0;
setInterval(() => {
    if (reserveCount != 0) {
        console.log(moment().format() + ": " + (process.env.PORT || 3000) + 
            ": POST /reserve: " + reserveCount + " requests in the last second.");
        reserveCount = 0;
    }
    if (cancelCount != 0) {
        console.log(moment().format() + ": " + (process.env.PORT || 3000) + 
            ": POST /cancel: " + cancelCount + " requests in the last second.");
        cancelCount = 0;
    }
}, 1000);

exports.postReservation = function(req, res) {
    reserveCount += 1;
    if (req.session.user === undefined) {
        return res.send({status: -1});
    }
    
    reserve(req, res);
}

exports.postFakeReservation = function(req, res) {
    reserveCount += 1;
    req.session.user = {username: "Syugen"};
    reserve(req, res);
}

function reserve(req, res) {
    let table = req.body.tabID;
    let starttime = moment(Number(req.body.startTime));
    let endtime = moment(Number(req.body.endTime));

    if(table === undefined || table === "" || 
        starttime === undefined || endtime === undefined) {
        return res.status(400).send("You didn't select any time slot.");
    }
 
    async.series([function(callback) {
        docClient.update(tableParamReserve(req, starttime, endtime, table), function(err, data) {
            if (err) {
                if (err.name === "ConditionalCheckFailedException") {
                    callback(1, null);
                } else throw err;
            } else {callback(null, data);}
        });
    }, function(callback) {
        docClient.update(userParamReserve(req, starttime, endtime, table), function(err, data) {
            if (err) {
                if (err.name === "ConditionalCheckFailedException") {
                    callback(2, null);
                } else throw err;
            } else callback(null, data);
        });
    }], function(err, results) {
        if (err === 1) {
            return res.send({status: 1});
        } else if (err === 2) {
            docClient.update(tableParamCancel(req, starttime, endtime, table), function(err, data) {
                if (err) throw err;
                return res.send({status: 2});
            });
        } else return res.send({status: 0});
    });
}

exports.getReserve = function(req, res) {
    if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }
    res.render("reserve.html", {styles: ["reserve"], scripts: ["reserve"], reserve : "active"});
}

exports.cancelReservation = function(req, res) {
    cancelCount += 1;
    if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }

    async.parallel([function(callback) {
        let param = {
            TableName: "Tables",
            Key: {"tabID": req.body.table},
            UpdateExpression: "remove reserved.#key",
            ExpressionAttributeNames: {"#key": req.body.time.valueOf()}
        };

        docClient.update(param, function(err, data) {
            if (err) throw err;
            callback(null, data);
        });
    }, function(callback) {
        let param = {
            TableName: "Users",
            Key: {"username": req.session.user.username},
            UpdateExpression: "remove reservation.#key",
            ExpressionAttributeNames: {"#key": req.body.time.valueOf()}
        };

        docClient.update(param, function(err, data) {
            if (err) throw err;
            callback(null, data);
        });
    }], function(err, results) {
        return res.send("Success");
    });
}