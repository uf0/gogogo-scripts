var fs = require('fs'),
	turf = require('turf');

var data = JSON.parse(fs.readFileSync('data/routes.json', encoding='utf8')),
	features = [],
	output;

data.forEach(function(d,i) {

  try{

  	var routePoints = d.route,
  		startDate = parseInt(routePoints[0].timestamp),
  		endDate = parseInt(routePoints[routePoints.length-1].timestamp),
  		lineString = [],
  		feature;
    
  	startDate = new Date(startDate);
    startDate.toISOString();

  	endDate = new Date(endDate);
    endDate.toISOString();

  	var properties = {teamid: d.teamid, method: d.transport_method, start: startDate, end: endDate}

  	routePoints.forEach(function(d){
  		var lat = parseFloat(d.coordinates.latitude),
        		lon = parseFloat(d.coordinates.longitude);
        		lineString.push([lon, lat])
  	})

  	feature = turf.linestring(lineString, properties)
  	features.push(feature)
  }
  catch(e){
    console.log(e)
  }

})

output = turf.featurecollection(features)

fs.writeFile("output/videodata.json", JSON.stringify(output, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});