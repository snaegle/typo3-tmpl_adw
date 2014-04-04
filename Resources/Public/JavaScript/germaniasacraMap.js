// Generates a Map using leafletJs

function leafletMapInit() {
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap);

	/* remove handlers */
	leafletMap.scrollWheelZoom.disable();
	leafletMap.dragging.disable();
	leafletMap.touchZoom.disable();
	leafletMap.doubleClickZoom.disable();
	if (leafletMap.tap) {
		leafletMap.tap.disable();
	};

	/* add function */
	$(".leafletMap_resize").on("click", function() {
		leafletMapGrow();
	});
	return true;
}


function leafletMapGrow() {

	/*
		The map moves from top right to the whole left side.
		The pager has to be removed from dom
		The map has to be resized
		The mouse- and keyboard controls have to be put in place again
	 */

	/* remove pager */
	$(".navigation .pager").toggle();
	$(".navigation .resultCount").toggle();
	leafletMap_resultsList = $(".grid_12 .resultList").toggle();

	/* store small Size */
	leafletMap_widthSmall = $("#leafletMap_id").width();
	leafletMap_heightSmall = $("#leafletMap_id").height();

	/* store element properties */
	leafletMap_resultsWidth = $(".grid_12").width();
	leafletMap_resultsHeight = $(".grid_12").height();
	leafletMap_heightBig = 750;
	leafletMap_widthBig = leafletMap_resultsWidth;
	leafletMap_content = $(".facet-id-map");

	/* move map */
	$(".grid_12").last().prepend(leafletMap_content);
	$("#leafletMap_id").height(leafletMap_heightBig).width(leafletMap_widthBig);
	leafletMap.invalidateSize();

	/* put back handlers */
	leafletMap.scrollWheelZoom.enable();
	leafletMap.dragging.enable();
	leafletMap.touchZoom.enable();
	leafletMap.doubleClickZoom.enable();
	if(leafletMap.tap) {
		leafletMap.tap.enable();
	};

	/* reorient map, according to markers */
	leafletMap.setView([51.2,10.9],6);
	// Vielleicht: leafletMap.getCenter();

	/* rename Links and change their function */
	$("#leafletMap_resizeLink").text("Interaktive Karte schließen");
	$(".leafletMap_zoom i").toggleClass("fa-compress fa-expand");
	$(".leafletMap_resize").off();
	$(".leafletMap_resize").on("click", function() {
		leafletMapShrink();
	});


	/* add popup-Content */

	return true
}

function leafletMapShrink() {

	/* put back pager */
	$(".navigation .pager").toggle();
	$(".navigation .resultCount").toggle();
	$(".grid_12 .resultList").toggle();


	/* store element properties */
	leafletMap_content = $(".facet-id-map");

	/* move map */
	leafletMap_content.prependTo(".facet-id-orden");
	$("#leafletMap_id").height(leafletMap_heightSmall).width(leafletMap_widthSmall);
	leafletMap.invalidateSize();

	/* reorient Map, according to markers */
	leafletMap.setView([52, 14], 3);

	/* remove handlers */
	leafletMap.scrollWheelZoom.disable();
	leafletMap.dragging.disable();
	leafletMap.touchZoom.disable();
	leafletMap.doubleClickZoom.disable();
	if(leafletMap.tap) {
		leafletMap.tap.disable();
	};

	/* rename links and change their function */
	$("#leafletMap_resizeLink").text("Interaktive Karte öffnen");
	$(".leafletMap_zoom i").toggleClass("fa-compress fa-expand");
	$(".leafletMap_resize").off();
	$(".leafletMap_resize").on("click", function() {
		leafletMapGrow();
	});

	/* remove Popups */

}

function leafletMapIterate(lat,lng) {
	L.marker([lat, lng]).addTo(leafletMap);
}