var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3');

var routes = JSON.parse(fs.readFileSync('output/routesclean.json', encoding='utf8')),
	districts = JSON.parse(fs.readFileSync('data/districts.json', encoding='utf8'));


var routesPoint = d3.merge(routes.map(function(d){return d.route}))

var pointsbyday = d3.nest()
                    .key(function(d){
                            var date = new Date(parseInt(d.timestamp))
                            return d3.time.day(date)
                        })
                    .entries(routesPoint)

pointsbyday.forEach(function(d,i){

  var points = [],
      output;

  d.values.forEach(function(e){
    var lat = parseFloat(e.coordinates.latitude),
       lon = parseFloat(e.coordinates.longitude);

    points.push(turf.point([lon,lat]));

  });

  points = turf.featurecollection(points)

  output = turf.count(districts, points, 'pt_count');

  fs.writeFileSync("output/pind_" + i +".json", JSON.stringify(output, null, 2));

  console.log("saved file for day: " + d.key)

})

