export async function getEventCardTemplate(event) {


  // final event card
  var eventCard =
    // open div
    '<div class="event">'

      // date
      + '<div class="event__date">'
        + getEventDate(event)
      + '</div>'
      // /date

      // artists
      + '<div class="artists">'
        + printArtistCards(event.artist_array)
      + '</div>'
      // /artists

      // genres
      + '<div class="genres">'
        + getEventGenres(event)
      + '</div>'
      // /genres

      + '<hr>'

      // venue
      + getVenueCard(event)
      // /venue


    // close div
    + '</div>'


  return eventCard
};

// get icons
var icon_songkick = '<svg aria-labelledby="simpleicons-songkick-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.55 18.779c-1.855 0-3.372-.339-4.598-1.602l1.92-1.908c.63.631 1.74.853 2.715.853 1.186 0 1.739-.391 1.739-1.089 0-.291-.06-.529-.239-.717-.15-.154-.404-.273-.795-.324l-1.455-.205c-1.064-.152-1.891-.51-2.43-1.072-.555-.578-.84-1.395-.84-2.434C2.536 8.066 4.2 6.45 6.96 6.45c1.74 0 3.048.407 4.086 1.448L9.171 9.77c-.765-.766-1.77-.715-2.295-.715-1.039 0-1.465.597-1.465 1.125 0 .152.051.375.24.561.15.153.404.307.832.359l1.467.203c1.09.153 1.875.495 2.385 1.005.645.63.9 1.53.9 2.655 0 2.47-2.127 3.819-4.68 3.819l-.005-.003zM20.813 2.651C19.178 1.432 17.37.612 15.089.237v10.875l3.261-4.539h3.565l-4.095 5.72s.944 1.51 1.515 2.405c.586.899 1.139 1.14 1.965 1.14h.57v2.806h-.872c-1.812 0-2.9-.33-3.72-1.575-.504-.811-2.175-3.436-2.175-3.436v4.995H12.12V-.001H12c-3.852 0-6.509.931-8.811 2.652C-.132 5.137.001 8.451.001 11.997c0 3.547-.133 6.867 3.188 9.352C5.491 23.074 8.148 24 12 24s6.51-.927 8.812-2.651C24.131 18.865 24 15.544 24 11.997c0-3.546.132-6.859-3.188-9.346h.001z"/></svg>'

var icon_lastfm = '<svg aria-labelledby="simpleicons-lastfm-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.599 17.211l-.881-2.393s-1.433 1.596-3.579 1.596c-1.9 0-3.249-1.652-3.249-4.296 0-3.385 1.708-4.596 3.388-4.596 2.418 0 3.184 1.568 3.845 3.578l.871 2.751c.871 2.672 2.523 4.818 7.285 4.818 3.41 0 5.722-1.045 5.722-3.801 0-2.227-1.276-3.383-3.635-3.935l-1.757-.384c-1.217-.274-1.577-.771-1.577-1.597 0-.936.736-1.487 1.952-1.487 1.323 0 2.028.495 2.147 1.679l2.749-.33c-.225-2.479-1.937-3.494-4.745-3.494-2.479 0-4.897.936-4.897 3.934 0 1.873.902 3.058 3.185 3.605l1.862.443c1.397.33 1.863.916 1.863 1.713 0 1.021-.992 1.441-2.869 1.441-2.779 0-3.936-1.457-4.597-3.469l-.901-2.75c-1.156-3.574-3.004-4.896-6.669-4.896C2.147 5.327 0 7.879 0 12.235c0 4.179 2.147 6.445 6.003 6.445 3.108 0 4.596-1.457 4.596-1.457v-.012z"/></svg>'

var icon_spotify = '<svg aria-labelledby="simpleicons-spotify-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>'

var icon_youtube = '<svg aria-labelledby="simpleicons-youtube-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="a" d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>'

var icon_facebook = '<svg aria-labelledby="simpleicons-facebook-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"/></svg>'

