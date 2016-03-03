'use strict'

var path = require('path');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var db = require('./db/pg');
var dotenv = require('dotenv');
var AWS = require('aws-sdk'); //Load the AWS SDK for Node.js
var userRoutes = require(path.join(__dirname, '/routes/users'));

/* app setting */
var port = process.env.PORT || 3000;

var app = express();


// parse incoming forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// override with POST having ?_method=xxxx
app.use(methodOverride('_method'));

// static route to public
app.use(express.static(path.join(__dirname, './public/')));

// log
app.use(logger('dev'));

// dotenv
dotenv.load();

/*Views*/
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('./pages/index')
})

app.use('/users', userRoutes)

// console.log(AWS)

app.listen(port,() => console.log('Sever up!'));
