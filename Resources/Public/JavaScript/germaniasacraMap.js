// Generates a Map using leafletJs

$(function() {
	if (document.location.href.indexOf('mode=map') > -1) {
		leafletMapGrow();
	}
});

function leafletMapSwitchMapParameter(mode) {

	switch (mode) {
		case "list":
			/* remove attribute */
			$('.facetList a').attr('href', function(i, hash) {
				return (hash.replace(/\&mode=map/g, ""));
			});
		case "map":
			/* add attribute if necessary */
			if (window.location.href.indexOf("mode=") == -1) {
				$('.facetList a').attr('href', function(i, hash) {
					return hash + (hash.indexOf('?') != -1 ? "&mode=map" : "?mode=map");
				});
			}
	}
}

function leafletMapInit() {

	leafletMap_markers = new L.MarkerClusterGroup({ maxClusterRadius: 30 });

	/* Hide previous link below map */
	$("#leafletMap_id").next("a").toggle();
	/* Hide title for map */
	$(".facet-id-map h1").css("display", "none");
	/* Create link */
	$(".facet-id-map").prepend('<a class="leafletMap_resize leafletMap_resizeLink">' +
	                           'Rechercheergebnisse in Kartenansicht anzeigen' +
	                           '</a>');
	$(".leafletMap_resizeLink").css("font-family", "Cambria, Georgia, serif");

	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap);

	/* remove handlers */
	leafletMap.scrollWheelZoom.disable();
	leafletMap.dragging.disable();
	leafletMap.touchZoom.disable();
	leafletMap.doubleClickZoom.disable();
	if (leafletMap.tap) {
		leafletMap.tap.disable();
	}
	;

	/* add function */
	$(".leafletMap_resize").on("click", function() {
		leafletMapGrow();
	});
	return true;
}

function leafletMapAddDiverseMarkers() {

	/*
	 check, if document loaded
	 remove old icons,
	 add URLparameter to create page with all information
	 read the page and create the markers
	 */

	$(document).ready(function() {

		/* get map boundaries */
		var bounds = leafletMap.getBounds();
		var southWest = bounds.getSouth() + "," + bounds.getWest();
		var northEast = bounds.getNorth() + "," + bounds.getEast();

		/* create QueryString */
		var url = $(location).attr("href");
		if (url.indexOf("?") != "-1") {
			var pageID = url.substring(0, url.indexOf("?"));
		} else {
			pageID = url + "/";
		}
		var dataFields = "koordinaten:[" + southWest + "%20TO%20" + northEast + "]\%20AND%20typ:standort-orden&tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data&tx_find_find[data-fields]=id,kloster_id,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal";
		url = document.baseURI + germaniaSacra.config.queryURLTemplate.replace('%23%23%23TERM%23%23%23', dataFields);

		/* get information from JSON-Object */
		var shadowURL = $(".leaflet-marker-icon").attr("src");
		var doc, docIndex, mydata, docs, orden_graphik;
		var kLocation, kOrden, kName, kOrden, kID, kURL, kVVerbal, kBVerbal, kKloster, kLink;
		var kIFolder = germaniaSacra.config.resourcesBaseURL + "Ordenssymbole/"
		var kIconDef = kIFolder + "Kloster_allgemein.png";
		var kSIcon = kIFolder + "Shadow.png";
		jQuery.getJSON(url, function(data) {
			docs = data.response.docs;
			for (index in docs) {
				kID = docs[index].kloster_id;
				kLocation = docs[index].koordinaten;
				kLocation = docs[index].koordinaten.pop().split(",");
				leafletMap_markers[0][kID] = {};
				leafletMap_markers[0][kID]["kOrden"] = docs[index].orden;
				leafletMap_markers[0][kID]["kName"] = docs[index].kloster;
				leafletMap_markers[0][kID]["kKloster"] = docs[index].kloster;
				leafletMap_markers[0][kID]["kVVerbal"] = docs[index].orden_von_verbal;
				leafletMap_markers[0][kID]["kBVerbal"] = docs[index].orden_bis_verbal;
				leafletMap_markers[0][kID]["kLink"] = document.baseURI + germaniaSacra.config.IDURLTemplate.replace('%23%23%23ID%23%23%23', kID);
				leafletMap_markers[0][kID]["orden_graphik"] = kIFolder + docs[index].orden_graphik + ".png";
				/* check, if no icon was defined */
				if (leafletMap_markers[0][kID]["orden_graphik"].indexOf("/.") != "-1") {
					kIcon = L.icon({
						               iconUrl: kIconDef,
						               iconSize: [21, 32],
						               iconAnchor: [10.5, 32],
						               popupAnchor: [0, -32]
					               });
				} else {
					kIcon = L.icon({
						               iconUrl: leafletMap_markers[0][kID]["orden_graphik"],
						               iconSize: [21, 32],
						               iconAnchor: [10.5, 32],
						               popupAnchor: [0, -32]
					               });
				}
				var tmp = germaniaSacra.config.IDURLTemplate.replace('%23%23%23ID%23%23%23', docs[index].kloster_id);
				kURL = $(location).attr("href") + tmp.substring(tmp.indexOf("?"), tmp.length);

				/*
				 add the icon,
				 and its popup
				 */
				leafletMap_markers[1][kID] = new Array();
				leafletMap_markers[1][kID][0] = '<p id="' + kID + '"><h3><a href="' + leafletMap_markers[0][kID]["kLink"] + '">' + leafletMap_markers[0][kID]["kKloster"] + "</a></h3><b>Lage:</b> " + leafletMap_markers[0][kID]["kVVerbal"] + " bis " + leafletMap_markers[0][kID]["kBVerbal"] + "<br /><b>Orden:</b> " + leafletMap_markers[0][kID]["kOrden"] + "</p>";
				leafletMap_markers[1][kID][1] = L.marker([kLocation[0], kLocation[1]], {
					icon: kIcon
				}).addTo(leafletMap)
				leafletMap_markers[1][kID][1].bindPopup();
				leafletMap_markers[1][kID][1].setPopupContent(leafletMap_markers[1][kID][0]);

			}
		});
	});
}

