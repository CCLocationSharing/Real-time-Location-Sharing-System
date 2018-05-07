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
var async = require('async');
var crypto = require("crypto");

let majorIDMap = {
    "101": "Africana Studies",
    "102": "American Studies",
    "103": "Anthropology",
    "104": "Applied Economics and Management",
    "105": "Classics",
    "106": "Communication",
    "107": "Development Sociology",
    "108": "Economics",
    "109": "Feminist",
    "110": "Fine Arts",
    "111": "French",
    "112": "History",
    "113": "Human Development",
    "114": "Linguistics",
    "115": "Music",
    "116": "Philosophy",
    "117": "Religious Studies",
    "118": "Sociology",
    "119": "Urban and Regional Studies",
    "201": "Animal Science",
    "202": "Biological Sciences",
    "203": "Environmental and Sustainability Sciences",
    "204": "Food Science",
    "205": "Mathematics",
    "206": "Nutritional Sciences",
    "207": "Statistical Science",
    "208": "Science and Technology Studies",
    "301": "Accounting",
    "302": "Policy Analysis and Management",
    "303": "Hotel Administration",
    "401": "Biological Engineering",
    "402": "Biomedical Engineering",
    "403": "Chemical Engineering",
    "404": "Computer Science",
    "405": "Environmental Engineering",
    "406": "Independent Major—Engineering",
    "407": "Operations Research and Engineering",
    "408": "Mechanical Engineering",
    "409": "Electrical and Computer Engineering"
}

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
        return res.json({status:3});
    } else if (req.body.password != req.body.confirmpassword) {
        return res.json({status:2});
    } else if (req.body.major == 0 || majorIDMap[req.body.major] === undefined) {
        return res.json({status:4});
    }

    async.series([function(callback) {
        var user = {
            TableName: "Users",
            Key: {
                "username":req.body.username
            }
        };

        docClient.get(user, function(err, user) {
            if (err) throw err;
            if (user.Item) callback(1, null);
            else callback(null, null);
        });
    }, function(callback) {
        var salt = genRandomString(16);
        var password = sha512(req.body.password, salt);
        var newUser = {
            TableName: "Users",
            Item: {
                "username":req.body.username,
                "salt": salt,
                "password": password,
                "reservation": {},
                "major": majorIDMap[req.body.major],
                "occupation": {}
            }
        };

        docClient.put(newUser, function(err, data) {
            if (err) throw err;
            callback(null, newUser);
        });
    }], function(err, results) {
        if (err) return res.json({status: 1});
        let newUser = results[1];
        req.session.user = {username: newUser.Item.username, friends: newUser.Item.friends};
        res.json({status: 0, redirect: "dashboard"});
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
                req.session.user = {username: user.Item.username, friends: user.Item.friends};
                if(req.session.lastUrl === undefined || req.session.lastUrl != "/reserve") {
                    res.json({status: 0, redirect: "dashboard"});
                }else{
                    res.json({status: 0, redirect: "reserve"});
                }
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
