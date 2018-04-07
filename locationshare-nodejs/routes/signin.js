'use strict';

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.postNewUser = function(req, res) {
    if (!req.body.password.match(/^\w{6,20}$/)) {
        return res.send({status:3});
    } else if (req.body.password != req.body.confirmpassword){
        return res.send({status:2});
    }

    var newUser = {
        TableName: "Users",
        Key: {
            "username":req.body.username//,
            //"password":req.body.password,
            //"online":true,
            //"friends": []
        }
    };

    docClient.get(newUser, function(err, user) {
        console.log("here")
        if (err) throw err;
        if (user) res.json({status: 1});
        else {
            newUser.save(function(err, newUser) {
                if (err) throw err;

                req.session.user = { username: newUser.username, type: newUser.type };
                res.json({status: 0});
            });
        }
    });
};

exports.postLogin = function(req, res) {/*
    User.findOne({ username : req.body.username }, function(err, user) {
        if (err) throw err;

        if (!user) res.json({status: 1});
        else if (user.password != req.body.password) res.json({status: 2});
        else {
            user.online = true;
            user.save(function(err, data) {
                if (err) throw err;

                req.session.user = { username: user.username, type: user.type };
                let redirect = ["gre", "search"].includes(req.body.from) ? req.body.from : "dashboard";
                res.json({status: 0, redirect: redirect});
            });
        }
    });*/
};

exports.getLogout = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/");

    User.findOne({ username : req.session.user.username }, function(err, user) {
        if (err) throw err;

        user.online = false;
        user.save(function(err, data) {
            if (err) throw err;
        });
    });
    req.session.destroy();
    res.redirect('/');
}
