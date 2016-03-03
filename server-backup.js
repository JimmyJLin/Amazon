'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var db = require('./db/pg');
var app = express();
var path = require('path');
var dotenv = require('dotenv');
var AWS = require('aws-sdk'); //Load the AWS SDK for Node.js
var s3 = require('s3policy');
var sigv4 = require('aws-sigv4');
var knox = require('knox');
var awscreds = require('aws-credentials');
var v4 = require('aws-signature-v4');
var createHmac = require('create-hmac');
var CryptoJS = require('crypto-js');
var ejs = require('ejs');
var moment = require('moment');
var now = moment();
var later = moment().add(30, 'days');
var logger = require('morgan');
var methodOverride = require('method-override');

/* app setting */
var port = process.env.PORT || 3000;


var myS3Account = new s3('AKIAJX7NX5Z2GD5EF4NA', 'Tx5r4wm7eAUvBfKYzFHTDm3S8hdfxGOTT383XLzs');

var expiration = later.toISOString() ;
var dateInCredential = now.format("YYYYMMDD");
var credential = "AKIAJX7NX5Z2GD5EF4NA"+"/"+dateInCredential+"/us-east-1/s3/aws4_request";

var amzdate = now.format("YYYYMMDD")+"T000000Z";

// dotenv
dotenv.load();

// parse incoming forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// override with POST having ?_method=xxxx
app.use(methodOverride('_method'));

// static route to public
app.use(express.static(path.join(__dirname, './public/')));

// log
app.use(logger('dev'));



/*Views*/
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('./pages/index')
})


var policy = {"expiration": expiration,
  "conditions": [
    {"bucket": "moo-d"},
    ["starts-with", "$key", "user/user1/"],
    {"acl": "public-read"},
    ["starts-with", "$Content-Type", ""],
    ["content-length-range", 0, 1048576],
    {"x-amz-credential": credential },
    {"x-amz-date" :amzdate},
    {"x-amz-algorithm" :"AWS4-HMAC-SHA256"},
    {"success_action_redirect" : "http://www.google.com"}
  ]
}

var base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(policy)));

function calculate(policy_in_base_64, secret_key, date_stamp, region,
       service) {
   var step_1 = policy_in_base_64;
   var step_2 = "AWS4" + secret_key;
   var step_3 = CryptoJS.HmacSHA256(date_stamp, step_2);
   var step_4 = CryptoJS.HmacSHA256(region, step_3);
   var step_5 = CryptoJS.HmacSHA256(service, step_4);
   var step_6 = CryptoJS.HmacSHA256("aws4_request", step_5);
   var step_7 = CryptoJS.HmacSHA256(policy_in_base_64, step_6);
   var result = step_7.toString(CryptoJS.enc.Hex);
   return result;
}

var s3signature = calculate(base64, "Tx5r4wm7eAUvBfKYzFHTDm3S8hdfxGOTT383XLzs", dateInCredential, "us-east-1", "s3"  );

app.get('/', (req, res) => {
    res.render('./pages/index', {"policy": base64, "credential": credential, "amzdate": amzdate, "s3signature": s3signature});
      });

AWS.config.update({
accessKeyId: "AKIAJX7NX5Z2GD5EF4NA",
secretAccessKey: "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",
});

var s3 = new AWS.S3();
var params = {
    Bucket: 'moo-d',
    Key: process.env.ACCESS_KEY_ID,
    Body: "HelloWorld"
};

s3.putObject(params, function (err, res) {
        console.log("Successfully uploaded data to testBucket");
        console.log('params in putObject', params);
});

app.listen(port,() => console.log('Sever up!'));
