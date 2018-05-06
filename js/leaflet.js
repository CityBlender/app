// set initial view
var london_center = [51.5, -0.09];
var initial_zoom = 13

// create a leaflet instance
var map = L.map('mapContainer').setView(london_center, initial_zoom);

// custom tiles settings
var mapbox_tiles = 'https://api.mapbox.com/styles/v1/11soma/cjgry9jr3000z2roggiqpzehx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTFzb21hIiwiYSI6ImNqZDBuMjV6dDF2bWcyeG8xNDByZXpjbjgifQ.5B5BJIcEtqFELPs36GUxcA';
var map_attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
var max_zoom = 18;

// add custom tiles to the map
L.tileLayer(mapbox_tiles, {
    attribution: map_attribution,
    maxZoom: max_zoom,
    id: 'mapbox.mapbox-streets-v7',
}).addTo(map);


// create a custom pulsating marker
var pulsingIcon = L.icon.pulse({iconSize:[8,8],color:'#C70039'});

// var marker = L.marker([51.5, -0.09],{icon: pulsingIcon}).addTo(map);
// marker.bindPopup("a");


var marker = L.marker([51.5, -0.087],{icon: pulsingIcon}).addTo(map);
marker.bindPopup("Music desu");

// var marker = L.marker([51.51, -0.088],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.5, -0.098],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.51, -0.095],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.49, -0.082],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.48, -0.082],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.49, -0.107],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.49, -0.091],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.51, -0.101],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.52, -0.079],{icon: pulsingIcon}).addTo(map);
// var marker = L.marker([51.49, -0.088],{icon: pulsingIcon}).addTo(map);





