function getEvents(input_date) {
  function getArtistInfo(artists_id_list, handleData) {
    var artists_info_list = []
    for (var i = 0; i < artists_id_list.length; i++) {
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
        var close_div = '</div>'

        // event title
        var event_name = e.name
        var event_url = e.url
        var event_name_text = '<a class="event__title" href="' + event_url + '"><h2>' + event_name + '</h2></a>'
        var event_name_class = '<div class="event__event_title">'
        var event_name_div = event_name_class + event_name_text + close_div

        // create venue section
        var venue_section_class = '<div class="event__venue_section">'
        var venue_title_div = '<h3>Venue</h3>'

        // venue name
        var venue_name = e.venue.name
        var venue_name_text = '<a href = "https://www.google.com/maps/search/?api=1&query=' + venue_name + '">' + '<h4>' + venue_name + '</h4>' + '</a>'
        var venue_name_class = '<div class="event__venue_name">'
        var venue_name_div = venue_name_class + venue_name_text + close_div

        // event time
        if (e.time !== null) {
          var event_time = e.time
        } else {
          event_time = "Time not specified"
        }
        var event_time_text = '<h5>Time: ' + event_time + '</h5>'
        var event_time_class = '<div class="event__time">'
        var event_time_div = event_time_class + event_time_text + close_div

        // foursquare rate
        if (typeof e.foursquare.rating !== "undefined") {
          var foursquare_rate = e.foursquare.rating
          var foursquare_rate_color = e.foursquare.rating_color
          var foursquare_rate_text = '<h5>FourSquare rate:</h5>' + '<h5 style="color:#' + foursquare_rate_color + ';">' + foursquare_rate + '</h5>'
          var foursquare_rate_class = '<div class="event__foursquare_rate">'
          var foursquare_rate_div = foursquare_rate_class + foursquare_rate_text + close_div
        } else {
          var foursquare_rate_div = ''
        }

        // foursquare tips
        var foursquare_tips = e.foursquare.tips
        var foursquare_tips_class = '<div class="event__foursquare_tips">'
        if (typeof foursquare_tips !== "undefined") {
          if (typeof foursquare_tips[0] !== "undefined") {
            if (typeof foursquare_tips[0].text !== "undefined") {
              var foursquare_tips_text = '<h5>Visitor tips:</h5>' + '<h5>' + foursquare_tips[0].text + '</h5>'
              var foursquare_tips_div = foursquare_tips_class + foursquare_tips_text + close_div
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
        var venue_section = venue_section_class + venue_title_div + venue_name_div + event_time_div + foursquare_rate_div + foursquare_tips_div + close_div

        // create artist section
        var artist_section_class = '<div class="event__artist_section">'

        // artists id, name, songkick page from event database
        var artists = e.artists
        var artist_class = '<div class="event__artist">'
        var number_of_artists = artists.length
        var artists_id_list = []
        var artists_name_list = []
        var artists_songkick_page_list = []
        for (var i = 0; i < number_of_artists; i++) {

          // artist id
          var artist_id = artists[i].id
          artists_id_list.push(artist_id)

          // artist name
          var artist_name = artists[i].name
          var artist_name_text = '<h4>' + artist_name + '</h4>'
          artists_name_list.push(artist_name_text)

          // artist songkick page
          var artists_songkick_page_url = artists[i].songkick_url
          var artists_songkick_text = '<a class="event__artist_songkick" href="' + artists_songkick_page_url + '"></a>'
          artists_songkick_page_list.push(artists_songkick_text)
        }

        // artist info
        getArtistInfo(artists_id_list, function (output) {
          setTimeout(function () {
            var artist = '<h3>Artists</h3>'
            for (var i = 0; i < output.length; i++) {

              // got the artist data
              var artist_info = output[i]

              // artist image
              if (typeof artist_info.spotify.image !== "undefined") {
                if (typeof artist_info.spotify.image.slice(-1)[0] !== "undefined") {
                  var artist_image_url = artist_info.spotify.image.slice(-1)[0].url
                }
              }
              if (typeof artist_image_url == "undefined") {
                if (typeof artist_info.lastfm.image !== "undefined") {
                  if (artist_info.lastfm.image[0].url !== "") {
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
              var artist_spotify_page = '<a class="event__artist_spotify" href="' + artist_spotify_page_url + '"></a>'

              // artist lastfm page
              var artist_lastfm_page_url = artist_info.lastfm.url
              var artist_lastfm_page = '<a class="event__artist_lastfm" href="' + artist_lastfm_page_url + '"></a>'

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
    url: "https://fuinki-api.herokuapp.com/london/events/" + input_date,
    success: function (data) {
      //Do stuff with the JSON data
      // events = data
      addMarkers(data)
    },
    error: function (data, errorThrown) {
      console.log('request failed :' + errorThrown);
    }

  });

}