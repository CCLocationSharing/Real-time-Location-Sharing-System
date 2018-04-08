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

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};

exports.postNewUser = function(req, res) {
    if (!req.body.password.match(/^\w{6,20}$/)) {
        return res.send({status:3});
    } else if (req.body.password != req.body.confirmpassword){
        return res.send({status:2});
    }

    var user = {
        TableName: "Users",
        Key: {
            "username":req.body.username
        }
    };

    docClient.get(user, function(err, user) {
        if (err) throw err;
        if (user.Item) res.json({status: 1});
        else {
            var salt = genRandomString(16);
            var password = sha512(req.body.password, salt);
            var newUser = {
                TableName: "Users",
                Item: {
                    "username":req.body.username,
                    "salt": salt,
                    "password":password,
                    "isonline":true, // currently no use
                    "friends": [] // currently no use
                }
            };

            docClient.put(newUser, function(err, data) {
                if (err) throw err;
                
                req.session.user = {username: user.Item.username};
                res.json({status: 0});
            });
        }
    });
};

exports.postLogin = function(req, res) {
    var user = {
        TableName: "Users",
        Key: {
            "username":req.body.username
        }
    };

    docClient.get(user, function(err, user) {
        if (err) throw err;

        if (!user.Item) return res.json({status: 1});
        var salt = user.Item.salt;
        if (user.Item.password != sha512(req.body.password, salt)) 
            res.json({status: 2});
        else {
            /*var updateUser = {
                TableName: "Users",
                Key: {
                    "username":req.body.username
                },
                UpdateExpression: "set isonline=:isonline",
                ExpressionAttributeValues:{
                    ":isonline": true
                }
            };
            docClient.update(updateUser, function(err, data) {
                if (err) throw err;
                */
                io.emit("login", {username: user.Item.username});
                req.session.user = {username: user.Item.username};
                res.json({status: 0, redirect: "dashboard"});
            //});
        }
    });
};

exports.getLogout = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/");

    /*
    var user = {
        TableName: "Users",
        Key: {
            "username":req.body.username
        }
    };
    docClient.get(user, function(err, user) {
        if (err) throw err;

        user.online = false;
        user.save(function(err, data) {
            if (err) throw err;
        });
    });*/
    req.session.destroy();
    res.redirect('/');
}
