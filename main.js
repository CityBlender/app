var map = L.map('map').setView([36.3219088　, 139.0032936], 14);
 

L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 18
	}
).addTo(map);