'use strict';

exports.getDashboard = function(req, res) {
    let loggedIn = req.session.user, start, end, dateString = [];
    let setting = {styles: ["dashboard"], scripts: ["dashboard"]};
    return res.render("dashboard.html", setting);
}
