var fs = require('fs'),
    turf = require('turf'),
    d3 = require('d3');

var createPoster = function(hlTeamId){

  var teams = JSON.parse(fs.readFileSync('output/routesperteam.json', encoding='utf8')),
      title = fs.readFileSync('data/title.svg'),
      date = fs.readFileSync('data/date.svg'),
      rex = /(<([^>]+)>)/ig,
      width = 1417.32,
      height = 1984.25;

  title = title.toString();
  date = date.toString();


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

  })


  var delunayScaleX = d3.scale.ordinal().domain(d3.range(7)).rangeBands([0,1179],0,0)
  var delunayScaleY = d3.scale.ordinal().domain(d3.range(13)).rangeBands([0,1683],0,0)

  var delunayW = delunayScaleX.rangeBand(),
      delunayH = delunayScaleY.rangeBand();

  if(!d3.select("svg").empty()){
    d3.select("svg").remove();
  }

  var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

  var delunay = svg.append("g").attr("transform", "translate(134, 200)")


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
      .attr("stroke-width", 0.5)

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
     .attr("fill-opacity", 0.75)
     .attr("stroke", 'white')
     .attr("stroke-width", 0.25)

    if(hlTeamId){
      team
        .filter(function(d){
          return d.tin.id == hlTeamId
        })
        .append("rect")
        .attr("width", delunayW)
        .attr("height", delunayH)
        .attr("fill", "none")
        .attr("stroke", "#f00")
        .attr("stroke-width", 0.5)

      team
        .filter(function(d){
          return d.tin.id == hlTeamId
        })
        .append("text")
        .attr("x", 0)
        .attr("y", -5)
        .text(function(d){
          return d.tin.id
        })
    }


  svg.append("g").attr("transform", "translate(49, 43)").html(title)
  svg.append("g").attr("transform", "translate(60, 1756)").html(date)

  var svgGraph = d3.select('body')
  fs.writeFileSync('output/posters/team_' + hlTeamId +'.svg', svgGraph.html());

}

var teamsId = JSON.parse(fs.readFileSync('output/routesperteam.json', encoding='utf8'))
    rex = /(<([^>]+)>)/ig;

teamsId = teamsId.map(function(d){return d.key.replace(rex , "");})

teamsId.forEach(function(d){
  createPoster(d);
  console.log(d)
})

