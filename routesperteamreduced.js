var fs = require('fs');

var teams = JSON.parse(fs.readFileSync('output/routesperteam.json', encoding='utf8'));

teams.forEach(function(d){
  d.values.forEach(function(e){
    delete e.type
    delete e.geometry
    e["teamid"] = e.properties["teamid"]
    e["method"] = e.properties["method"]
    e["start"] = e.properties["start"]
    e["end"] = e.properties["end"]
    e["distance"] = e.properties["distance"]
    delete e.properties
  })
})

fs.writeFile("output/routesperteamreduced.json", JSON.stringify(teams, null, 2), function(err) {
  if(err) {
    console.log(err);
  }else{
    console.log("file saved!")
  }
});