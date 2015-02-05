var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3'),
    _ = require("underscore");

var routes = JSON.parse(fs.readFileSync('output/videodata.json', encoding='utf8'));

var routesbyday = d3.nest()
                    .key(function(d){
                            var date = new Date(d.properties.startDateM)
                            return d3.time.day(date)
                        })
                    .rollup(function(leaves){
                      return {
                        totRoutes: leaves.length, 
                        totKm: d3.sum(leaves, function(d) { return turf.lineDistance(d, 'kilometers');}),
                        totTeams: _.unique(leaves.map(function(d){ return d.properties.teamid})).length
                      }
                    })
                    .entries(routes.features)

fs.writeFile("output/statsperday.json", JSON.stringify(routesbyday, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});