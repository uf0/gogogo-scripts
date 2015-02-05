var fs = require('fs'),
	turf = require('turf');

var data = JSON.parse(fs.readFileSync('data/routes.json', encoding='utf8')),
	output = [];

data.forEach(function(d,i) {

  	var routePoints = d.route,
        pointsNumber = routePoints.length;

    while (pointsNumber--) {

      var millisec = parseInt(routePoints[pointsNumber].timestamp),
          date = new Date(millisec);

      if(isNaN(date.getTime())){
          routePoints.splice(pointsNumber, 1);
        }

    }

  });

fs.writeFile("output/routesclean.json", JSON.stringify(data, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});