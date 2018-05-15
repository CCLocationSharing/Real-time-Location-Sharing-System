'use strict';

var dashboard = require("./dashboard");
var async = require('async');

var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-west-2",
    endpoint: "https://runtime.sagemaker.us-west-2.amazonaws.com/"
});

var sagemakerruntime = new AWS.SageMakerRuntime();

var endpoint_names = ["ccml-Uris-linear-endpoint", "ccml-Car-linear-endpoint", "ccml-Olin-linear-endpoint", "ccml-Gates-linear-endpoint", "ccml-Mann-linear-endpoint", "ccml-Law-linear-endpoint"];
var lib_names = ["uris", "carpenter", "olin", "gates", "mann", "law"];
var lib_locations = [[42.447699, -76.485310], [42.444807, -76.484129], [42.447881, -76.484250], [42.444973, -76.480999], [42.448757, -76.476414], [42.443855, -76.485772]];

//major information
var arts_majors = new Set(['Africana Studies', 'American Studies', 'Anthropology', 'Applied Economics and Management', 'Classics', 'Communication', 'Development Sociology', 'Economics', 'Feminist', 'Fine Arts', 'French', 'History', 'Human Development', 'Linguistics', 'Music', 'Philosophy', 'Religious Studies', 'Sociology', 'Urban and Regional Studies']);
var science_majors = new Set(['Animal Science', 'Biological Sciences', 'Environmental and Sustainability Sciences', 'Food Science', 'Mathematics', 'Nutritional Sciences', 'Statistical Science', 'Science and Technology Studies']);
var business_majors = new Set(['Accounting', 'Policy Analysis and Management', 'Hotel Administration']);
var engineering_majors = new Set(['Biological Engineering', 'Biomedical Engineering', 'Chemical Engineering', 'Computer Science', 'Environmental Engineering', 'Independent Major—Engineering', 'Operations Research and Engineering', 'Mechanical Engineering', 'Electrical and Computer Engineering']);



exports.predict = function(req, res) {
	if (req.session.user === undefined) {
        return res.send({status: -1});
    }
	let major_label = getMajorLabel(req.session.user.major);
	let distances = getDistances(req.body.latitude, req.body.longitude);
	let history_rates = getHistoryRates(req.body.history);
	let curr_aval_rates = getAvailabiliryRates();

	//go through all libs and print their score
	async.map([0, 1, 2, 3, 4, 5], function(i, callback) {
		var payload = "" + major_label + "," + distances[i] + "," + history_rates[i] + "," +curr_aval_rates[i];
	    var params = {
	        Body: payload,
	        EndpointName: endpoint_names[i],
	        ContentType: 'text/csv'
	    };
	    let lib_name = lib_names[i];
	    //console.log(payload);
	    sagemakerruntime.invokeEndpoint(params, function(err, data) {
	    	callback(err, [JSON.parse(data.Body).predictions[0].score, lib_name]);
		});
	}, function(err, data) {
		//console.log(data);
		res.send(data);
	});
}

function getMajorLabel(major) {
	let major_label = 5;
	if (arts_majors.has(major)) {
	    major_label = 1;
	} else if (science_majors.has(major)) {
	    major_label = 2;
	} else if (business_majors.has(major)) {
	    major_label = 3;
	} else if (engineering_majors.has(major)) {
	    major_label = 4;
	}
	return major_label;
}

function getDistances(latitude, longitude) {
	if (latitude == undefined || longitude == undefined)
		return [1, 1, 1, 1, 1, 1];
	let distances = [];
	for (let i = 0; i < lib_locations.length; i++) {
		let lat1 = lib_locations[i][0], lon1 = lib_locations[i][1];
		let lat2 = latitude, lon2 = longitude;
		var R = 6371e3; // metres
		var φ1 = lat1 * Math.PI / 180;
		var φ2 = lat2 * Math.PI / 180;
		var Δφ = (lat2-lat1) * Math.PI / 180;
		var Δλ = (lon2-lon1) * Math.PI / 180;

		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		        Math.cos(φ1) * Math.cos(φ2) *
		        Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

		distances.push(R * c * 0.000621371);
	}
	return distances;
}

function getHistoryRates(historyCookie) {
	if (historyCookie == undefined)
		return [1.0/6, 1.0/6, 1.0/6, 1.0/6, 1.0/6, 1.0/6];
	let rates = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
	let history = historyCookie.split(",");
	for (let i = 0; i < history.length; i++) {
		if (history[i] == "uris") {
			rates[0] += 1;
		} else if (history[i] == "carpenter") {
			rates[1] += 1;
		} else if (history[i] == "olin") {
			rates[2] += 1;
		} else if (history[i] == "gates") {
			rates[3] += 1;
		} else if (history[i] == "mann") {
			rates[4] += 1;
		} else if (history[i] == "law") {
			rates[5] += 1;
		}
	}
	let sum = 0.0;
	for (let i = 0; i < rates.length; i++)
		sum += rates[i];
	if (sum < 0.5) // that means sum == 0.0
		return [1.0/6, 1.0/6, 1.0/6, 1.0/6, 1.0/6, 1.0/6];

	for (let i = 0; i < rates.length; i++)
		rates[i] = rates[i] / sum;
	return rates;
}

function getAvailabiliryRates() {
	let status = dashboard.returnStatus();
	let libraries = dashboard.returnLibraries();
	let rates = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
	for (let libid in status) {
		if (libid == "uris") {
			rates[0] += status[libid].taken;
		} else if (libid == "carpenter") {
			rates[1] += status[libid].taken;
		} else if (libid == "olin") {
			rates[2] += status[libid].taken;
		} else if (libid == "gates") {
			rates[3] += status[libid].taken;
		} else if (libid == "mann") {
			rates[4] += status[libid].taken;
		} else if (libid == "law") {
			rates[5] += status[libid].taken;
		}
	}
	for (let i = 0; i < libraries.length; i++) {
		if (libraries[i].libID == "uris") {
			rates[0] /= libraries[i].libCapacity;
		} else if (libraries[i].libID == "carpenter") {
			rates[1] /= libraries[i].libCapacity;
		} else if (libraries[i].libID == "olin") {
			rates[2] /= libraries[i].libCapacity;
		} else if (libraries[i].libID == "gates") {
			rates[3] /= libraries[i].libCapacity;
		} else if (libraries[i].libID == "mann") {
			rates[4] /= libraries[i].libCapacity;
		} else if (libraries[i].libID == "law") {
			rates[5] /= libraries[i].libCapacity;
		}
	}
	return rates;
}