var turf = require('turf');
// generate some random point data
var points = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[4.9177354,52.3465856]},"properties":{"z":3}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.9163542,52.3469871]},"properties":{"z":2}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8899484,52.3730211]},"properties":{"z":8}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8964243,52.3663069]},"properties":{"z":1}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8967919,52.3663921]},"properties":{"z":7}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.9022245,52.3671528]},"properties":{"z":0}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.902063,52.3671386]},"properties":{"z":3}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.9099344,52.3580147]},"properties":{"z":6}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8979563,52.3779581]},"properties":{"z":0}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8678731,52.3660249]},"properties":{"z":1}},{"type":"Feature","geometry":{"type":"Point","coordinates":[5.3892318,52.4175527]},"properties":{"z":4}},{"type":"Feature","geometry":{"type":"Point","coordinates":[5.346411,52.4142739]},"properties":{"z":1}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8832725,52.363522]},"properties":{"z":6}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.876529,52.3744494]},"properties":{"z":5}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8764934,52.3744208]},"properties":{"z":2}},{"type":"Feature","geometry":{"type":"Point","coordinates":[4.8734091,52.3747047]},"properties":{"z":2}}]};
//=points
// add a random property to each point between 0 and 9
// for (var i = 0; i < points.features.length; i++) {
//   points.features[i].properties.z = ~~(Math.random() * 9);
// }

var tin = turf.tin(points, 'z')

console.log(JSON.stringify(tin))