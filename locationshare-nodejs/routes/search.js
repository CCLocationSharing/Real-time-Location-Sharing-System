'use strict';
//Raymond Begins......
var User = require("../models/user");
var Course = require("../models/course");
var Post = require("../models/post");
//data from courses_seed.json and from users_seed.json have been
//loaded to the corresponding mongo database via command in terminal..

//build the response here..
//handle HTTP request sent via dashboard.js(the assets' one)
exports.getSearch = function(req, res) {
    if (req.session.user === undefined) return res.redirect("/login?from=search");

    let content = req.query.content;
    if (content.length === 0) {
        res.render("search.html");
    } else if (content.match(/^\d{3}$/) || content.match(/^[A-Za-z]{3}\d{3}$/)) {
        if (content.match(/^\d{3}$/)) content = "CSC" + content;
        content = content.toUpperCase();
        // Find course
        Course.findOne({ code: { $regex: content }}, function(err, course) {
            if(err) throw err;

            // Find posts. Students only find tutors, tutors only find students
            let whatToFind = { subject: { $regex: content }};
            if (req.session.user.type === "student") whatToFind["is_student"] = false;
            else if (req.session.user.type === "tutor") whatToFind["is_student"] = true;
            Post.find(whatToFind, function(err, posts) {
                if(err) throw err;

                let people = null;
                if (course !== null)
                    if (req.session.user.type === "student") people = course.tutors;
                    else if (req.session.user.type === "tutor") people = course.students;
                    else if (req.session.user.type === "admin") people = course.students.concat(course.tutors);
                let settings = { type: "course", posts: posts, scripts: ["search"],
                                 course: course === null ? false : course.code,
                                 people: people };
                res.render("search.html", settings);
            });
        });
    } else {
        let regex = new RegExp(content, "i"); // Make it case insensitive
        Post.find({ username: { $regex: regex }},function(err, posts){
            if(err) throw err;
            let whatToFind = { username: { $regex: regex }};
            if (req.session.user.type === "student") whatToFind["type"] = "tutor";
            else if (req.session.user.type === "tutor") whatToFind["type"] = "student";
            User.find(whatToFind, function(err, users) {
                if(err) throw err;
                let settings = { type: "people", posts: posts, users: users, scripts: ["search"]};
                res.render("search.html", settings);
            });
        });
    }
};

//works and done
exports.makeFriends = function(req, res){
    if (req.session.user === undefined) return res.redirect("/login");

    let f1 = req.body.username;
    let f2 = req.session.user.username;

    User.findOne({username:f1},function(err,user){
        if(err) throw err;
        if(user.friends.indexOf(f2) == -1) {
            user.friends.push(f2);
            user.save(function(err){
                if(err) throw err;

                // Update another person
                User.findOne({username:f2},function(err,user){
                    if(err) throw err;
                    if(user.friends.indexOf(f1) == -1){ //prevent duplicate
                        user.friends.push(f1);
                        user.save(function(err){
                            if(err) throw err;
                            res.send('Success');
                        });
                    } else res.send('You are already friends.');
                });
            });
        }
    });
}

exports.addCourse = function(req,res){
    if (req.session.user === undefined) return res.redirect("/login");

    let courseCode = req.body.code;
    let username = req.session.user.username;
    // Update course
    Course.findOne({code:courseCode},function(err,course){
        if (err) throw err;
        if (req.session.user.type === "student" && course.students.indexOf(username) === -1)
            course.students.push(username);
        else if (req.session.user.type === "tutor" && course.tutors.indexOf(username) === -1)
            course.tutors.push(username);
        course.save(function(err, result) {
            if(err) throw err;

            // Update user
            User.findOne({ username: req.session.user.username }, function(err, user){
                if (err) throw err;
                if(user.courses.indexOf(courseCode) == -1) {
                    user.courses.push(courseCode);
                    user.save(function(err, result) {
                        if(err) throw err;
                        res.send('Success');
                    });
                } else res.send('Course previously added.');
            })
        });
    });
}
//note: need to clean and re-make the mongo database to make it 100% correct..
//Raymond Ends......
