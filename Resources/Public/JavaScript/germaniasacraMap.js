/*
 Generates a Map using leafletJs
 Each time the page is loaded, the map is generated
 (due to problems storing objects during reloads)
 The viewing parameter of the map are stored in sessionStorage
 */

$(function() {
	if (typeof leafletMap != "undefined") {
		if (leafletMapGetMode() == "map" && leafletMapGetSize() == "big") {
			leafletMapGrow();
		}
		if (!leafletMap.values) {
			leafletMap.values = [];
		}
	}
});

var leafletMapGetMode = function() {
	return sessionStorage.mode;
};

var leafletMapSetMode = function(mode) {
	sessionStorage.setItem("mode", mode);
};

var leafletMapGetSize = function() {
	return sessionStorage.size;
}

var leafletMapSetSize = function(size) {
	sessionStorage.setItem("size", size)
}

var leafletMapToggle = function(mode) {
	if (mode !== leafletMapGetMode()) {
		switch (mode) {
			case "map":
				leafletMapGrow();
				break;
			case "list":
				if (leafletMapGetMode()) {
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
				disableClusteringAtZoom: 7,
				maxClusterRadius: 100
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
			                sessionStorage.removeItem("lat");
			                sessionStorage.removeItem("lng");
			                sessionStorage.removeItem("zoom");
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
		leafletMapSetMode("map");
		leafletMap.grown = true;
	}
};

var leafletMapShrink = function() {
	/* switch content */
	$(".navigation").children().toggle();
	$(".resultList").toggle();
	$("#leafletMap_wrapper").toggle();

	// the parameter has to be explicitly removed first, than  set
	leafletMapSetMode("list");

	leafletMap.grown = false;
};

var leafletMapAddDiverseMarkers = function() {
	/*
	 add URLparameter to create page with all information
	 read the page and create the markers
	 has to wait until object "germaniaSacra" is filled completely

	 if either bistum or orden of monasteries are the esame,
	 merge information rather than create several markers
	 */

	var errorMsg = "";

	var createMarker = function(arr) {

		var collectMarkerContent = function(coords) {
			var content = "";
			content = '<div ' +
						'id="' + coords.id + '"' +
						'class="leafletMap_popup"><h3><a href="' +
						coords.link +
						'">' +
						coords.kloster +
						', Standort ' +
						coords.ort +
						'</a></h3>' +
						'<table><tbody>';
			for (var ord = 0; ord < coords.orden.length; ord++) {
				content += '<tr>' +
							'<td>' +
							coords.ordenIds[ord].zeiten + ': '+
							'</td>' +
							'<td>' +
							coords.ordenIds[ord].orden +
							'</td>' +
							'</tr>';
			}
			content += '</tbody></table></div>';
			return content;
		}

		for (var c = 0; c < arr.coords.length; c++) {
			var content = collectMarkerContent(arr.coordIds[c]);
			var iconUrl = arr.coordIds[c].graphik;
			var icon = L.icon({
									iconUrl: iconUrl,
									iconSize: [21, 32],
									iconAnchor: [10.5, 32],
									popupAnchor: [0, -32]
								});
			var coords = arr.coords[c].split(",");
			var marker = L.marker([coords[0],coords[1]], {
								icon: icon
							}).addTo(leafletMap.markers.markerGroup);

			marker.bindPopup();
			marker.setPopupContent(content);

		}
	}

	if (!leafletMap.filled && leafletMap.loaded) {

		var shadowURL = $(".leaflet-marker-icon").attr("src");
		var doc, docIndex, mydata, docs, orden_graphik;
		var kLocation, kOrden, kName, kID, kURL, kVVerbal, kBVerbal, kKloster, kLink;
		var kIFolder = resourcesBaseURL + "Ordenssymbole/";
		var kDefIcon = kIFolder + "Kloster_allgemein.png";
		var kShadIcon = kIFolder + "Shadow.png";

		var solrQuery = [];
		solrQuery = leafletMapGetRawSearchString();
		var missingCoords = [];
		orden = {};
		orden.complete = [];

		// go through all parted searchStrings and create its markers
		for (var i=0; i<solrQuery.length; i++) {
			var dataFields = 'id,kloster_id,koordinaten,kloster,ort,orden,orden_graphik,orden_bis_verbal,orden_von_verbal';
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
			queryURL += encodeURIComponent(solrQuery[i]);
			queryURL += '&' + encodeURIComponent('tx_find_find[data-fields]') + '=' + encodeURIComponent(dataFields);
			queryURL += '&' + "tx_find_find[count]=3000&tx_find_find[data-format]=raw-solr-response&tx_find_find[format]=data";

			var url = document.baseURI + queryURL;

			// get information from JSON-Object
			/* Problem:
			 * a monastery can have several coordinates -
			 * than it has to have a new marker each time, or
			 * it can have several times, orden, names, whatever
			 *   than it has to have the same marker
			 */

			$.when(jQuery.getJSON(url,function(data) {
				docs = data.response.docs;
				orden.ids = [];

				for (var index in docs) {
					var id = docs[index].kloster_id;
					var idIndex = $.inArray(id, orden.ids);

					if (idIndex === -1) {
						// new monastery
						orden.ids.push(id);
						orden.complete.push(id);


						// each monastery can have several sites which each get a marker (name with place, link and graphic)
						orden[id] = {};
						orden[id].coords = [];
						if (docs[index].koordinaten == "0,0" || !docs[index].koordinaten) {
							if (missingCoords.indexOf(id) == "-1") {
								errorMsg += "Die Koordinaten für Kloster "+docs[index].kloster_id+" sind unvollständig.<br />";
								missingCoords.push(id);
								orden[id].coords.push("0,0");
							}
						} else {
							orden[id].coords.push(docs[index].koordinaten[0]);
						}
							// produces [0]
							orden[id].coordIds = []; // has to be a different array than coords or $.inArray won't find coords
							orden[id].coordIds[0] = {};
							orden[id].coordIds[0].id = id;
							orden[id].coordIds[0].kloster = docs[index].kloster;
							orden[id].coordIds[0].ort = docs[index].ort[0];
							orden[id].coordIds[0].link = document.baseURI + germaniaSacra.config.IDURLTemplate.replace('%23%23%23ID%23%23%23', id);
							// use graphic of first denomination
							if (docs[index].orden_graphik) {
								orden[id].coordIds[0].graphik = kIFolder + docs[index].orden_graphik[0] + ".png";
							} else {
								orden[id].coordIds[0].graphik = kDefIcon;
							}
							// on each site, it can have several denominations with its times and denominations,
							// here it gets the first one
							orden[id].coordIds[0].orden = [];
							orden[id].coordIds[0].orden.push(docs[index].orden[0]);
							orden[id].coordIds[0].ordenIds = [];
							orden[id].coordIds[0].ordenIds[0] = {};
							if (docs[index].orden_von_verbal != "") {
								if (docs[index].orden_bis_verbal != "") {
									orden[id].coordIds[0].ordenIds[0].zeiten = docs[index].orden_von_verbal + "-" + docs[index].orden_bis_verbal;
								} else {
									orden[id].coordIds[0].ordenIds[0].zeiten = docs[index].orden_von_verbal + "-?";
								}
							} else {
								orden[id].coordIds[0].ordenIds[0].zeiten = "?";
							}
							orden[id].coordIds[0].ordenIds[0].orden = docs[index].orden[0];


					} else {
						// previous monastery
						var coordIndex = $.inArray(docs[index].koordinaten[0], orden[id].coords);
						if (coordIndex === -1) {
							// new coordinates
							if (docs[index].koordinaten[0] == "0,0" || !docs[index].koordinaten[0]) {
								if (missingCoords.indexOf(id) == "-1") {
									errorMsg += "Die Koordinaten für Kloster "+docs[index].kloster_id+" sind unvollständig.<br />";
									missingCoords.push(id);
								}
							} else {}
							coordIndex = -1 + orden[id].coords.push(docs[index].koordinaten[0]);
							orden[id].coordIds[coordIndex] = {};
							orden[id].coordIds[coordIndex].id = id;
							orden[id].coordIds[coordIndex].kloster = docs[index].kloster;
							orden[id].coordIds[coordIndex].ort = docs[index].ort[0];
							orden[id].coordIds[coordIndex].link = document.baseURI + germaniaSacra.config.IDURLTemplate.replace('%23%23%23ID%23%23%23', id);

							// on each site, it can have several denominations with its times and denominations,
							// here it gets the first one
							orden[id].coordIds[coordIndex].orden = [];
							orden[id].coordIds[coordIndex].orden.push(docs[index].orden[0]);
							orden[id].coordIds[coordIndex].ordenIds = [];
							orden[id].coordIds[coordIndex].ordenIds[0] = {};
							orden[id].coordIds[coordIndex].ordenIds[0].zeiten = docs[index].orden_von_verbal + "-" + docs[index].orden_bis_verbal;
							orden[id].coordIds[coordIndex].ordenIds[0].orden = docs[index].orden[0];

							// use graphic of first denomination
							if (docs[index].orden_graphik) {
								orden[id].coordIds[coordIndex].graphik = kIFolder + docs[index].orden_graphik[0] + ".png";
							} else {
								// there must have been a graphic defined earlier
							}

						} else {
							// previous coordinates -> new orden
							ordenIndex = -1 + orden[id].coordIds[coordIndex].orden.push(docs[index].orden[0]);
							orden[id].coordIds[coordIndex].ordenIds[ordenIndex] = {};
							orden[id].coordIds[coordIndex].ordenIds[ordenIndex].zeiten = docs[index].orden_von_verbal + "-" + docs[index].orden_bis_verbal;
							orden[id].coordIds[coordIndex].ordenIds[ordenIndex].orden = docs[index].orden[0];
						}
					}
				}

				// Create markers
				for (var index in orden.ids) {
					var id = orden.ids[index];
					createMarker(orden[id]);
				}

			}).done(function() {
				// hide loading spinner
				$("#leafletMap_spinner").css("display", "none");
			}));

			// TODO: eval next statement, if necessary
			/*
			if (_facetFields != sessionStorage.leafletMap_facetFields) {
				//Facet fields have changed, so the viewport of the map has to be changed as well
				sessionStorage.setItem("leafletMap_facetFields", "_facetFields");
			}
		*/
			leafletMap.filled = true;

		}
		leafletMap.map.addLayer(leafletMap.markers.markerGroup);
	}


	$.ajax().done(function() {
		if (errorMsg != "" && location.href.indexOf("/gsn/") == "-1") {
			leafletMapCreateErrorMessage(errorMsg);
		}

		addBordersToMap();
	});
};

var addBordersToMap = function() {

	var statesData;
	var setDynamicStyle = function(layer, zoom) {
		layer.setStyle({weight: getWeight(zoom), opacity: getOpacity(zoom)});
	};

	var getWeight = function(z) {
		return z === 18 ? 4096 :
				z === 17 ? 2048 :
				z === 16 ? 1024 :
				z === 15 ? 512 :
				z === 14 ? 256 :
				z === 13 ? 128 :
				z === 12 ? 64 :
				z === 11 ? 32 :
				z === 10 ? 16 :
				z === 9 ? 8 :
				z === 8 ? 4 :
				z === 7 ? 2 :
			1;
	};
	var getOpacity = function(z) {
		return z === 1 ? 0.7 :
				z === 2 ? 0.65 :
				z === 3 ? 0.6 :
				z === 4 ? 0.55 :
				z === 5 ? 0.5 :
				z === 6 ? 0.45 :
				z === 7 ? 0.4 :
				z === 8 ? 0.35 :
				z === 9 ? 0.3 :
				z === 10 ? 0.25 :
				z === 11 ? 0.2 :
				z === 12 ? 0.15 :
				z === 13 ? 0.1 :
			0;
	};

	// change line style with zoom level to blur them out when closer
	leafletMap.map.on("zoomend", function() {
		setDynamicStyle(leafletMap.markers.geoJson, this._zoom);
	});

	// control that shows state info on hover
	leafletMap.markers.info = L.control({position: "topleft"});

	leafletMap.markers.info.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'leafletMap_info');
		this.update();
		return this._div;
	};

	leafletMap.markers.info.update = function(properties) {
		if (properties) {
			this._div.innerHTML = 'Bistum ' + properties["Secondary ID"];
		} else {
			this._div.innerHTML = '';
		}
	};

	leafletMap.markers.info.addTo(leafletMap.map);

	var style = function(feature) {
		var zoomlevel = leafletMap.map.getZoom();
		return {
			weight: getWeight(zoomlevel),
			opacity: getOpacity(zoomlevel),
			color: '#f49739',
			fillOpacity: 0.1,
			clickable: true
		};
	};

	var highlightFeature = function(e) {
		var layer = e.target;
		var zoomlevel = leafletMap.map.getZoom();
		layer.setStyle({
			weight: 5,
			color: '#f49739',
			opacity: parseFloat(getOpacity(zoomlevel) + 0.2),
			dashArray: '',
			fillOpacity: 0.3
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}

		leafletMap.markers.info.update(layer.feature.properties);
	};

	var resetHighlight = function(e) {
		leafletMap.markers.geoJson.resetStyle(e.target);
		leafletMap.markers.info.update();
	};

	var zoomToFeature = function(e) {
		leafletMap.map.fitBounds(e.target.getBounds());
	};

	var onEachFeature = function(feature, layer) {
		if (leafletMapGetMode()) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
	};

	$.getJSON(resourcesBaseURL + 'Bistumsgrenzen/GSBistumsgrenzenGEOJSON.geojson', function(statesData) {
		leafletMap.markers.geoJson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(leafletMap.map);
	});
};

var leafletMapAddMarkerToSmallMap = function() {

	// create array of monastery ids from session storage
	var internValues = sessionStorage.values.split(" ");
	internValues.pop();
	leafletMap.values =  internValues;

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
	$(document).ajaxComplete(function() {
		leafletMapSetViewToMarkerBounds(leafletMap.markers.detailGroup);
	});
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
	});
};

var leafletMapGetRawSearchString = function() {
	var searchString = [];
	var numbers = 100;
	var chunks = Math.ceil(leafletMap.values.length/numbers);
	var doubles = "";

	if (leafletMap.values) {
		for (var chunk = 1; chunk <= chunks; chunk++) {
			if (chunk != chunks) {
				var ceil = numbers*chunk;
			} else {
				var ceil = leafletMap.values.length;
			}

			var base = numbers * (chunk-parseInt(1));
			var tmp = base;
			var tSearchString = "(kloster_id: "+leafletMap.values[tmp];
			doubles += " "+leafletMap.values[tmp];
			tmp++;
			for (tmp; tmp < ceil; tmp++) {
				doubles += " "+leafletMap.values[tmp];
				tSearchString += " OR kloster_id: "+leafletMap.values[tmp];
			}
			tSearchString += ") AND typ:standort-orden"
			searchString[searchString.length] = tSearchString;
		}
	}
	return searchString;
};

var leafletMapCreateErrorMessage = function(msg) {
	$(leafletMap.map._container).parent().append('<div id="errorMsg">'+msg+'</div>');
}