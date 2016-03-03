var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');
var AWS = require('aws-sdk'); //Load the AWS SDK for Node.js

// var multiparty = require('multiparty');

users.route('/')
  .get(function(req, res){
    res.render('./pages/index')
  })


//end of routes

// Set your region for future requests.
// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccesskey: process.env.SECRET_ACESS_KEY,
//   region: process.env.REGION
// });

// var config = new AWS.Config({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACESS_KEY,
//   region: process.env.REGION
// });

// var creds = new AWS.Credentials(process.env.ACCESS_KEY_ID, process.env.SECRET_ACESS_KEY, 'session');

// AWS.config.logger = console.log
// testing putObject
var s3 = new AWS.S3();
var policy = {
	"Id": "Policy1456949854088",
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Stmt1456949843374",
			"Action": "s3:*",
			"Effect": "Allow",
			"Resource": "arn:aws:s3:::moo-d",
			"Principal": "*"
		}
	]
}
var params = {
    Bucket: 'testBucket',
    Key: process.env.ACCESS_KEY_ID,
    Body: "HelloWorld"
};
s3.putObject(params, function (err, res) {
        console.log("Successfully uploaded data to testBucket");
        console.log('params in putObject', params);
});


// s3.listObjects({Bucket: 'testBucket'}).on('success', function handlePage(response) {
//   // do something with response.data
//   if (response.hasNextPage()) {
//     response.nextPage().on('success', handlePage).send();
//   }
// }).send();

// create Bucket
// var s3 = new AWS.S3();
// var params = {
//     Bucket: 'testBucket',
//     Key: process.env.ACCESS_KEY_ID
// };
// var s3 = new AWS.S3({params: {Bucket: 'testBucket', Key: process.env.ACCESS_KEY_ID}});
// s3.createBucket(function(err) {
//   if (err) { console.log("Error:", err); }
//   else {
//     s3.upload({Body: 'Hello!'}, function() {
//       console.log("Successfully uploaded data to myBucket/myKey");
//     });
//   }
// });

// var s3 = new AWS.S3();
// s3.listBuckets(s3.putObject, function(err, data) {
//   if (err) { console.log("Error:", err); }
//   else {
//     for (var index in data.Buckets) {
//       var bucket = data.Buckets[index];
//       console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
//     }
//   }
// });

// List All Buckets

// var s3 = new AWS.S3();
// var params = {
//     Bucket: 'testBucket',
//     Key: process.env.ACCESS_KEY_ID
// };
// s3.listBuckets(function(err, data) {
//   if (err) { console.log("Error:", err); }
//   else {
//     for (var index in data.Buckets) {
//       var bucket = data.Buckets[index];
//       console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
//     }
//   }
// });



module.exports = users;
