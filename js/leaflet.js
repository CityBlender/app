var map = L.map('mapContainer').setView([51.505, -0.09], 13);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

L.tileLayer.provider('Stamen.Toner').addTo(map);


var pigIcon = L.icon({
iconUrl: 'img/pig.gif',
iconSize:     [38, 95], // size of the icon
});



L.marker([51.5, -0.09], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.52, -0.087], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.51, -0.088], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.5, -0.098], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.51, -0.095], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.49, -0.082], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.48, -0.082], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.49, -0.107], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.49, -0.091], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.51, -0.101], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.52, -0.079], {icon: pigIcon}).addTo(map)
    .openPopup();
L.marker([51.49, -0.088], {icon: pigIcon}).addTo(map)
    .openPopup();