function leafletMapGrow() {

	/*
	 The map moves from top right to the whole left side.
	 The pager has to be removed from dom
	 The map has to be resized
	 The mouse- and keyboard controls have to be put in place again
	 */

	leafletMapSwitchMapParameter("map");

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

	/* add scale to large map */
	L.control.scale().addTo(leafletMap);

	/* put back handlers */
	leafletMap.scrollWheelZoom.enable();
	leafletMap.dragging.enable();
	leafletMap.touchZoom.enable();
	leafletMap.doubleClickZoom.enable();
	if (leafletMap.tap) {
		leafletMap.tap.enable();
	}
	;

	/* reorient map, according to markers */
	leafletMap.setView([51.2, 10.9], 6);
	// Vielleicht: leafletMap.getCenter();

	/* Show again previous link below map */
	$("#leafletMap_id").next("a").toggle();

	/* rename Links and change their function */
	$(".leafletMap_resizeLink").text("Rechercheergebnisse in Listenansicht anzeigen");
	$(".leafletMap_zoom i").toggleClass("fa-compress fa-expand");
	$(".leafletMap_resize").off();
	$(".leafletMap_resize").on("click", function() {
		leafletMapShrink();
	});


	/* add popup-Content */

	return true
}

function leafletMapShrink() {

	leafletMapSwitchMapParameter("list");

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

	/* remove scale */
	$('.leaflet-control-scale').hide();

	/* remove handlers */
	leafletMap.scrollWheelZoom.disable();
	leafletMap.dragging.disable();
	leafletMap.touchZoom.disable();
	leafletMap.doubleClickZoom.disable();
	if (leafletMap.tap) {
		leafletMap.tap.disable();
	}
	;
	/* Hide previous link below map */
	$("#leafletMap_id").next("a").toggle();

	/* rename links and change their function */
	$(".leafletMap_resizeLink").text("Rechercheergebnisse in Kartenansicht anzeigen");
	$(".leafletMap_zoom i").toggleClass("fa-compress fa-expand");
	$(".leafletMap_resize").off();
	$(".leafletMap_resize").on("click", function() {
		leafletMapGrow();
	});

	/* remove Popups */

}

function leafletMapIterate(lat, lng) {
	leafletMap_markers.addLayer(L.marker([lat, lng]));
	leafletMap.addLayer(leafletMap_markers);
}