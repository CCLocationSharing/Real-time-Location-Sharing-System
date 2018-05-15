const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
//get AWS
var AWS = require("aws-sdk");
 AWS.config.update({
     region: "us-west-2",
 });
//get SageMakerRuntime object
var sagemakerruntime = new AWS.SageMakerRuntime();

//can be added if we train more models for more libs
var endpoint_names = ["ccml-Uris-linear-endpoint", "ccml-Car-linear-endpoint",
"ccml-Olin-linear-endpoint", "ccml-Gates-linear-endpoint"];

var lib_names = ["uris", "carpenter", "olin", "gates"];
var major = 'Computer Science'
//sample distance and history rates
var distances = [1, 1, 1, 1];
var history_rates = [0.25, 0.25, 0.25, 0.25];
var curr_aval_rates = [0.25, 0.25, 0.25, 0.25];

//major information
var arts_majors = new Set(['Africana Studies', 'American Studies',
'Anthropology', 'Applied Economics and Management', 'Classics', 'Communication',
'Development Sociology', 'Economics', 'Feminist', 'Fine Arts', 'French', 'History', 'Human Development', 'Linguistics', 'Music',
'Philosophy', 'Religious Studies', 'Sociology', 'Urban and Regional Studies']);
var science_majors = new Set(['Animal Science', 'Biological Sciences', 'Environmental and Sustainability Sciences',
'Food Science', 'Mathematics', 'Nutritional Sciences', 'Statistical Science', 'Science and Technology Studies']);
var business_majors = new Set(['Accounting', 'Policy Analysis and Management', 'Hotel Administration']);
var engineering_majors = new Set(['Biological Engineering', 'Biomedical Engineering', 'Chemical Engineering',
'Computer Science', 'Environmental Engineering', 'Independent Major—Engineering', 'Operations Research and Engineering',
'Mechanical Engineering', 'Electrical and Computer Engineering']);

//label given major
var major_label = 5;
if(arts_majors.has(major)){
  major_label = 1;
}else if(science_majors.has(major)){
  major_label = 2;
}else if(business_majors.has(major)){
  major_label = 3;
}else if(engineering_majors.has(major)){
  major_label = 4;
}

//go through all libs and print their score
for (var i = 0; i < endpoint_names.length; i++) {
    var payload = "" + major_label +"," + distances[i] +"," + history_rates[i] +"," +curr_aval_rates[i];
    var params = {
      Body: payload,
      EndpointName: endpoint_names[i],
      ContentType: 'text/csv'
    };
    getScore(lib_names[i], params);
}

function getScore(lib_name, params){
  sagemakerruntime.invokeEndpoint(params, function(err, data) {
   if (err){
     console.log(err, err.stack);
   }else{
     console.log(lib_name);
     console.log(JSON.parse(data.Body).predictions[0].score);
   }
 });
}
