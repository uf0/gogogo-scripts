var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3'),
    xmldom = require('xmldom');

var teams = JSON.parse(fs.readFileSync('output/routesperteam.json', encoding='utf8'));
//var team = teams[2];

teams.forEach(function(team, i){

  var routes = team.values;
      teamid = team.key;
  var points = []
  routes.forEach(function(d){
    var first = d.geometry.coordinates[0],
        last = d.geometry.coordinates[d.geometry.coordinates.length-1];
    points.push(turf.point(first, {z: ~~(Math.random() * 9)}))
    points.push(turf.point(last, {z: ~~(Math.random() * 9)}))
  })

  points = turf.featurecollection(points);

  var tin = turf.tin(points, 'z');

  var width = 595,
      height = 842;

  if(i>0){
    d3.select("svg").remove();
  }

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

  var projection = d3.geo.mercator(),
      path = d3.geo.path().projection(projection),
      b = path.bounds(points),
      s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [width/ 2, height / 2],
      center = d3.geo.centroid(points);

  projection.scale(s).translate(t).center(center)

  var triangle = svg.selectAll(".triangle").data(tin.features)

  triangle
    .enter()
    .append("path")
    .attr("class", "triangle")
    .attr("d", path)
    // .attr("fill-opacity", function(d){
    //   return (Math.floor((Math.random() * 10) + 1))/10;
    // })
    // .attr("fill", "#222")
    .attr("fill", "none")
    .attr("stroke", "black")

  path.pointRadius(3)

  var pointsTriangle = svg.selectAll(".pointstriangle").data(points.features)

  pointsTriangle
    .enter()
    .append("path")
    .attr("class", "pointstriangle")
    .attr("d", path)
    .attr("fill", "#f00")
    .attr("stroke", "white")


  var svgGraph = d3.select('body')
  fs.writeFileSync('output/posters/' + teamid + '.svg', svgGraph.html());
  console.log("file saved! " + teamid)
})


// var svgGraph = d3.select('svg')
//   .attr('xmlns', 'http://www.w3.org/2000/svg');
//var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);
//fs.writeFileSync('output/' + teamid + '.svg', svgXML);
