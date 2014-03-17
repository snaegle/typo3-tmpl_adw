// Generates a Map using leafletJs

function leafletInitMap() {
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap);
	leafletMap.scrollWheelZoom.disable();

   $("a#bigMap").fancybox({
	   "autoDimensions": false,
	   "width": 350,
	   "height": "auto"
                          });
}

function leafletIterate(lat,lng) {
	L.marker([lat, lng]).addTo(leafletMap);
}

