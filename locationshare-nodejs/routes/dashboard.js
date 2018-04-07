'use strict';

var User = require("../models/user");
var Course = require("../models/course");
var Post = require("../models/post");
var Timetable = require("../models/timetable");

exports.getDashboard = function(req, res) {
    let loggedIn = req.session.user, start, end, dateString = [];
    if (loggedIn && req.session.user.type === "admin" && req.query.start) {
        start = new Date(req.query.start);
        start = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
    } else {
        start = new Date();
        if (!loggedIn || req.session.user.type === "student") start.setDate(start.getDate() + 1);
        start.setHours(0, 0, 0, 0);
    }
    if (loggedIn && req.session.user.type === "admin" && req.query.end) {
        end = new Date(req.query.end);
        end = new Date(end.getTime() + end.getTimezoneOffset() * 60000 + 86400000);
    }
    if (!req.query.end || end < start) {
        end = new Date(start.getTime());
        end.setDate(start.getDate() + 7);
        end.setHours(0, 0, 0, 0);
    }

    let tableLength = Math.floor((end.getTime() - start.getTime()) / 86400000);
    for (let i = 0; i < tableLength; i++) {
        let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let d = new Date(start.getTime());
        d.setDate(start.getDate() + i);
        let year = d.getFullYear(), month = d.getMonth() + 1, date = d.getDate();
        if (date < 10) date = "0" + date;
        if (month < 10) month = "0" + month;
        dateString.push("" + year + month + date + "\n" + weekday[d.getDay()])
    }

    if (!loggedIn || req.session.user.type === "student") start.setDate(start.getDate() - 1);
    Timetable.find({date: {$gte: start, $lt: end}}, function(err, slots) {
        if (err) throw err;

        if (!loggedIn || req.session.user.type === "student") start.setDate(start.getDate() + 1);
        let cells = [], orders = [];
        for (let i = 9; i < 22; i++) {
            let row = [];
            for (let j = 0; j < tableLength; j++) row.push("");
            cells.push(row);
        }

        for (let i = 0; i < slots.length; i++) {
            let diff = Math.floor((slots[i].date.getTime() - start.getTime()) / 86400000);

            if (loggedIn && req.session.user.type === "admin") {
                cells[slots[i].date.getHours() - 9][diff] = slots[i];
                let d = slots[i].order_date;
                let t = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
                for (let j = 1; j < t.length; j++) if (t[j] < 10) t[j] = "0" + t[j];
                orders.push({"order_date": "" + t[0] + t[1] + t[2] + t[3] + t[4] + t[5], "username": slots[i].username});
            } else {
                if (diff >= 0) cells[slots[i].date.getHours() - 9][diff] = {"NA": 1};
                if (loggedIn && slots[i].username === req.session.user.username) {
                    let today = new Date(), date = slots[i].date, dateString;
                    today.setHours(0, 0, 0, 0);
                    if (date.getTime() - today.getTime() < 86400000) dateString = "Today";
                    else if (date.getTime() - today.getTime() < 2 * 86400000) dateString = "Tomorrow";
                    else dateString = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate();
                    orders.push({date: dateString + " " + date.getHours() + ":00", course: slots[i].course});
                }
            }
        }

        if (!loggedIn) {
            let setting = {dates: dateString, cells: cells, styles: ["dashboard"], scripts: ["dashboard"]};
            return res.render("dashboard.html", setting);
        } else if (req.session.user.type === "admin") {
            User.find({}, function(err, results) {
                if (err) throw err;

                let users = [];
                for (let i = 0; i < results.length; i++)
                    users.push({ username : results[i].username, online : results[i].online});
                let setting = {users: users, dates: dateString, cells: cells, orders: orders, styles: ["dashboard"], scripts: ["admin"]};
                return res.render("admin.html", setting);
            });
        } else if (req.session.user.type === "student") {
            let setting = {dates: dateString, cells: cells, orders: orders, styles: ["dashboard"], scripts: ["dashboard", "jquery.maskedinput.min"]};
            return res.render("dashboard.html", setting);
        }
    });
}

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

/*
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
*/
};
