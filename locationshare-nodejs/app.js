'use strict';

var AWS = require('aws-sdk');
var express = require('express');
var bodyParser = require('body-parser');

// ========== AWS ==========
AWS.config.region = process.env.REGION

var sns = new AWS.SNS();
var ddb = new AWS.DynamoDB();

var ddbTable =  process.env.STARTUP_SIGNUP_TABLE;
//var snsTopic =  process.env.NEW_SIGNUP_TOPIC;
var app = express();

// ========== SETTINGS ==========
app.set('view engine', 'html');
app.set('views', __dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/assets'));

//========== NUNJUCKS ==========
var path = require('path');
var nunjucks = require('nunjucks');
nunjucks.configure(path.resolve(__dirname + '/public/'),
    { autoescape: true, express: app });

//========== SESSION ==========
var session = require('express-session');
app.use(session({ secret: 'What is this', resave: false, saveUninitialized: false,
                  cookie: { maxAge: 900000 }}));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//========== MAIN ==========
var signin = require("./routes/signin");
var dashboard = require("./routes/dashboard");
var reserve = require("./routes/reserve");

app.get("/", function(req, res) { // Done
    res.render("index.html", { navbarFixedTop : true});
});

app.get("/about", function(req, res) { // Done
    res.render("about.html", { navbarFixedTop : true});
});

app.get("/signup", function(req, res) { // Done
    res.render("signup.html", { scripts: ["signin"], styles: ["signin"] });
});

app.get("/login", function(req, res) { // Done
    res.render("login.html", { scripts: ["login"], styles: ["signin"] });
});

app.get('/logout', signin.getLogout);// Done

app.post("/signup", signin.postNewUser);// Done
app.post("/login", signin.postLogin); // Done

app.get("/dashboard", function(req, res) {
	res.render("dashboard.html", {styles: ["dashboard"], scripts: ["dashboard"]});
});// Done
app.get("/libraryCapacity", dashboard.getLibraryCapacity);
app.get("/libraryStatus", dashboard.getLibraryStatus);

app.get("/reserve", reserve.getReserve);// Done


/*
app.post("/postAdminUpdate", dashboard.postAdminUpdate);
app.post("/postOrder", dashboard.postOrder);// Done

app.get('/search', search.getSearch);// Done
app.post('/makeFriends', search.makeFriends); //Done
app.post('/addCourse', search.addCourse);// Done

app.get("/course", course.getCourse);
app.post("/course/response", function(req, res) {});
app.post("/course", function(req, res) {});

app.get("/profile", profile.getProfile);// Done
app.post("/profile", upload.single("picture"), profile.postProfile);// Done
app.post("/removeCourse", profile.removeCourse);// Done
app.post("/removeFriend", profile.removeFriend);// Done
app.post("/removeTutorPost", profile.removeTutorPost);// Done

app.get("/gre", gre.getGre);
app.post("/postGreStartDate", gre.postStartDate);
*/
var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
