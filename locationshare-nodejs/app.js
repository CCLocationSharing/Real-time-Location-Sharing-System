'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
//var socketio = require("./routes/socketio");

var server = require("http").Server(app);
var io = require("socket.io")(server);

io.sockets.on('connection', function(socket) {
	
});

app.get("/", (req, res) => {res.render("index", {fixNav: true, home: "active"})});
app.get("/about", (req, res) => {res.render("about", {about: "active"})});

app.get("/signup", (req, res) => {res.render("signup.html", { scripts: ["signin"], styles: ["signin"] })});
app.get("/login", (req, res) => {res.render("login.html", { scripts: ["login"], styles: ["signin"] })});
app.get('/logout', signin.getLogout);
app.post("/signup", signin.postNewUser);// Done
app.post("/login", signin.postLogin); // Done

app.get("/dashboard", function(req, res) {
	if (req.session.user === undefined) return res.redirect("/");
	res.render("dashboard.html", {styles: ["dashboard"], scripts: ["dashboard"], home : "active"});
});// Done
app.get("/libraryCapacity", dashboard.getLibraryCapacity);
app.get("/libraryStatus", dashboard.getLibraryStatus);
//app.get("/friendList", dashboard.getFriendList);

app.get("/reserve", function(req, res) {
	if (req.session.user === undefined) {
        req.session.lastUrl = "/reserve";
        return res.redirect("/login");
    }
	res.render("reserve.html", {styles: ["reserve"], scripts: ["reserve"], reserve : "active"});
});

app.get("/renderForPicker", reserve.getRender);
app.post("/reservation", reserve.postReservation);

app.get("/heat", (req, res) => {res.render("heat", {scripts: ["heat"], styles: ["heat"], heat: "active"})});


var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});