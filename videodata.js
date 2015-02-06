var fs = require('fs'),
	turf = require('turf');

var data = JSON.parse(fs.readFileSync('data/routes.json', encoding='utf8')),
	features = [],
	output,
  minDate,
  maxDate;

data.forEach(function(d,i) {

  	var routePoints = d.route,
  		startMillDate = parseInt(routePoints[0].timestamp),
  		endMillDate = parseInt(routePoints[routePoints.length-1].timestamp),
      startDate,
      endDate,
  		lineString = [],
  		feature;

    

    startDate = new Date(startMillDate);
    endDate = new Date(endMillDate);

    if(!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())){

      if(!minDate){
        minDate = startMillDate
      }
      else{
        minDate = startMillDate < minDate ? startMillDate : minDate;
      } 

      if(!maxDate){
        maxDate = endMillDate
      }
      else{
        maxDate = endMillDate > maxDate ? endMillDate : maxDate;
      } 

      startDate.toISOString();
      endDate.toISOString();

    	var properties = {teamid: d.teamid, method: d.transport_method, start: startDate, end: endDate, startDateM:startMillDate}

    	routePoints.forEach(function(e,g){
    		var lat = parseFloat(e.coordinates.latitude),
          		lon = parseFloat(e.coordinates.longitude);
          		lineString.push([lon, lat])
              if(g == 0){
                lineString.push([lon, lat])
              }
    	});

    	feature = turf.linestring(lineString, properties)
    	features.push(feature)
    }
  })

console.log(minDate, maxDate)

features.sort(function(a, b){return a.properties.startDateM-b.properties.startDateM})
output = turf.featurecollection(features)

fs.writeFile("output/videodata.json", JSON.stringify(output, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});