var icon_instagram = '<svg aria-labelledby="simpleicons-instagram-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913a5.885 5.885 0 0 0 1.384 2.126A5.868 5.868 0 0 0 4.14 23.37c.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558a5.898 5.898 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.847 5.847 0 0 0 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227a3.81 3.81 0 0 1-.899 1.382 3.744 3.744 0 0 1-1.38.896c-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421a3.716 3.716 0 0 1-1.379-.899 3.644 3.644 0 0 1-.9-1.38c-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>'

var icon_foursquare = '<svg aria-labelledby="simpleicons-foursquare-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.727 3.465l-.535 2.799c-.064.303-.445.623-.801.623H11.41c-.562 0-.963.391-.963.945v.614c0 .569.405.96.966.96h4.23c.395 0 .785.436.697.855l-.535 2.76c-.051.24-.314.63-.785.63h-3.457c-.63 0-.818.091-1.239.601-.42.524-4.206 5.069-4.206 5.069-.037.045-.074.029-.074-.015V3.42c0-.359.311-.78.776-.78h10.274c.375 0 .73.356.633.821v.004zm.451 10.98c.145-.578 1.746-8.784 2.281-11.385M18.486 0H5.683C3.918 0 3.4 1.328 3.4 2.164v20.34c0 .94.504 1.291.789 1.405.284.117 1.069.214 1.541-.328 0 0 6.044-7.014 6.146-7.117.165-.157.165-.157.315-.157h3.914c1.65 0 1.906-1.17 2.086-1.86.15-.569 1.754-8.774 2.279-11.385C20.875 1.08 20.365 0 18.49 0h-.004z"/></svg>'

var icon_website = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g class="nc-icon-wrapper"><path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 22c-2.5 0-4.783-.929-6.538-2.451.008-.013.019-.024.026-.037 1.652-2.768.613-4.459-.154-5.221a7.115 7.115 0 0 0-.671-.568c-.622-.483-1.034-.802-1.034-1.723 0-.434.242-.604 1.437-1.012.822-.281 1.753-.599 2.354-1.376 1.395-1.804-.139-4.586-.461-5.126a9.065 9.065 0 0 0-.53-.786 9.945 9.945 0 0 1 5.225-1.683c.312.529.827.975 1.333 1.41.432.372 1.118.528 1.471.968.202.252.104.738.111 1.056.014.631.396 1.546 1.684 1.546.057 0 .116-.002.177-.006.498-.035 2.052-.391 3.614-.907A9.934 9.934 0 0 1 22 12c0 5.514-4.486 10-10 10z"/><path data-color="color-2" d="M15.514 8.903c-1.576 0-3.185.749-4.003 1.863-.549.748-.709 1.613-.451 2.436.515 1.642.565 2.61.243 3.695-.286.964-.314 2.362 1.319 3.028.308.126.646.19 1.002.19 1.214 0 2.651-.751 3.944-2.062 1.554-1.575 2.468-3.505 2.446-5.165-.03-2.234-2.007-3.985-4.5-3.985z"/></g></svg>'

function getEventDate(event) {

  var date = event.date;

  var date_formated = moment(date).format('dddd, MMMM DD');

  var date_string = '<div class="date"><span class="day">' + date_formated + '</span> ' + getEventTime(event) + '</div>'

  return date_string;
}

function getEventTime(event) {

  var time = event.time

  if (time) {
    var time_formated = time.slice(0, -3);
    var time_string = '<span class="time">(' + time_formated + ')</span>'
    return time_string
  } else {
    return ''
  }

}

