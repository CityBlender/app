// area
var area = "London"

// configure leaflet
var london_center = [51.5, -0.09];
var initial_zoom = 13

var mapbox_tiles = 'https://api.mapbox.com/styles/v1/iljapanic/cjhdhn7di1tm22rs58tce6hju/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaWxqYXBhbmljIiwiYSI6ImNqOG9zdXk5cTA4NjEzM28zZmZmeGE4eDAifQ.4QdssXJs5l6Hw3Uk0fVeoA';
var map_attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
var max_zoom = 18;


// create a leaflet instance
var map = L.map('mapContainer', {
  zoomControl: false // disable default zoom
}).setView(london_center, initial_zoom);

// add custom tiles to the map
L.tileLayer(mapbox_tiles, {
  attribution: map_attribution,
  maxZoom: max_zoom,
  id: 'mapbox.mapbox-streets-v7',
}).addTo(map);

// position zoom button
L.control.zoom({
  position: 'bottomright'
}).addTo(map);


// create a custom pulsating marker
var pulsingIcon = L.icon.pulse({ iconSize: [8, 8], color: '#C70039' });