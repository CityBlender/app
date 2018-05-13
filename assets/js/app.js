(function(window) {

    L.Icon.Pulse = L.DivIcon.extend({

        options: {
            className: '',
            iconSize: [12,12],
            fillColor: '#C70039',
            color: '#C70039',
            animate: true,
            heartbeat: 1,
        },

        initialize: function (options) {
            L.setOptions(this,options);

            // css
            
            var uniqueClassName = 'lpi-'+ new Date().getTime()+'-'+Math.round(Math.random()*100000);

            var before = ['background-color: '+this.options.fillColor];
            var after = [

                'box-shadow: 0 0 6px 2px '+this.options.color,

                'animation: pulsate ' + this.options.heartbeat + 's ease-out',
                'animation-iteration-count: infinite',
                'animation-delay: '+ (this.options.heartbeat + .1) + 's',
            ];

            if (!this.options.animate){
                after.push('animation: none');
                after.push('box-shadow:none');
            }

            var css = [
                '.'+uniqueClassName+'{'+before.join(';')+';}',
                '.'+uniqueClassName+':after{'+after.join(';')+';}',
            ].join('');
 
            var el = document.createElement('style');
            if (el.styleSheet){
                el.styleSheet.cssText = css;
            } else {
                el.appendChild(document.createTextNode(css));
            }

            document.getElementsByTagName('head')[0].appendChild(el);

            // apply css class

            this.options.className = this.options.className+' leaflet-pulsing-icon '+uniqueClassName;

            // initialize icon
            
            L.DivIcon.prototype.initialize.call(this, options);
        
        }
    });

    L.icon.pulse = function (options) {
        return new L.Icon.Pulse(options);
    };


    L.Marker.Pulse = L.Marker.extend({
        initialize: function (latlng,options) {
            options.icon = L.icon.pulse(options);
            L.Marker.prototype.initialize.call(this, latlng, options);
        }
    });

    L.marker.pulse = function (latlng,options) {
        return new L.Marker.Pulse(latlng,options);
    };

})(window);
$(document).ready(function () {

    // configure leaflet
    var london_center = [51.5, -0.09];
    var initial_zoom = 13

    var mapbox_tiles = 'https://api.mapbox.com/styles/v1/11soma/cjgry9jr3000z2roggiqpzehx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiMTFzb21hIiwiYSI6ImNqZDBuMjV6dDF2bWcyeG8xNDByZXpjbjgifQ.5B5BJIcEtqFELPs36GUxcA';
    var map_attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
    var max_zoom = 18;


    // create a leaflet instance
    var map = L.map('mapContainer').setView(london_center, initial_zoom);

    // add custom tiles to the map
    L.tileLayer(mapbox_tiles, {
        attribution: map_attribution,
        maxZoom: max_zoom,
        id: 'mapbox.mapbox-streets-v7',
    }).addTo(map);


    // create a custom pulsating marker
    var pulsingIcon = L.icon.pulse({ iconSize: [8, 8], color: '#C70039' });

    // var marker = L.marker([51.5, -0.09],{icon: pulsingIcon}).addTo(map);
    // marker.bindPopup("a");


    var marker = L.marker([51.5, -0.087], { icon: pulsingIcon }).addTo(map);
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





});



//# sourceMappingURL=app.js.map
