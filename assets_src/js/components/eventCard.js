export async function getEventCardTemplate(event) {


  // final event card
  var eventCard =
    // open div
    '<div class="event">'
      + '<div class="artists">'
        + printArtistCards(event.artist_array)
      + '</div>'

    // close div
    + '</div>'


  return eventCard
};

function getArtistCard(artist) {

  getTopTracks(artist);

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

    + '</div>'
    // /info

    // links
    + '<div class="artist__links">'
    + getTopTracks(artist)
    + '</div>'
    // /links

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

  if (top_tracks_array) {
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