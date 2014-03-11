// Generates a Map using leafletJs

function leafletInitMap() {
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(leafletMap);
}

function leafletIterate(lat,lng) {
	L.marker([lat, lng]).addTo(leafletMap);
}