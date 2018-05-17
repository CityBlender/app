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


    function getArtistInfo(artists_id_list, handleData) {
        var artists_info_list = []
        for (var i = 0; i < artists_id_list.length; i++){
            var artist_id = artists_id_list[i]
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                type: 'GET',
                url: "https://fuinki-api.herokuapp.com/artist/" + artist_id,
                success: function (data) {
                    var result = data[0]
                    artists_info_list.push(result)

                },
                error: function (data, errorThrown) {
                    console.log('request failed :' + errorThrown);
                }
            });
        }
        handleData(artists_info_list)
    }

    // add markers
    function addMarkers(data) {
        $.each(data, function (data, e) {
            var lat = e.location.lat
            var lng = e.location.lng
            var marker = L.marker([lat, lng], { icon: pulsingIcon }).addTo(map);
            function onMarkerClick() {

                 // general
                close_div = '</div>'

                // event title
                var event_name = e.name
                var event_url = e.url
                var event_page = '<a class="event__page" href="' + event_url + '"><h2>' + event_name + '</h2></a>'
                var event_class = '<div class="event__event_page">'
                var event_name_div = event_class + event_page + close_div

                // create venue section
                var venue_section_class = '<div class="event__venue_section">'
                var venue_title_div = '<h3> Venue </h3>'


                // venue name
                var venue_name = e.venue.name
                var venue_name_link = '<h4>' + venue_name + '</h4>'
                var venue_class = '<div class="event__venue_name">'
                var venue_name_div = venue_class + venue_name_link + close_div

                // event time
                var event_time = e.time
                var event_time_h5 = '<h5>' + event_time + '</h5>'
                var time_class = '<div class="event__time">'
                var event_time_div = time_class + '<h5>Time:</h5>' +  event_time_h5 + close_div

                

                // foursquare rate
                if (typeof e.foursquare.rating !== "undefined"){
                    var foursquare_rate = e.foursquare.rating
                    var foursquare_rate_color = e.foursquare.rating_color
                    var foursquare_rate_with_color = '<h5>FourSquare rate:</h5>' + '<h5 style="color:#' + foursquare_rate_color + ';">' + foursquare_rate + '</h5>'
                    var foursquare_rate_class = '<div class="event__foursquare_rate">'
                    var foursquare_rate_div = foursquare_rate_class + foursquare_rate_with_color + close_div
                } else {
                    var foursquare_rate_div = ''
                }

                // foursquare tips
                var foursquare_tips = e.foursquare.tips
                var foursquare_class = '<div class="event__foursquare_tips">'
                if (typeof foursquare_tips !== "undefined"){
                    if (typeof foursquare_tips[0] !== "undefined") {
                        if (typeof foursquare_tips[0].text !== "undefined") {
                            var foursquare_tips_div = foursquare_class + '<h5>Visitor tips:</h5>' + '<h5>' + foursquare_tips[0].text + '</h5>' + close_div
                        } else {
                            var foursquare_tips_div = ''
                        }
                    }
                    else {
                        var foursquare_tips_div = ''
                    }
                } else {
                    var foursquare_tips_div = ''
                }

                // construct venue section 

                var venue_section = venue_section_class + venue_title_div + venue_name_div + event_time_div + foursquare_rate_with_color + foursquare_tips_div

                // create artist section
                var artist_section_class = '<div class="event__artist_section">'

                // artists id, name, songkick page from event database
                var artists = e.artists
                var artist_class = '<div class="event__artist">'
                var number_of_artists= artists.length
                var artists_id_list = []
                var artists_name_list = []
                var artists_songkick_page_list = []
                for (var i = 0; i < number_of_artists; i++){

                    // artist id
                    var artist_id = artists[i].id
                    artists_id_list.push(artist_id)

                    // artist name
                    var artist_name = artists[i].name
                    var artist_name_div = '<h4>' + artist_name + '</h4>'
                    artists_name_list.push(artist_name_div)

                    // artist songkick page
                    var artists_songkick_page_url = artists[i].songkick_url
                    var artists_songkick_page = '<a class="event__songkick_button" href="' + artists_songkick_page_url + '"></a>'
                    artists_songkick_page_list.push(artists_songkick_page)
                }

                // artist info
                getArtistInfo(artists_id_list, function(output) {
                setTimeout(function() {
                    var artist = '<h3>Artists</h3>'
                    for (var i = 0; i < output.length; i++){
                        
                        // got the artist data 
                        var artist_info = output[i]

                        // artist image
                        if(typeof artist_info.spotify.image !== "undefined"){
                            if(typeof artist_info.spotify.image.slice(-1)[0] !== "undefined"){
                                var artist_image_url = artist_info.spotify.image.slice(-1)[0].url
                            }
                        }
                        if(typeof artist_image_url == "undefined"){
                            if (typeof artist_info.lastfm.image !== "undefined"){
                                if(artist_info.lastfm.image[0].url !== ""){
                                    var artist_image_url = artist_info.lastfm.image[0].url
                                } else {
                                    var artist_image_url = "../assets_src/img/no_image_artist.jpeg"
                                }
                            } else {
                                var artist_image_url = "../assets_src/img/no_image_artist.jpeg"
                            }
                        }
                        var artist_image = '<img src="' + artist_image_url + '">'


                        // artist spotify page
                        var artist_spotify_page_url = artist_info.spotify.href
                        var artist_spotify_page = '<a class="event__spotify_button" href="' + artist_spotify_page_url + '"></a>'

                        // artist lastfm page
                        var artist_lastfm_page_url = artist_info.lastfm.url
                        var artist_lastfm_page = '<a class="event__lastfm_button" href="' + artist_lastfm_page_url + '"></a>'

                        // construct artist section
                        var artist_elem = artist_class + artist_image + artists_name_list[i] + 
                            artists_songkick_page_list[i] + artist_spotify_page + artist_lastfm_page + close_div
                        artist += artist_elem
                        var artist_section = artist_section_class + artist + close_div
                    }

                    // finally construct the card
                    var final = event_name_div + artist_section + venue_section
                    marker.bindPopup(final).openPopup()

                }, 500);
                    
                    
            
                })
            }
            marker.on('click', onMarkerClick);


        });
    }

    $.ajax({
        contentType: "application/json",
        dataType: "json",
        type: 'GET',
        url: "https://fuinki-api.herokuapp.com/london/events/2018-05-18",
        success: function (data) {
            //Do stuff with the JSON data
            // events = data
            addMarkers(data)
        },
        error: function (data, errorThrown) {
            console.log('request failed :' + errorThrown);
        }

    });








});



//# sourceMappingURL=app.js.map
