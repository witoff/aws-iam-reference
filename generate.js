#!/usr/bin/env node
var exports = module.exports = {};


var https = require('https');
var fs    = require('fs') ;

exports.get_servicemap = function(callback) {
  var url = 'https://awspolicygen.s3.amazonaws.com/js/policies.js';
  https.get(url, (response) => {
    var body = '';
    response.on('data', (d) => { body += d; });
    response.on('end', () => {
      fs.writeFile(`${__dirname}/policies.js`, body, (error) => {
        if (error) console.error(error);
        else callback(body);
      });
    });
    response.on('error', (error) => {
      console.error('Error Downloading Policies.js', errormessage)
    });
  });
}

var load_policies = function (callback) {
  fs.readFile(`${__dirname}/policies.js`, 'utf8', (err, data) => {
    callback(data)
  });
}

exports.parse_servicemap = function(callback) {
  load_policies( (policies) => {
    var servicemap = policies.substring(policies.indexOf('{'));
    // verify that our json is correct
    servicemap = JSON.stringify(JSON.parse(servicemap), null, 2);
    fs.writeFile(`${__dirname}/servicemap.json`, servicemap, (err) => {
      if (err) console.error(error);
      callback(servicemap);
    });
  });
}

exports.run = function(callback) {
  exports.get_servicemap( (data) => {
    exports.parse_servicemap(callback)
  });
}



if (!module.parent) {
  // only run if this is the main module
  exports.run(console.log)
}
