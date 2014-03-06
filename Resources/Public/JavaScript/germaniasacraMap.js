// Generates a Map using leafletJs

function leafletInitMap() {
  var map = L.map('lmap').setView([13.56, 51.32], 3);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);
	L.geoJson(leafletJsonCoords, {
						style: function(feature) {return feature.properties;}
					}).addTo(map);
}