function getVenueCard(event) {


  // get name first
  if (event.venue.name.length > 0) {
    var venue_name = event.venue.name;
    var name = '<h2 class="venue__name">' + venue_name + '</h2>'
  } else {
    var name = ''
  }


  // get foursquare info
  if (Object.keys(event.foursquare).length > 0) {

    // description
    var fq_description = event.foursquare.description
    if (fq_description) {
      var description = '<p class="venue__description">' + fq_description + '</p>'
    } else {
      var description = ''
    }

    // rating
    var fq_rating = event.foursquare.rating
    if (fq_rating) {
      var rating_number = fq_rating
      var rating_color = event.foursquare.rating_color
      var rating = '<span title="Foursquare rating" class="rating" style="background-color:#' + rating_color + ';"><span>'+rating_number+'</span></span>'
    } else {
      var rating = ''
    }

    // address
    var address = getFqAddress(event)

    // tips
    var tips = getFqTips(event)

    // contact
    var contact = getFqContact(event)

  } else {
    var description = '';
    var rating = '';
    var address = '';
    var tips = '';
    var contact = '';
  }

  // construct card
  var venue_string =
    '<div class="venue">'
      + '<div class="venue__title">'
        + name
        + rating
      + '</div>'
    + address
    + description
    + contact
    + tips
    + '</div>'


  return venue_string;
}

function getMapUrl(long, lat) {
  var base = 'https://www.google.com/maps/search/?api=1&query='
  var query = lat + ',' + long
  var url = base+query
  return url
}

function getFqAddress(event) {


  // get google url
  if (event.venue.location) {
    var venue_lng = event.venue.location.lng
    var venue_lat = event.venue.location.lat
    var google_url = getMapUrl(venue_lng, venue_lat)
    var google_link = ' <a class="google-maps" href="' + google_url + '" target="_blank">Google Maps</a>'
  } else {
    var google_link = ''
  }

  var fq_location = event.foursquare.location
  if (fq_location) {

    if (fq_location.address) {
      var address = fq_location.address
      var address = '<span class="street">' + address + '</span>'
    } else {
      var address = ''
    }
    if (fq_location.zip) {
      var zip = fq_location.zip
      var zip = '<span class="zip">' + zip + '</span>'
    } else {
      var zip = ''
    }

    var address_string = '<div class="venue__address">' + address + zip + google_link + '</div>'

    return address_string
  } else { // return empty string if there is no location data
    return ''
  }
}

function getFqTips(event) {
  var fq_tips = event.foursquare.tips

  if (fq_tips) {
    var tips_array = []

    fq_tips.forEach(function(tip) {
      // text
      var tip_text = '<blockquote class="tip__text">' + tip.text + '</blockquote>'

      // user
      var user = tip.user
      var user_image_dimensions = '25x25'
      if (user) {
        var user_name = user.first_name
        var user_image_url = user.photo.prefix + user_image_dimensions + user.photo.suffix
        var user_string =
          '<div class="tip__author">'
            + '<img src="' + user_image_url + '" alt="' + user_name + '">'
            + '<span class="name">' + user_name + '</span>'
          + '</div>'
      } else {
        var user_string = ''
      }

      var tip_string =
        '<div class="tip">'
          + tip_text
          + user_string
        + '</div>'
      tips_array.push(tip_string);
    });

    var tips_string = '<div class="venue__tips">'

    tips_array.forEach(function(tip) {
      tips_string = tips_string + tip
    })

    tips_string = tips_string + '</div>'

    return tips_string

  } else {
    return ''
  }
}

function getFqContact(event) {

  // url
  var fq_url = event.foursquare.fq_url
  if (fq_url) {
    var foursquare = '<a class="foursquare" href="' + fq_url + '" target="_blank">'+icon_foursquare+'</a>'
  } else {
    var foursquare = ''
  }

  // contact object
  var fq_contact = event.foursquare.contact
  if (fq_contact) {
    // facebook
    if (fq_contact.facebook_username)  {
      var facebook_url = 'https://www.facebook.com/' + fq_contact.facebook_username
      var facebook = '<a class="facebook" href="' + facebook_url + '" target="_blank">' + icon_facebook + '</a>'
    } else {
      var facebook = ''
    }
    // instagram
    if (fq_contact.instagram) {
      var instagram_url = 'https://www.instagram.com/' + fq_contact.instagram
      var instagram = '<a class="instagram" href="' + instagram_url + '" target="_blank">' + icon_instagram + '</a>'

    } else {
      var instagram = ''
    }

    // website
    if (fq_contact.url) {
      var website = '<a class="website" href="' + fq_contact.url + '" target="_blank">' + icon_website + '</a>'
    } else {
      var website = ''
    }
  }

  var contact_string = '<div class="venue__contact">' + website + facebook + instagram + foursquare + '</div>'

  return contact_string

}

