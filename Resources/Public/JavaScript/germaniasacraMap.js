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


var leafletMapGetMode = function() {
	var url = decodeURIComponent(document.location.href);
	var mode = false;
	if (url.indexOf('[mode]=map') !== -1) {
		mode = "map";
	}
	if (url.indexOf('[mode]=list') !== -1) {
		mode = "list";
	}
	return mode;
};

var leafletMapToggle = function(mode) {
	if (mode != leafletMapGetMode()) {
		switch (mode) {
			case "map":
				leafletMapGrow();
				break;
			case "list":
				if (!leafletMapGetMode()) {
					// no mode defined, hence list mode
					// nothing to do
				} else {
					leafletMapShrink();
				}
				break;
		}
	}
	return mode;
};

var leafletMapGetDataFieldsOfFacets = function() {
	/*
	 find facet filters,
	 remove them from original search string (because they are not sufficient
	 and put the right number back in
	 */
	var searchString = decodeURI(location.href);
	// escape tx_find[facet] and the two accending brackets
	var result = searchString.match(/tx_find_find\[facet\]\[([^\]]+)\]\[([^\]]+)\]/g);
	if (result) {
		var str = result[0] + "=1";
		for (var i = 1; i < result.length; i++) {
			str += "&" + result[i] + "=1";
		}
	} else {
		str = "";
	}
	return str;
};

var leafletMapSetViewToMarkerBounds = function(layer) {
	/* changes view of map according to all markers presently shown */
	var _bounds = layer.getBounds();
	if (_bounds.isValid()) {
		leafletMap.map.fitBounds(_bounds, {maxZoom: 13, padding: [4, 4]});
	}
};

var leafletMapInit = function(type, id) {
	// create map
	leafletMap.markers = {};
	leafletMap.markers.marker = [];
	leafletMap.markers.popup = [];
	leafletMap.markers.marker.push();
	leafletMap.markers.popup.push();

	switch (type) {
		case "small":
			leafletMap.markers.markerGroup = new L.featureGroup();
			// add spinner to map
			$("#" + id).append('<div id="leafletMap_spinner">' +
							   '<i class="fa fa-spinner fa-spin fa-3x"></i>' +
							   '</div>');
			// maybe bring css to scss with own spinner-class
			$("#leafletMap_spinner").css("top", "150px").css("left", "100px");
			leafletMapCreateMap(id);
			leafletMapAddMarkerToSmallMap();
			leafletMapAddDiverseMarkers();
			break;
		case "big":
			leafletMap.markers.markerGroup = new L.MarkerClusterGroup({
																		  zoomToBoundsOnClick: false,
																		  showCoverageOnHover: false,
																		  disableClusteringAtZoom: 7
																	  });
			sessionStorage.setItem("leafletMap_facetFields", "");

			// create dom-element as container for map
			$(".results").find(".navigation").next(".grid_12")
				.append('<div id="leafletMap_wrapper">' +
			            '<div id="leafletMap_id"></div>' +
			            '<div id="leafletMap_spinner">' +
			            '<i class="fa fa-spinner fa-spin fa-3x"></i>' +
			            '</div>' +
			            '<div id="leafletMap_legend"><a href="' + leafletMap.legendPath + '">' + leafletMap.language.legend + '</a></div>' +
			            '</div>');
			leafletMapCreateMap(id);

			// add scale to map
			L.control.scale().addTo(leafletMap.map);
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap.map);

			// make map stores its viewPort
			$(window).unload(function() {
				leafletMapStoreView();
			});

			// create button to reset map view
			leafletMap.map.on("movestart", function() {
				leafletMapCreateResetButton();
			});
			leafletMap.changed = false;
	}
};

var leafletMapCreateResetButton = function() {

	if (leafletMap.changed) {
		$(".results").find("#leafletMap_wrapper")
				.prepend('<button class="leafletMap_reset-view">' + leafletMap.language.resetView + '</button>');

		$(".leafletMap_reset-view")
				.unbind("click")
				.on("click", function() {
						sessionStorage.clear();
						leafletMapSetViewToMarkerBounds(leafletMap.markers.markerGroup);
					});
		leafletMap.map.removeEventListener("movestart");
	}
	leafletMap.changed = true;
};

var leafletMapStoreView = function() {

	sessionStorage.setItem("lat", leafletMap.map.getCenter().lat);
	sessionStorage.setItem("lng", leafletMap.map.getCenter().lng);
	sessionStorage.setItem("zoom", leafletMap.map.getZoom());
};

