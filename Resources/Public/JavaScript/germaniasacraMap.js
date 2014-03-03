// Generates a Map using leafletJs

function initMap() {
  var map = L.map('lmap').setView([51.32, 9.56], 5);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);
}