function getArtistCard(artist) {

  var artist_card =
    // artist
    '<div class="artist">'

      // image
      + '<div class="artist__image">'
        + '<img src="' + getImageUrl(artist) + '" alt="' + artist.name + '" />'
      + '</div>'
      // /image

      // info
      + '<div class="artist__info">'

        // name
        + '<h3 class="artist__name">'
        + artist.name
        + '</h3>'
        // /name

        // genres
        + '<div class="artist_links">'
          + getArtistLinks(artist)
        + '</div>'
        // /genres

      + '</div>'
      // /info

      + getTopTracksWidget(artist)

    // /artist
    + '</div>'


  return artist_card;
};

function printArtistCards(artists) {

  var all_cards = ''

  for (var i = 0, l = artists.length; i < l; i++) {
    var artist_card = getArtistCard(artists[i]);
    all_cards = all_cards + artist_card;
  }

  return all_cards;
};

function getImageUrl(artist) {
  var image_placeholder = '/assets/img/no_image_artist.jpeg';

  if (artist.spotify.image) {
    var image_object = artist.spotify.image[2];
    if (image_object) {
      var artist_image_url = image_object.url
      return artist_image_url;
    } else {
      var artist_image_url = image_placeholder;
      return artist_image_url;
    }
  } else if (artist.lastfm.image) {
    var image_object = artist.lastfm.image[1];
    if (image_object.url) {
      var artist_image_url = image_object.url;
      return artist_image_url;
    } else {
      var artist_image_url = image_placeholder;
      return artist_image_url;
    }
  } else {
    var artist_image_url = image_placeholder;
    return artist_image_url;
  }

}

function getTopTracksWidget(artist) {
  var top_tracks = getTopTracks(artist);

  if (top_tracks.length > 1) {
    var top_tracks_widget =
      // more
      '<div class="artist__more">'
        + '<a class="show-more" data-toggle="collapse" href="#panel-' + artist.id + '" role="button" aria-expanded="false" aria-controls="' + artist.id + '">Play top tracks</a>'
        // panel
        + '<div class="collapse" id="panel-' + artist.id + '">'
          + top_tracks
        + '</div>'
        // /panel
      + '</div>'
    // /more
  } else {
    var top_tracks_widget = ''
  }

  return top_tracks_widget
}

function getTopTracks(artist) {

  var top_tracks = []

  if (artist.spotify.tracks) {
    // check length
    var tracks = artist.spotify.tracks;
    var tracks_len = tracks.length;

    if (tracks.len < 1) {
      // do nothing
    } else if (tracks_len == 1) {
      // return 1 track
      top_tracks = tracks;
    } else if (tracks_len == 2) {
      // return 2 tracks
      top_tracks = tracks;
    } else if (tracks_len > 2) {
      // shorten array to 3
      var tracks_reduced = tracks.slice(0, 3);
      top_tracks = tracks_reduced;

    }

  } else {
    // do nothing
  }

  var top_tracks_array = getTopTracksArray(top_tracks);

  if (top_tracks_array.length > 0) {

    var top_tracks_card = '<div class="top-tracks">'

    top_tracks_array.forEach(function (track) {

      if (track.url) {
        var track_preview =
          '<div class="track__preview">'
            + '<audio class="audio-player" controls controlsList="nodownload">'
              + '<source src="' + track.url + '" type="audio/mpeg">'
            + 'Your browser does not support the audio element'
            + '</audio>'
          + '</div>';
      } else {
        var track_preview = '';
      }

      var track_card =
        '<div class="track">'
          + '<div class="track__name">'
            + '<a href="'+ track.spotify_url +'" target="blank" title="' + track.name + '">'
              + textTruncate(track.name, 24, '...')
            + '</a>'
          + '</div>'
          + track_preview
        + '</div>';
      top_tracks_card = top_tracks_card + track_card;
    })

    top_tracks_card = top_tracks_card + '</div>'

  } else {
    var top_tracks_card = ''
  }

  return top_tracks_card;


};

