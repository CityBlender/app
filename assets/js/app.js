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







//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIjEtbGVhZmxldC1wdWxzYXRpbmctaWNvbi5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKHdpbmRvdykge1xyXG5cclxuICAgIEwuSWNvbi5QdWxzZSA9IEwuRGl2SWNvbi5leHRlbmQoe1xyXG5cclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJycsXHJcbiAgICAgICAgICAgIGljb25TaXplOiBbMTIsMTJdLFxyXG4gICAgICAgICAgICBmaWxsQ29sb3I6ICcjQzcwMDM5JyxcclxuICAgICAgICAgICAgY29sb3I6ICcjQzcwMDM5JyxcclxuICAgICAgICAgICAgYW5pbWF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgaGVhcnRiZWF0OiAxLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3NzXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgdW5pcXVlQ2xhc3NOYW1lID0gJ2xwaS0nKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSsnLScrTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwMCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgYmVmb3JlID0gWydiYWNrZ3JvdW5kLWNvbG9yOiAnK3RoaXMub3B0aW9ucy5maWxsQ29sb3JdO1xyXG4gICAgICAgICAgICB2YXIgYWZ0ZXIgPSBbXHJcblxyXG4gICAgICAgICAgICAgICAgJ2JveC1zaGFkb3c6IDAgMCA2cHggMnB4ICcrdGhpcy5vcHRpb25zLmNvbG9yLFxyXG5cclxuICAgICAgICAgICAgICAgICdhbmltYXRpb246IHB1bHNhdGUgJyArIHRoaXMub3B0aW9ucy5oZWFydGJlYXQgKyAncyBlYXNlLW91dCcsXHJcbiAgICAgICAgICAgICAgICAnYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGUnLFxyXG4gICAgICAgICAgICAgICAgJ2FuaW1hdGlvbi1kZWxheTogJysgKHRoaXMub3B0aW9ucy5oZWFydGJlYXQgKyAuMSkgKyAncycsXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5hbmltYXRlKXtcclxuICAgICAgICAgICAgICAgIGFmdGVyLnB1c2goJ2FuaW1hdGlvbjogbm9uZScpO1xyXG4gICAgICAgICAgICAgICAgYWZ0ZXIucHVzaCgnYm94LXNoYWRvdzpub25lJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBjc3MgPSBbXHJcbiAgICAgICAgICAgICAgICAnLicrdW5pcXVlQ2xhc3NOYW1lKyd7JytiZWZvcmUuam9pbignOycpKyc7fScsXHJcbiAgICAgICAgICAgICAgICAnLicrdW5pcXVlQ2xhc3NOYW1lKyc6YWZ0ZXJ7JythZnRlci5qb2luKCc7JykrJzt9JyxcclxuICAgICAgICAgICAgXS5qb2luKCcnKTtcclxuIFxyXG4gICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgICAgICBpZiAoZWwuc3R5bGVTaGVldCl7XHJcbiAgICAgICAgICAgICAgICBlbC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChlbCk7XHJcblxyXG4gICAgICAgICAgICAvLyBhcHBseSBjc3MgY2xhc3NcclxuXHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jbGFzc05hbWUgPSB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lKycgbGVhZmxldC1wdWxzaW5nLWljb24gJyt1bmlxdWVDbGFzc05hbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIGljb25cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEwuRGl2SWNvbi5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIEwuaWNvbi5wdWxzZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMLkljb24uUHVsc2Uob3B0aW9ucyk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBMLk1hcmtlci5QdWxzZSA9IEwuTWFya2VyLmV4dGVuZCh7XHJcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGxhdGxuZyxvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMuaWNvbiA9IEwuaWNvbi5wdWxzZShvcHRpb25zKTtcclxuICAgICAgICAgICAgTC5NYXJrZXIucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBsYXRsbmcsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIEwubWFya2VyLnB1bHNlID0gZnVuY3Rpb24gKGxhdGxuZyxvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBMLk1hcmtlci5QdWxzZShsYXRsbmcsb3B0aW9ucyk7XHJcbiAgICB9O1xyXG5cclxufSkod2luZG93KTsiLCIvLyBzZXQgaW5pdGlhbCB2aWV3XG52YXIgbG9uZG9uX2NlbnRlciA9IFs1MS41LCAtMC4wOV07XG52YXIgaW5pdGlhbF96b29tID0gMTNcblxuLy8gY3JlYXRlIGEgbGVhZmxldCBpbnN0YW5jZVxudmFyIG1hcCA9IEwubWFwKCdtYXBDb250YWluZXInKS5zZXRWaWV3KGxvbmRvbl9jZW50ZXIsIGluaXRpYWxfem9vbSk7XG5cbi8vIGN1c3RvbSB0aWxlcyBzZXR0aW5nc1xudmFyIG1hcGJveF90aWxlcyA9ICdodHRwczovL2FwaS5tYXBib3guY29tL3N0eWxlcy92MS8xMXNvbWEvY2pncnk5anIzMDAwejJyb2dnaXFwemVoeC90aWxlcy8yNTYve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXBrLmV5SjFJam9pTVRGemIyMWhJaXdpWVNJNkltTnFaREJ1TWpWNmRERjJiV2N5ZUc4eE5EQnlaWHBqYmpnaWZRLjVCNUJKSWNFdHFGRUxQczM2R1V4Y0EnO1xudmFyIG1hcF9hdHRyaWJ1dGlvbiA9ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHA6Ly9vcGVuc3RyZWV0bWFwLm9yZ1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgPGEgaHJlZj1cImh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sIEltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHA6Ly9tYXBib3guY29tXCI+TWFwYm94PC9hPic7XG52YXIgbWF4X3pvb20gPSAxODtcblxuLy8gYWRkIGN1c3RvbSB0aWxlcyB0byB0aGUgbWFwXG5MLnRpbGVMYXllcihtYXBib3hfdGlsZXMsIHtcbiAgICBhdHRyaWJ1dGlvbjogbWFwX2F0dHJpYnV0aW9uLFxuICAgIG1heFpvb206IG1heF96b29tLFxuICAgIGlkOiAnbWFwYm94Lm1hcGJveC1zdHJlZXRzLXY3Jyxcbn0pLmFkZFRvKG1hcCk7XG5cblxuLy8gY3JlYXRlIGEgY3VzdG9tIHB1bHNhdGluZyBtYXJrZXJcbnZhciBwdWxzaW5nSWNvbiA9IEwuaWNvbi5wdWxzZSh7aWNvblNpemU6WzgsOF0sY29sb3I6JyNDNzAwMzknfSk7XG5cbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNSwgLTAuMDldLHtpY29uOiBwdWxzaW5nSWNvbn0pLmFkZFRvKG1hcCk7XG4vLyBtYXJrZXIuYmluZFBvcHVwKFwiYVwiKTtcblxuXG52YXIgbWFya2VyID0gTC5tYXJrZXIoWzUxLjUsIC0wLjA4N10se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbm1hcmtlci5iaW5kUG9wdXAoXCJNdXNpYyBkZXN1XCIpO1xuXG4vLyB2YXIgbWFya2VyID0gTC5tYXJrZXIoWzUxLjUxLCAtMC4wODhdLHtpY29uOiBwdWxzaW5nSWNvbn0pLmFkZFRvKG1hcCk7XG4vLyB2YXIgbWFya2VyID0gTC5tYXJrZXIoWzUxLjUsIC0wLjA5OF0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNTEsIC0wLjA5NV0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNDksIC0wLjA4Ml0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNDgsIC0wLjA4Ml0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNDksIC0wLjEwN10se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNDksIC0wLjA5MV0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNTEsIC0wLjEwMV0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNTIsIC0wLjA3OV0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcbi8vIHZhciBtYXJrZXIgPSBMLm1hcmtlcihbNTEuNDksIC0wLjA4OF0se2ljb246IHB1bHNpbmdJY29ufSkuYWRkVG8obWFwKTtcblxuXG5cblxuXG5cbiJdfQ==