var leafletMapCreateMap = function(id) {

	// create map
	leafletMap.map = L.map(id, {minZoom: 2}).setView([51, 10], 6);
	/* create the tile layer with correct attribution */
	var osmUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
	var osmAttrib = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
	var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
	leafletMap.map.addLayer(osm);

	leafletMap.loaded = true;
	return leafletMap.loaded;
};

var leafletMapGrow = function() {
	/* Only if not loaded and filled yet */
	if (!leafletMap.loaded) {
		leafletMapInit("big", 'leafletMap_id');
	}
	if (!leafletMap.grown) {
		/* switch content */
		$(".navigation").children().toggle();
		$(".resultList").toggle();
		if ($("#leafletMap_wrapper").css("display") === "none") {
			$("#leafletMap_wrapper").toggle();
		}

		/* change size of map container */
		$("#leafletMap_id").css("height", "600px");

		/* move map */
		for (index in leafletMap.map._layers) {
			leafletMap.map.removeLayer[index]
		}
		leafletMap.map.invalidateSize();

		leafletMapAddDiverseMarkers();

		$(document).ajaxComplete(function() {
			/* reorient map, according to former view (if existent) */
			if (sessionStorage.lat) {
				leafletMap.map.setView([sessionStorage.lat, sessionStorage.lng], sessionStorage.zoom);
			} else {
				leafletMapSetViewToMarkerBounds(leafletMap.markers.markerGroup);
			}
		});

		// the parameter has to be explicitly removed first, than  set
		tx_find.changeURLParameterForPage("mode");
		tx_find.changeURLParameterForPage("mode", "map");
		leafletMap.grown = true;
	}
};

var leafletMapShrink = function() {
	/* switch content */
	$(".navigation").children().toggle();
	$(".resultList").toggle();
	$("#leafletMap_wrapper").toggle();

	// the parameter has to be explicitly removed first, than  set
	tx_find.changeURLParameterForPage("mode");
	tx_find.changeURLParameterForPage("mode", "list");

	leafletMap.grown = false;
};

var getRawFacets = function(facets) {
	var pattern = 'tx_find_find[facet]';
	var rawFacetQuery = '';
	var rawFacets = facets.split('&');

	for (var rawFacet in rawFacets) {
		rawFacetQuery += rawFacets[rawFacet]
			.replace(pattern, '')
			.replace('=1', '')
			.replace(/\[(.*?)\]\[(.*?)\]/, "$1:$2");
		if ((parseInt(rawFacet) + 1) !== rawFacets.length) {
			rawFacetQuery += ' AND ';
		}
	}

	return rawFacetQuery;
};


