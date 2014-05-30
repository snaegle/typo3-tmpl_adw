/*
	Generates a Map using leafletJs
	Each time the page is loaded, the map is generated
		(due to problems storing objects during reloads)
	The viewing parameter of the map are stored in sessionStorage
*/

$(function() {
	if (leafletMapGetMode() == "map") {
		leafletMapGrow();
	}
});


function leafletMapGetMode() {
	var url = decodeURIComponent(document.location.href);
	var mode = false;
	if (url.indexOf('[mode]=map') > -1) {
		mode="map";
	}
	if (url.indexOf('[mode]=list') > -1) {
		mode="list";
	}
	return mode;
}

function leafletMapClearStorage() {
	sessionStorage.clear();
}

function leafletMapToggle(mode) {
	if (mode != leafletMapGetMode()) {
		switch (mode) {
			case "map":
				leafletMapGrow();
				break;
			case "list":
				if(!leafletMapGetMode()) {
					// no mode defined, hence list mode
					// nothing to do
				} else {
					leafletMapShrink();
				}
				break;
		}
	}
    return mode;
}


function leafletMapCenter(lat,lng, zoom) {
	/*
		store viewing informations for map
		persistent of reload
	 */
	if (!lat || !leafletMap.map) {
		lat = leafletMap.map.getCenter().lat;
		lng = leafletMap.map.getCenter().lng;
		zoom = leafletMap.map.getZoom();
	} else {
		leafletMap.map.setView([lat, lng], zoom);
	}
	sessionStorage.setItem("leafletMap_lat", lat);
	sessionStorage.setItem("leafletMap_lng", lng);
	sessionStorage.setItem("leafletMap_zoom", zoom);

	return lat+", "+lng+", "+zoom;
}

function leafletMapGetDataFieldsOfFacets() {
	/*
		find facet filters,
		remove them from original search string (because they are not sufficient
		and put the right number back in
	 */
	// Wenn nur eine Facette aktiv ist ist der queryURLTemplate-Search String anders:
	//tx_find_find[q][orden-facet-nojoin]=Benediktiner statt [facet][orden][Benediktiner]=1

	searchString = decodeURI(location.href);
	// escape tx_find[facet] and the two accending brackets
	var result = searchString.match(/tx_find_find\[facet\]\[([^\]]+)\]\[([^\]]+)\]/g);
	if (result) {
		var str = result[0]+"=1";
		for (var i=1; i < result.length; i++) {
			str += "&"+result[i]+"=1";
		}
	} else {
		str = "";
	}
	return str;
}

function leafletMapGetDataFieldsOfFacets() {
	/* VON GITHUB */
	/*
		find facet filters,
		remove them from original search string (because they are not sufficient
		and put the right number back in
	 */
	searchString = decodeURI(location.href);
	// escape tx_find[facet] and the two accending brackets
	var result = searchString.match(/tx_find_find\[facet\]\[([^\]]+)\]\[([^\]]+)\]/g);
	if (result) {
		var str = result[0]+"=1";
		for (var i=1; i < result.length; i++) {
			str += "&"+result[i]+"=1";
		}
	} else {
		str = "";
	}
	return str;
}


function leafletMapSetViewToMarkerBounds() {
	/* changes view of map according to all markers presently shown */
	_bounds = leafletMap.markers.markerGroup.getBounds()
	if (_bounds.isValid()) {
			leafletMap.map.fitBounds(_bounds)
	}
}


