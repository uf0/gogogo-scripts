var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3'),
    xmldom = require('xmldom');

var teams = JSON.parse(fs.readFileSync('output/routesperteam.json', encoding='utf8')),
    rex = /(<([^>]+)>)/ig,
    width = 1190.55,
    height = 1683.78;

teams.sort(function(a, b){return b.values.length-a.values.length})

var data  = []

teams.forEach(function(team, i){

  var routes = team.values;
      teamid = team.key.replace(rex , "");

  var points = []
  routes.forEach(function(d){
    var first = d.geometry.coordinates[0],
        last = d.geometry.coordinates[d.geometry.coordinates.length-1];
    points.push(turf.point(first, {z: ~~(Math.random() * 9)}))
    points.push(turf.point(last, {z: ~~(Math.random() * 9)}))
  })

  if(points.length > 2){
    points = turf.featurecollection(points);
    var tin = turf.tin(points, 'z');
    
    tin.id = teamid;
    data.push({tin:tin, points:points})
  }else{
    var line = []
    points.forEach(function(d){
      line.push(d.geometry.coordinates)
    })
    var linestring = turf.linestring(line)
    var fc = turf.featurecollection([linestring]);
    fc.id = teamid;
    points = turf.featurecollection(points);
    data.push({tin:fc, points:points})
  }

  // var width = 595,
  //     height = 842;

  // if(i>0){
  //   d3.select("svg").remove();
  // }

  // var svg = d3.select("body").append("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .append("g")

  // var projection = d3.geo.mercator(),
  //     path = d3.geo.path().projection(projection),
  //     b = path.bounds(points),
  //     s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
  //     t = [width/ 2, height / 2],
  //     center = d3.geo.centroid(points);

  // projection.scale(s).translate(t).center(center)

  // var triangle = svg.selectAll(".triangle").data(tin.features)

  // triangle
  //   .enter()
  //   .append("path")
  //   .attr("class", "triangle")
  //   .attr("d", path)
  //   // .attr("fill-opacity", function(d){
  //   //   return (Math.floor((Math.random() * 10) + 1))/10;
  //   // })
  //   // .attr("fill", "#222")
  //   .attr("fill", "none")
  //   .attr("stroke", "black")

  // path.pointRadius(3)

  // var pointsTriangle = svg.selectAll(".pointstriangle").data(points.features)

  // pointsTriangle
  //   .enter()
  //   .append("path")
  //   .attr("class", "pointstriangle")
  //   .attr("d", path)
  //   .attr("fill", "#f00")
  //   .attr("stroke", "white")


  // var svgGraph = d3.select('body')
  // fs.writeFileSync('output/posters/' + teamid + '.svg', svgGraph.html());
  // console.log("file saved! " + teamid)
})


var delunayScaleX = d3.scale.ordinal().domain(d3.range(7)).rangeBands([0,808],0,0)
var delunayScaleY = d3.scale.ordinal().domain(d3.range(13)).rangeBands([0,1386],0,0)

var delunayW = delunayScaleX.rangeBand(),
    delunayH = delunayScaleY.rangeBand();

// var projection = d3.geo.mercator(),
//     path = d3.geo.path().projection(projection);

// var setProjection = function(projection,features,width,height){
    
//     var b = path.bounds(features),
//         s = 100 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
//         t = [width/ 2, height / 2],
//         center = d3.geo.centroid(features);

//         return projection.scale(s).translate(t).center(center)
// }

var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)

var delunay = svg.append("g").attr("transform", "translate(190.983, 148.819)")


var teams = delunay.selectAll("g").data(data)

var team = teams.enter().append("g")
    .attr("transform", function(d,i){
      return "translate(" + delunayScaleX(i-(Math.floor(i/7)*7)) + ", " + delunayScaleY(Math.floor(i/7)) +")"
    })

team
    .append("path")
    .attr("class", "triangle")
    .attr("d", function(d){
      var projection = d3.geo.mercator(),
          path = d3.geo.path().projection(projection);

      var b = path.bounds(d.points),
        s = 100 / Math.max((b[1][0] - b[0][0]) / delunayW, (b[1][1] - b[0][1]) / delunayH),
        t = [delunayW/ 2, delunayH / 2],
        center = d3.geo.centroid(d.points);

      projection.scale(s).translate(t).center(center)

      return path(d.tin);
    })
    .attr("fill", "none")
    .attr("stroke", "black")

team
    .append("path")
    .attr("class", "circle")
    .attr("d", function(d){
      var projection = d3.geo.mercator(),
          path = d3.geo.path().projection(projection);


      var b = path.bounds(d.points),
        s = 100 / Math.max((b[1][0] - b[0][0]) / delunayW, (b[1][1] - b[0][1]) / delunayH),
        t = [delunayW/ 2, delunayH / 2],
        center = d3.geo.centroid(d.points);

      path.pointRadius(2)

      projection.scale(s).translate(t).center(center)

      return path(d.points);
    })
   .attr("fill", "#f00")
    .attr("stroke", 'white')
    .attr("stroke-width", 0.25)

var svgGraph = d3.select('body')
fs.writeFileSync('output/test.svg', svgGraph.html());

// var svgGraph = d3.select('svg')
//   .attr('xmlns', 'http://www.w3.org/2000/svg');
//var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);
//fs.writeFileSync('output/' + teamid + '.svg', svgXML);