var leafletMapAddDiverseMarkers = function() {
	/*
	 add URLparameter to create page with all information
	 read the page and create the markers
	 has to wait until object "germaniaSacra" is filled completely

	 if either bistum or orden of monasteries are the esame,
	 merge information rather than create several markers
	 */
	if (!leafletMap.filled && leafletMap.loaded) {
		/* get map boundaries */
		var southWest = [36.006667, -9.5008];
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

		var rawFacets = getRawFacets(_facetFields);
		var queryURL = "tx-find-data";
		var _location = location.pathname;
		if (_location.match("^//")) {
			_location = _location.substring(1, _location.length)
		}
		var _index = _location.indexOf("/gsn/");
		if (_index != -1) {
			queryURL += _location.substring(0, _index) + "/";
		} else {
			queryURL += location.pathname;
		}
		queryURL += "?tx_find_find[q][raw]=";
		queryURL += encodeURIComponent(solrQuery);
		if (rawFacets) {
			queryURL += ' AND ' + rawFacets;
		}
		queryURL += '&' + encodeURIComponent('tx_find_find[data-fields]') + '=' + encodeURIComponent(dataFields);
		queryURL += '&' + "tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data";

		var url = document.baseURI + queryURL;

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
		var kIFolder = resourcesBaseURL + "Ordenssymbole/";
		var kDefIcon = kIFolder + "Kloster_allgemein.png";
		var kShadIcon = kIFolder + "Shadow.png";
		$.when(jQuery.getJSON(url, function(data) {
			docs = data.response.docs;
			for (var index in docs) {
				var kID = docs[index].kloster_id;
				var kLocation = docs[index].koordinaten;
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
				var kIcon;
				if (docs[index].orden_graphik != "") {
					leafletMap.markers.marker[kID].orden_graphik = kIFolder + docs[index].orden_graphik + ".png";
					kIcon = L.icon({
										   iconUrl: leafletMap.markers.marker[kID].orden_graphik,
										   iconSize: [21, 32],
										   iconAnchor: [10.5, 32],
										   popupAnchor: [0, -32]
									   });
				} else {
					if (!kIcon) {
						kIcon = L.icon({
											   iconUrl: kDefIcon,
											   iconSize: [21, 32],
											   iconAnchor: [10.5, 32],
											   popupAnchor: [0, -32]
										   });
					}
				}
				/* is it a new monastery or has there already been the same StandortOrden? */
				/* there is a problem if a monastry has several places, but they are not in order! */
				var tmp = leafletMap.markers.marker[kID].kStandortOrden.split("-");
				sessionStorage.setItem("leafletMap_tmp", tmp[3]);

				if ((leafletMap.markers.marker[kID].kKoordinaten == sessionStorage.leafletMap_coords) &&
					(kID == sessionStorage.leafletMap_id)) {
					// same monastry
					leafletMap.markers.popup[kID].content = sessionStorage.leafletMap_content;
					leafletMap.markers.popup[kID].content += '<tr><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kVVerbal + " - " + leafletMap.markers.marker[kID].kBVerbal;
					leafletMap.markers.popup[kID].content += ':</td><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kOrden;
					leafletMap.markers.popup[kID].content += '</td></tr>';
					sessionStorage.setItem("leafletMap_content", leafletMap.markers.popup[kID].content);
					leafletMap.markers.popup[kID].content += "</table></div>";
					leafletMap.markers.popup[kID].layer.bindPopup();
					leafletMap.markers.popup[kID].layer.setPopupContent(leafletMap.markers.popup[kID].content);
				} else {
					// new monastry or new place
					leafletMap.markers.popup[kID] = {};
					leafletMap.markers.popup[kID].content = '<div id="' + kID + '" class="leafletMap_popup">';
					leafletMap.markers.popup[kID].content += '<h3><a href="' + leafletMap.markers.marker[kID].kLink + '">';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kKloster;
					if (leafletMap.markers.marker[kID].kKloster.indexOf(leafletMap.markers.marker[kID].kOrt) == "-1") {
						leafletMap.markers.popup[kID].content += ',<br />Standort ' + leafletMap.markers.marker[kID].kOrt;
					}
					leafletMap.markers.popup[kID].content += '</a></h3>';
					leafletMap.markers.popup[kID].content += '<table><tr><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kVVerbal + "-" + leafletMap.markers.marker[kID].kBVerbal;
					leafletMap.markers.popup[kID].content += ':</td><td>';
					leafletMap.markers.popup[kID].content += leafletMap.markers.marker[kID].kOrden;
					leafletMap.markers.popup[kID].content += '</td></tr>';
					sessionStorage.setItem("leafletMap_content", leafletMap.markers.popup[kID].content);
					leafletMap.markers.popup[kID].content += "</table></div>";
				}
				leafletMap.markers.popup[kID].layer = L.marker([kLocation[0], kLocation[1]], {
					icon: kIcon
				}).addTo(leafletMap.markers.markerGroup);
				leafletMap.markers.popup[kID].layer.unbindPopup();
				leafletMap.markers.popup[kID].layer.bindPopup();
				leafletMap.markers.popup[kID].layer.setPopupContent(leafletMap.markers.popup[kID].content);
				sessionStorage.setItem("leafletMap_ort", leafletMap.markers.marker[kID].kOrt);
				sessionStorage.setItem("leafletMap_coords", leafletMap.markers.marker[kID].kKoordinaten);
				sessionStorage.setItem("leafletMap_id", kID);
			}
		}).done(function() {
			// hide loading spinner
			$("#leafletMap_spinner").css("display", "none");
		}));

		if (_facetFields != sessionStorage.leafletMap_facetFields) {
			/* Facet fields have changed, so the viewport of the map has to be changed as well */
			sessionStorage.setItem("leafletMap_facetFields", "_facetFields");
		}
		leafletMap.filled = true;

		addBordersToMap();

	}
	leafletMap.map.addLayer(leafletMap.markers.markerGroup);
};



