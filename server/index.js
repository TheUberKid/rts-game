'use strict';

var express = require('express');
var app = express();
var serv = require('http').Server(app);

var compression = require('compression');
var minify = require('express-minify');
app.use(compression());

// enable minify if in production, otherwise console
var args = process.argv.slice(2);
if(args[0] === 'debug'){
  winston.level = 'debug';
} else {
  app.use(minify());
}

var async = require('async');
var mongoose = require('mongoose');

// serve client files and only client files on request
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

// delete requests if they timeout (30 seconds)
var timeout = require('connect-timeout');
app.use(timeout(30*1000));
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

// start server
serv.listen(process.env.PORT || 5000);
console.log('Server started');
