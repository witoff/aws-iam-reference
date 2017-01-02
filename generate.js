#!/usr/bin/env node
var exports = module.exports = {};


var https = require('https');
var fs    = require('fs') ;

exports.get_servicemap = function(callback) {
  var url = 'https://awsiamconsole.s3.amazonaws.com/iam/assets/js/bundles/policies.js';
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
    // Extract the ServiceMap
    var separator = 'serviceMap:';
    var index = policies.indexOf(separator) + separator.length;
    var chars = policies.substring(index).split('');
    // Parse just the JSON object
    var obj = [];
    var lb=rb=0;
    for (var i = 0; i < chars.length; i++) {
      c = chars[i];
      if (c=='{') lb++;
      if (c=='}') rb++;
      obj.push(c);
      if (lb>0 && lb==rb) break;
    }
    // Turn Javascript Object into JSON (FML -- can't aws just give us the JSON?)
    var servicemap = obj.join('')
    //   servicemap = obj.join.gsub(/\s/, '')
    // Cleanup Exceptions
    servicemap = servicemap.replace(/HasResource:\!([0-9]+)/g, 'HasResource:"!$1"');
    servicemap = servicemap.replace(/ARNRegex:("[^"]*")/g, 'ARNRegex:"REMOVED"');
    // turn objects into strings e.g. test:[] => "test":[]
    servicemap = servicemap.replace(/([a-zA-Z0-9_]+):([\[{0-9"])/g, '"$1":$2');
    // verify that our json is correct
    JSON.parse(servicemap)
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
