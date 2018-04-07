'use strict';

var User = require("../models/user");
var Voc = require("../models/voc");

exports.getGre = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login?from=gre");
    let today = new Date();
    let settings = { scripts: ["gre"], month: today.getMonth() + 1, date: today.getDate() };
    if (["voc", "verbal", "reading", "writing"].includes(req.query.subject))
        settings.subject = req.query.subject;
    
    if (req.query.subject === "voc") {
        Voc.find({}, function(err, results) {
            if (err) throw err;
            settings.content = results;
            settings.test = 1;
            return res.render("gre.html", settings);
        });
    }
    else {
        return res.render("gre.html", settings);
    }
}

exports.postStartDate = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login?from=gre");

    let startdate = new Date(req.body.startdate), today = new Date();
    if (Math.floor((today - startdate) / (1000 * 60 * 60 * 24)) > 0) return res.send({status: 1});
    else {
        User.findOne({ username: req.session.user.username }, function(err, user) {
            if (err) throw err;
            user.startdate = startdate;
            user.save(function(err, result) {
                if (err) throw err;
                return res.send({status: 0, result:result});
            });
        });
    }
};
