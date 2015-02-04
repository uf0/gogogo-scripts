var request = require('request'),
    fs = require('fs'),
    CONFIG = require('./config.js');

var options = {
  url: CONFIG.url
}


request(options, function(err, res, body) {
  if(err){console.log(err)}
  else{ 
    var data = JSON.parse(body)
    fs.writeFile("data/routes.json", JSON.stringify(data, null, 2), function(err) {
      if(err) {
        console.log(err);
      }else{
        console.log("file saved!")
      }
    });
  }
});