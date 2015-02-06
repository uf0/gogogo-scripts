var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3'),
    _ = require('underscore');

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


  var domain = _.unique(output.features.map(function(e){return e.properties.pt_count}));

  domain = d3.extent(domain);

  //domain.sort(function(a,b){return a-b})
      //range = [0,0.3,0.6,0.9];
  //var range = ['rgb(255,255,255)', 'rgb(254,229,217)','rgb(252,174,145)','rgb(251,106,74)','rgb(203,24,29)']
  //var range = ['rgb(254,229,217)','rgb(203,24,29)']

  var range = ['none','rgb(254,224,210)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)']
  var scale = d3.scale.quantize()
    .domain(domain)
    .range(range);

  output.features.forEach(function(e){
    //e.properties['fill-opacity'] = scale(e.properties.pt_count);
    e.properties['fill-opacity'] = 0.75
    e.properties['fill'] = scale(e.properties.pt_count);
    e.properties['stroke'] = "#fff";
    e.properties['stroke-width'] = 0.5;
  })

  fs.writeFileSync("output/pind_" + i +".json", JSON.stringify(output, null, 2));

  console.log("saved file for day: " + d.key)

})

