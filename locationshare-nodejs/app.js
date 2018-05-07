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
var occupy = require("./routes/occupy");
var heat = require("./routes/heat");
var simulateoccupy = require("./routes/simulateoccupy")

app.get("/", (req, res) => {res.render("index", {index: true, home: "active"})});
app.get("/about", (req, res) => {res.render("about", {about: "active"})});
app.get("/signup", (req, res) => {res.render("signup", {styles: ["signin"] })});
app.get("/login", (req, res) => {res.render("login", {styles: ["signin"] })});
app.get("/occupy", (req, res) => {res.render("occupy")});

app.get('/logout', signin.getLogout);
app.post("/signup", signin.postNewUser);
app.post("/login", signin.postLogin);

app.get("/dashboard", dashboard.getDashboard);
app.get("/libraryCapacity", dashboard.getLibraryCapacity);
app.get("/libraryStatus", dashboard.getLibraryStatus);
app.get("/getUserReservation", dashboard.getUserReservation);
app.post("/cancelReservation", reserve.cancelReservation);

app.get("/reserve", reserve.getReserve);
app.get("/renderForPicker", reserve.getRender);
app.post("/makeReservations", reserve.postReservation);
app.post("/makeFakeReservations", reserve.postFakeReservation);

app.get("/heat", (req, res) => {res.render("heat", {styles: ["heat"], heat: "active"})});
app.get("/getHeatData", heat.getHeatData);

app.post("/occupy", occupy.postOccupy);

app.post("/simulateSwipeCardIn", simulateoccupy.swipeCardIn);
app.post("/simulateSwipeCardOut", simulateoccupy.swipeCardOut);

app.get("/die", () => a[0]);

var port = process.env.PORT || 3000;
var server = require("http").Server(app);
server.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