function leafletMapInit() {
	/*
		create map and fill with markers
	*/

	leafletMap.markers = {};
	leafletMap.markers.marker = [];
	leafletMap.markers.popup = [];
	leafletMap.markers.marker.push();
	leafletMap.markers.popup.push();
	sessionStorage.setItem("leafletMap_facetFields", "");

	/* create dom-element as container for map */
	$(".results").find(".navigation").next(".grid_12")
			.append('<div id="leafletMap_wrapper">'+
					'<div id="leafletMap_id"></div>'+
					'<div id="leafletMap_spinner">'+
					'<i class="fa fa-spinner fa-spin fa-3x"></i>'+
					'</div>'+
					'</div>');

	// create map
	leafletMap.map = L.map('leafletMap_id', {minZoom: 2});

	// set viewPort, depending of earlier settings
	if (!sessionStorage.leafletMap_lat) {
		leafletMapCenter("50", "10", "5");
	} else {
		leafletMapCenter(sessionStorage.leafletMap_lat, sessionStorage.leafletMap_lng, sessionStorage.leafletMap_zoom);
	}
	// make map stores its viewPort
	leafletMap.map.on("moveend", function() {
		leafletMapCenter(leafletMap.map.getCenter().lat, leafletMap.map.getCenter().lng, leafletMap.map.getZoom());
	});

	/* create the tile layer with correct attribution */
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
	leafletMap.map.addLayer(osm);

	 /* add scale to map */
	L.control.scale().addTo(leafletMap.map);
	leafletMap.markers.markerGroup = new L.MarkerClusterGroup({
		zoomToBoundsOnClick: false,
		showCoverageOnHover: false,
		disableClusteringAtZoom: 7
	});
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(leafletMap.map);


	leafletMapSetViewToMarkerBounds();
	leafletMap.loaded = true;
	return leafletMap.loaded;
}


function leafletMapGrow() {
	/* Only if not loaded and filled yet */

	if (!leafletMap.loaded) {
		leafletMapInit();
	}
	if (!leafletMap.grown) {
	/* switch content */
	$(".navigation").children().toggle();
	$(".resultList").toggle();
	if ($("#leafletMap_id").css("display") === "none") {
		$("#leafletMap_id").toggle();
	}

	/* change size of map container */
	$("#leafletMap_id").css("height", "600px");

	/* move map */
	for (index in leafletMap.map._layers) {
		leafletMap.map.removeLayer[index]
	}
	leafletMap.map.invalidateSize();

	/* reorient map, according to former view (if existent) */
	leafletMapCenter();

	leafletMapAddDiverseMarkers();

	// the parameter has to be explicitly removed first, than  set
	tx_find.changeURLParameterForPage("mode");
	tx_find.changeURLParameterForPage("mode", "map");
	leafletMap.grown = true;
	}
}

function leafletMapShrink() {
	/* switch content */
	$(".navigation").children().toggle();
	$(".resultList").toggle();
	$("#leafletMap_id").toggle();

	// the parameter has to be explicitly removed first, than  set
	tx_find.changeURLParameterForPage("mode");
	tx_find.changeURLParameterForPage("mode", "list");

	leafletMap.grown = false;
}

