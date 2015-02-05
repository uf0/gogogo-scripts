var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3');

var routes = JSON.parse(fs.readFileSync('output/videodata.json', encoding='utf8'));

var routesbyteam = d3.nest()
                    .key(function(d){return d.properties.teamid})
                    .rollup(function(leaves){
                      leaves.forEach(function(d){
                        var distance = turf.lineDistance(d, 'kilometers');
                        d.properties.distance = distance;
                      })
                      return leaves;
                    })
                    .entries(routes.features)

fs.writeFile("output/routesperteam.json", JSON.stringify(routesbyday, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});