function getTopTracksArray(tracks) {

  var top_tracks_array = [];

  for (var i = 0, l = tracks.length; i < l; i++) {
    var track = tracks[i];
    var track_name = track.name;
    var track_url = '';
    var track_spotify_url = '';
    if (track.preview_url) {
      track_url = track.preview_url;
    }
    if (track.href) {
      track_spotify_url = track.href;
    }
    var track_object = {
      name: track_name,
      url: track_url,
      spotify_url: track_spotify_url
    }

    top_tracks_array.push(track_object);
  }

  return top_tracks_array;

};

function getArtistLinks(artist) {

  // construct string
  var links_string = '<div class="links">'

  if (artist.songkick_url) {
    var link_songkick =
      '<a class="link songkick" href="'+ artist.songkick_url + '" target="_blank" title="' + artist.name + ' on SongKick">'
      + icon_songkick
      +'</a>'
    links_string = links_string + link_songkick
  } else {
    // do nothing
  }

  if (artist.lastfm) {
    if (artist.lastfm.url) {
      var link_lastfm =
        '<a class="link lastfm" href="' + artist.lastfm.url + '" target="_blank" title="'+ artist.name +' on Last.fm">'
        + icon_lastfm
        +'</a>'
      links_string = links_string + link_lastfm

    } else {
      // do nothing
    }
  } else {
    // do nothing
  }

  if (artist.spotify) {
    if (artist.spotify.href) {
      var link_spotify =
        '<a class="link spotify" href="' + artist.songkick_url + '" target="_blank" title="'+ artist.name +' on Spotify">'
        + icon_spotify
        +'</a>'
      links_string = links_string + link_spotify

    } else {
      // do nothing
    }
  } else {
    // do nothing
  }

  var artist_name = artist.name
  var search_string = artist_name.split(' ').join('+')
  var youtube_search = 'https://www.youtube.com/results?search_query=' + search_string

  var link_youtube =
    '<a class="link youtube" href="' + youtube_search + '" target="_blank" title="'+ artist.name +' on YouTube">'
    + icon_youtube
    +'</a>'
  links_string = links_string + link_youtube

  links_string = links_string + '</div>'

  return links_string

}

function getEventGenres(event) {

  var genres_array = []

  if(event.spotify) {
    if(event.spotify.genres.length > 0) {
      var genres = event.spotify.genres
      genres.forEach(function(genre) {
        genres_array.push(genre);
      })
    }
  }

  if(event.lastm) {
    if(event.lastfm.tags.length > 0) {
      var tags = event.lastfm.tags
      tags.forEach(function(tag) {
        genres_array.push(tag);
      })
    }
  }

  var genres_string = ''

  if(genres_array.length > 0) {

    // remove duplicates
    var genres_reduced = genres_array.filter(function(elem, pos) {
      return genres_array.indexOf(elem) == pos;
    });

    // remove specific strings
    var genres_clean = removeFromArray(genres_reduced, 'seen live');

    // set max number of elements
    var genres_final = genres_clean.slice(0, 15);

    // attach genre to final string
    genres_final.forEach(function(genre) {
      var genre = '<span class="genre badge badge-dark">' + genre + '</span>'
      genres_string = genres_string + genre
    })

  }

  return genres_string

}

function removeFromArray(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

function textTruncate (str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};