var addBordersToMap = function() {

	var statesData;
	var setDynamicStyle = function(layer, zoom) {
		layer.setStyle({weight: getWeight(zoom), opacity: getOpacity(zoom)});
	}

	var getWeight = function(z) {
		return z === 18? 4096:
				z === 17? 2048:
				z === 16? 1024:
				z === 15? 512:
				z === 14? 256:
				z === 13? 128:
				z === 12? 64:
				z === 11? 32:
				z === 10? 16:
				z === 9? 8:
				z === 8? 4:
				z === 7? 2:
				1;
	}
	var getOpacity = function(z) {
		return z === 1? 0.7:
				z === 2? 0.65:
				z === 3? 0.6:
				z === 4? 0.55:
				z === 5? 0.5:
				z === 6? 0.45:
				z === 7? 0.4:
				z === 8? 0.35:
				z === 9? 0.3:
				z === 10? 0.25:
				z === 11? 0.2:
				z === 12? 0.15:
				z === 13? 0.1:
				0;
		}

	// change line style with zoom level to blur them out when closer
	leafletMap.map.on("zoomend", function() {
		setDynamicStyle(leafletMap.markers.geoJson, this._zoom);
	});



	////////////////////

	// control that shows state info on hover
	leafletMap.markers.info = L.control({position: "topleft"});

	leafletMap.markers.info.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'leafletMap_info');
		this.update();
		return this._div;
	};

	leafletMap.markers.info.update = function(properties) {
		if (properties) {
			this._div.innerHTML = 'Bistum '+properties["Secondary ID"];
		} else {
			this._div.innerHTML = '';
		}
	};

	leafletMap.markers.info.addTo(leafletMap.map);

	function style(feature) {
			var zoomlevel = leafletMap.map.getZoom();
		return {
			weight: getWeight(zoomlevel),
			opacity: getOpacity(zoomlevel),
			color: '#f49739',
			fillOpacity: 0.1,
			clickable: true
		};
	}

	function highlightFeature(e) {
		var layer = e.target;
		var zoomlevel = leafletMap.map.getZoom();
		layer.setStyle({
			               weight: 5,
			               color: '#f49739',
			               opacity: parseFloat(getOpacity(zoomlevel)+0.2),
			               dashArray: '',
			               fillOpacity: 0.3
		               });

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}

		leafletMap.markers.info.update(layer.feature.properties);
	}

	function resetHighlight(e) {
		leafletMap.markers.geoJson.resetStyle(e.target);
		leafletMap.markers.info.update();
	}

	function zoomToFeature(e) {
		leafletMap.map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		if (leafletMapGetMode()) {
			layer.on({
				         mouseover: highlightFeature,
				         mouseout: resetHighlight,
				         click: zoomToFeature
			         });
		}
	}

	$.getJSON(resourcesBaseURL + 'Bistumsgrenzen/GSBistumsgrenzenGEOJSON.geojson', function(statesData) {
		leafletMap.markers.geoJson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(leafletMap.map);
	});
};


var leafletMapAddMarkerToSmallMap = function() {

	// Creation of another layergroup to zoom around
	leafletMap.markers.detailGroup = L.featureGroup();
	var icon = resourcesBaseURL + "Ordenssymbole/Kloster_allgemein.png";
	for (var i = 0; i < standorte.length; i++) {
		if (standorte[i].icon) {
			icon = resourcesBaseURL + "Ordenssymbole/" + standorte[i].icon + ".png";
		}
		var kSIcon = L.icon({
							iconUrl: icon,
							iconSize: [31.5, 48],
							iconAnchor: [15.75, 48],
							popupAnchor: [0, -32]
						});
		var koordinaten = standorte[i].koordinaten.split(",");
		var lat = koordinaten[0];
		var lng = koordinaten[1];
		kMarker = L.marker([lat, lng], {icon: kSIcon}).addTo(leafletMap.markers.detailGroup);
		var kContent = '<div id="' + standorte[i].id + '" class="leafletMap_popup"><table><tr><td>';
		kContent += standorte[i].klosterTitel;
		kContent += '</td></tr></table></div>';
		kMarker.bindPopup();
		kMarker.setPopupContent(kContent);
		leafletMapRemoveMarker(id);
	}
	leafletMap.map.addLayer(leafletMap.markers.detailGroup);
	leafletMapSetViewToMarkerBounds(leafletMap.markers.detailGroup);
	// hide loading spinner
	$("#leafletMap_spinner").css("display", "none");
};

var leafletMapRemoveMarker = function(id) {

	$(document).ajaxComplete(function() {
		for (var i in leafletMap.markers.markerGroup._layers) {
			if (leafletMap.markers.markerGroup._layers[i]._popup._content.indexOf('id="' + id) != -1) {
				leafletMap.markers.markerGroup.removeLayer(i);
			}
		}
	})
};