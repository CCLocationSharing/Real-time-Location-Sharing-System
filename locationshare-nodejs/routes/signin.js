'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://dynamodb.us-west-2.amazonaws.com"//"http://127.0.0.1:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

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
            var newUser = {
                TableName: "Users",
                Item: {
                    "username":req.body.username,
                    "password":req.body.password,
                    "isonline":true, // currently no use
                    "friends": [] // currently no use
                }
            };

            docClient.put(newUser, function(err, data) {
                if (err) throw err;
                
                req.session.user = { username: newUser.Item.username };
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

        if (!user.Item) res.json({status: 1});
        else if (user.Item.password != req.body.password) res.json({status: 2});
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
                req.session.user = { username: user.Item.username };
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