function leafletMapAddDiverseMarkers() {
	/*
		add URLparameter to create page with all information
		read the page and create the markers
		has to wait until object "germaniaSacra" is filled completely

		if either bistum or orden of monasteries are the same,
			merge information rather than create several markers
	*/
	$.when($.ajax().done(function() {
		// hide loading spinner
		$("#leafletMap_spinner").css("display", "none");
    if (!leafletMap.filled && leafletMap.loaded) {

	/* get map boundaries */
	var southWest = [36.006667,-9.5008];
	var northEast = [80.75, 66.966667];

	/* generation of search string with different markers, but breaks when facet filters active */
	var solrQuery = 'koordinaten:[';
	solrQuery += southWest;
	solrQuery += ' TO ';
	solrQuery += northEast;
	solrQuery += '] AND typ:standort-orden';
	var dataFields = 'id,kloster_id,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal';
	// germaniaSacra.config.queryURLTemplate is to broken to be used
	//var queryURL = germaniaSacra.config.queryURLTemplate.replace('%23%23%23TERM%23%23%23', escapedQuery);
	var _facetFields = leafletMapGetDataFieldsOfFacets();
	var queryURL = "tx-find-data";
	queryURL += location.pathname;
	queryURL += "?tx_find_find[q][raw]=";
	queryURL += encodeURIComponent(solrQuery);
	queryURL += '&' + encodeURIComponent('tx_find_find[data-fields]') + '=' + encodeURIComponent(dataFields);
	queryURL += '&' + "tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data"
	queryURL += '&'+_facetFields;
	var url = document.baseURI + queryURL;


	/* STRING
		Zusammengefasste Datensätze, aber beide Filter berücksichtigt:
	    http://adw.dev/tx-find-data/forschung/forschungsprojekte-akademienprogramm/germania-sacra/klosterdatenbank/?tx_find_find[q][raw]koordinaten:[36.006667,-9.5008%20TO%2080.75,66.966667]%20AND%20typ:standort-orden&tx_find_find[data-fields]=id,kloster_id,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal&tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data&tx_find_find[facet][orden][Benediktiner]=1&tx_find_find[facet][orden][Kanoniker]=1
		Getrennte Datensätze, aber nur ein Filter:
		http://adw.dev/tx-find-data/forschung/forschungsprojekte-akademienprogramm/germania-sacra/klosterdatenbank/?tx_find_find[q][raw]=koordinaten:[36.006667,-9.5008%20TO%2080.75,66.966667]%20AND%20typ:standort-orden&tx_find_find[data-fields]=id,kloster_id-nojoin,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal&tx_find_find[count]=3000&tx_find_find[default-nojoin]=1&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data&tx_find_find[orden-facet-nojoin]=Kanoniker
	*/

	/* generation of search string with combined search strings, but facet filters active */
/*
	var solrQuery = 'koordinaten:[';
	solrQuery += southWest;
	solrQuery += ' TO ';
	solrQuery += northEast;
	solrQuery += '] AND typ:standort-orden';
	var escapedSolrQuery = encodeURIComponent(solrQuery);
	var dataFields = 'id,kloster_id,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal';
	var escapedDataFields = encodeURIComponent(dataFields);
	// germaniaSacra.config.queryURLTemplate is to broken to be used
	//var queryURL = germaniaSacra.config.queryURLTemplate.replace('%23%23%23TERM%23%23%23', escapedQuery);
	var queryURL = "tx-find-data";
	queryURL += location.pathname;
	queryURL += "?tx_find_find[q][raw]"+escapedSolrQuery;
	queryURL += '&' + encodeURIComponent('tx_find_find[data-fields]') + '=' + escapedDataFields;
	queryURL += '&' + "tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data"
	queryURL += '&'+leafletMapGetDataFieldsOfFacets();
	var url = document.baseURI + queryURL;
*/

		/* get information from JSON-Object */
		/*
			Problem:
				* a monastery can have several coordinates -
					than it has to have a new marker each time, or
				* it can have several times, orden, names, whatever
				*   than it has to have the same marker
		 */
		var shadowURL = $(".leaflet-marker-icon").attr("src");
		var doc, docIndex, mydata, docs, orden_graphik;
		var kLocation, kOrden, kName, kOrden, kID, kURL, kVVerbal, kBVerbal, kKloster, kLink;
		var kIFolder = germaniaSacra.config.resourcesBaseURL + "Ordenssymbole/"
		var kDefIcon = kIFolder + "Kloster_allgemein.png";
		var kShadIcon = kIFolder + "Shadow.png";
		jQuery.getJSON(url, function(data) {
			docs = data.response.docs;
			for (index in docs) {
		        kID = docs[index].kloster_id;
		        kLocation = docs[index].koordinaten;
		        kLocation = kLocation.toString().split(",");
		        leafletMap.markers.marker[kID] = {};
				leafletMap.markers.marker[kID].kID = docs[index].id;
				leafletMap.markers.marker[kID].kKoordinaten = docs[index].koordinaten;
		        leafletMap.markers.marker[kID].kOrden = docs[index].orden;
				leafletMap.markers.marker[kID].kOrt = docs[index].ort;
				leafletMap.markers.marker[kID].kStandortOrden = docs[index].id;
		        leafletMap.markers.marker[kID].kName = docs[index].kloster;
		        leafletMap.markers.marker[kID].kKloster = docs[index].kloster;
		        leafletMap.markers.marker[kID].kVVerbal = docs[index].orden_von_verbal;
		        leafletMap.markers.marker[kID].kBVerbal = docs[index].orden_bis_verbal;
		        leafletMap.markers.marker[kID].kLink = document.baseURI + germaniaSacra.config.IDURLTemplate.replace('%23%23%23ID%23%23%23', kID);
		        leafletMap.markers.marker[kID].orden_graphik = kIFolder + docs[index].orden_graphik + ".png";
		        /* check, if no icon was defined or monastry has several denominations */
					/* is it a new monastery or has there already been the same StandortOrden? */
				/* there is a problem if a monastry has several places, but they are not in order! */
				tmp = leafletMap.markers.marker[kID].kID.split("-");
				 if ((leafletMap.markers.marker[kID].orden_graphik.indexOf("/.") != "-1")  ||
				      (tmp[3] != 1)) {
			        kIcon = L.icon({
				                   iconUrl: kDefIcon,
				                   iconSize: [21, 32],
				                   iconAnchor: [10.5, 32],
				                   popupAnchor: [0, -32]
				    });
			} else {
			    kIcon = L.icon({
				                   iconUrl: leafletMap.markers.marker[kID].orden_graphik,
				                   iconSize: [21, 32],
				                   iconAnchor: [10.5, 32],
				                   popupAnchor: [0, -32]
				});
			    }

				/* is it a new monastery or has there already been the same StandortOrden? */
				/* there is a problem if a monastry has several places, but they are not in order! */
				tmp = leafletMap.markers.marker[kID].kStandortOrden.split("-");
				sessionStorage.setItem("leafletMap_tmp", tmp[3]);

				if ((leafletMap.markers.marker[kID].kKoordinaten == sessionStorage.leafletMap_coords) &&
				    (kID == sessionStorage.leafletMap_id)) {
						// same monastry
						leafletMap.markers.popup[kID].content = sessionStorage.leafletMap_content;
						leafletMap.markers.popup[kID].content += '<tr><td>';
						leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kVVerbal + " bis " + leafletMap.markers.marker[kID].kBVerbal;
						leafletMap.markers.popup[kID].content += ':</td><td>';
						leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kOrden;
						leafletMap.markers.popup[kID].content += '</td></tr>';
						sessionStorage.setItem("leafletMap_content", leafletMap.markers.popup[kID].content);
						leafletMap.markers.popup[kID].content += "</table></div>";
						leafletMap.markers.popup[kID].layer.bindPopup();
						leafletMap.markers.popup[kID].layer.setPopupContent(leafletMap.markers.popup[kID].content);
				} else {
					// new monastry or new place
					/* add the icon */
					leafletMap.markers.popup[kID] = {};
					leafletMap.markers.popup[kID].content = '<div id="' + kID + '" class="leafletMap_popup">';
					leafletMap.markers.popup[kID].content += '<h3><a href="' + leafletMap.markers.marker[kID].kLink+'">';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kKloster;
					if (leafletMap.markers.marker[kID].kKloster.indexOf(leafletMap.markers.marker[kID].kOrt) == "-1") {
						leafletMap.markers.popup[kID].content += ',<br />Standort '+leafletMap.markers.marker[kID].kOrt;
					}
					leafletMap.markers.popup[kID].content += '</a></h3>';
					leafletMap.markers.popup[kID].content += '<table><tr><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kVVerbal + " bis " + leafletMap.markers.marker[kID].kBVerbal;
					leafletMap.markers.popup[kID].content += ':</td><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kOrden;
					leafletMap.markers.popup[kID].content += '</td></tr>';
					sessionStorage.setItem("leafletMap_content", leafletMap.markers.popup[kID].content);
					leafletMap.markers.popup[kID].content += "</table></div>";
					leafletMap.markers.popup[kID].layer = L.marker([kLocation[0], kLocation[1]], {
						icon: kIcon
					}).addTo(leafletMap.markers.markerGroup);
					leafletMap.markers.popup[kID].layer.unbindPopup();
					leafletMap.markers.popup[kID].layer.bindPopup();
					leafletMap.markers.popup[kID].layer.setPopupContent(leafletMap.markers.popup[kID].content);

				}
				sessionStorage.setItem("leafletMap_ort", leafletMap.markers.marker[kID].kOrt);
				sessionStorage.setItem("leafletMap_coords", leafletMap.markers.marker[kID].kKoordinaten);
				sessionStorage.setItem("leafletMap_id", kID);
			}
	    });


	    if (_facetFields != sessionStorage.leafletMap_facetFields) {
			/* Facet fields have changed, so the viewport of the map has to be changed as well */
			sessionStorage.setItem("leafletMap_facetFields", "_facetFields");
	    }
	    leafletMap.filled = true;
	}
	leafletMap.map.addLayer(leafletMap.markers.markerGroup);

	}))

}