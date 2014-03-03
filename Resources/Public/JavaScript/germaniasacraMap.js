// Generates a Map using leafletJs

function initMap() {
  var map = L.map('lMap').setView([51.32, 9.56], 7);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);
}