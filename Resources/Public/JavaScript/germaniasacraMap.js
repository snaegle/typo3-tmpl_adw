// Generates a Map using leafletJs

function leafletInitMap() {
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap);
	leafletMap.scrollWheelZoom.disable();

   $("a.leaflet-big-map").fancybox({
	   "padding": 10,
	                          afterClose: function() {
		                          $("#leaflet-map").show();
	                          }
                          });

}

function leafletIterate(lat,lng) {
	L.marker([lat, lng]).addTo(leafletMap);
}

