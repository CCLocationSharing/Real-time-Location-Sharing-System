'use strict';

var fs = require('fs');

var User = require("../models/user");
var Post = require("../models/post");

exports.getProfile = function(req, res) {
    User.findOne({ username : req.query.id }, function(err, user) {
        if (err) throw err;
        if (user === null) return res.render("404.html");
        Post.find({ username : req.query.id }, function(err, posts) {
            if (err) throw err;
            res.render("profile.html", {user: user, posts: posts, scripts: ["profile"], styles: ["button"]});
        });
    });
};

exports.postProfile = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login");

    if (req.body.password != "" && req.body.confirm != "") {
        if (req.body.password != req.body.confirm)
            return res.send({status: 1});
        else if (!req.body.password.match(/^\w{6,20}$/))
            return res.send({status: 2});
    }
    if (req.body.email != "" && !req.body.email.match(/^\w+(.?\w+)*@\w+(\.\w)+$/))
        return res.send({status: 3});
    if (req.file) {
        if (req.file.mimetype.substring(0, 5) !== "image") {
            fs.unlink(req.file.path);
            return res.send({status: 4});
        } else if (req.file.size > 5 * 1024 * 1024) {
            fs.unlink(req.file.path);
            return res.send({status: 5});
        }
    }
    User.findOne({ username : req.session.user.username }, function(err, user) {
        if (err) throw err;

        if (user.picture !== "default.png") fs.unlink("assets/avatars/" + user.picture);
        if (req.file) user.picture = req.file.filename;
        if (req.body.email !== "") user.email = req.body.email;
        if (req.body.bio !== "") user.bio = req.body.bio;
        if (req.body.password !== "") user.password = req.body.password;
        user.save(function(err, result) {
            if (err) throw err;
            res.send({status: 0});
        });
    });
};

exports.removeCourse = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login");

    User.update({ username : req.session.user.username },
                { $pull : { courses : req.body.course } }, function(err, result) {
        if (err) throw err;
        if (result.ok === 1) res.send({status: 0});
        else res.send({status: 2});
    });
};

exports.removeFriend = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login");

    User.update({ username : req.session.user.username },
                { $pull : { friends : req.body.friend } }, function(err, result) {
        if (err) throw err;
        if (result.ok === 1) res.send({status: 0});
        else res.send({status: 2});
    });
};

exports.removeTutorPost = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login");

    Post.remove({ _id : req.body.id }, function(err, result) {
        if (err) throw err;
        if (result.nRemoved === 1) res.send({status: 0});
        else res.send({status: 2});
    });
};
