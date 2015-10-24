import mongohandler from '../public/js/mongohandler.js';

var express = require('express');
var router = express.Router();

var redis = require('redis');


router.get('/data', function(req, res, next){
  //var port = '9777';
  //var host = 'barb.redistogo.com';
  //var client = redis.createClient(port, host);
  //var password = '5eacf51fc07133f13cd3517f6579b7bd';
  //client.on('connect', function(){
  //  console.log('connected');
  //});
  //client.auth(password, function(reply){
  //  console.log('auth reply ', reply);
  //})
  //var userData ={
  //  name: 'Honeycreeek Parent',
  //  address1: '123 Main Street',
  //  address1: 'Apt 12b',
  //  address1: 'Ann Arbor MI',
  //  address1: '48104',
  //  child: 'Junior Jones',
  //  email: 'test@test.com',
  //  phone:'123-456-7890'
  //};
  //
  //var allData =[];
  //for (var ii=0;ii<10000;ii++){
  //  userData.id=ii;
  //  client.hmset('user number '+ii, userData);
  //  client.hgetall('user number '+ii, function(err, object) {
  //    if (err) next(err);
  //    console.log(object);
  //    //if (ii >= 9999) res.json(allData);
  //  });
  //}


  res.send(200);


});

module.exports = router;
