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
        + '<a class="show-more badge badge-dark" data-toggle="collapse" href="#panel-' + artist.id + '" role="button" aria-expanded="false" aria-controls="' + artist.id + '">Play top tracks</a>'
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
      + '<svg aria-labelledby="simpleicons-songkick-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.55 18.779c-1.855 0-3.372-.339-4.598-1.602l1.92-1.908c.63.631 1.74.853 2.715.853 1.186 0 1.739-.391 1.739-1.089 0-.291-.06-.529-.239-.717-.15-.154-.404-.273-.795-.324l-1.455-.205c-1.064-.152-1.891-.51-2.43-1.072-.555-.578-.84-1.395-.84-2.434C2.536 8.066 4.2 6.45 6.96 6.45c1.74 0 3.048.407 4.086 1.448L9.171 9.77c-.765-.766-1.77-.715-2.295-.715-1.039 0-1.465.597-1.465 1.125 0 .152.051.375.24.561.15.153.404.307.832.359l1.467.203c1.09.153 1.875.495 2.385 1.005.645.63.9 1.53.9 2.655 0 2.47-2.127 3.819-4.68 3.819l-.005-.003zM20.813 2.651C19.178 1.432 17.37.612 15.089.237v10.875l3.261-4.539h3.565l-4.095 5.72s.944 1.51 1.515 2.405c.586.899 1.139 1.14 1.965 1.14h.57v2.806h-.872c-1.812 0-2.9-.33-3.72-1.575-.504-.811-2.175-3.436-2.175-3.436v4.995H12.12V-.001H12c-3.852 0-6.509.931-8.811 2.652C-.132 5.137.001 8.451.001 11.997c0 3.547-.133 6.867 3.188 9.352C5.491 23.074 8.148 24 12 24s6.51-.927 8.812-2.651C24.131 18.865 24 15.544 24 11.997c0-3.546.132-6.859-3.188-9.346h.001z"/></svg>'
      +'</a>'
    links_string = links_string + link_songkick
  } else {
    // do nothing
  }

  if (artist.lastfm) {
    if (artist.lastfm.url) {
      var link_lastfm =
        '<a class="link lastfm" href="' + artist.lastfm.url + '" target="_blank" title="'+ artist.name +' on Last.fm">'
        + '<svg aria-labelledby="simpleicons-lastfm-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.599 17.211l-.881-2.393s-1.433 1.596-3.579 1.596c-1.9 0-3.249-1.652-3.249-4.296 0-3.385 1.708-4.596 3.388-4.596 2.418 0 3.184 1.568 3.845 3.578l.871 2.751c.871 2.672 2.523 4.818 7.285 4.818 3.41 0 5.722-1.045 5.722-3.801 0-2.227-1.276-3.383-3.635-3.935l-1.757-.384c-1.217-.274-1.577-.771-1.577-1.597 0-.936.736-1.487 1.952-1.487 1.323 0 2.028.495 2.147 1.679l2.749-.33c-.225-2.479-1.937-3.494-4.745-3.494-2.479 0-4.897.936-4.897 3.934 0 1.873.902 3.058 3.185 3.605l1.862.443c1.397.33 1.863.916 1.863 1.713 0 1.021-.992 1.441-2.869 1.441-2.779 0-3.936-1.457-4.597-3.469l-.901-2.75c-1.156-3.574-3.004-4.896-6.669-4.896C2.147 5.327 0 7.879 0 12.235c0 4.179 2.147 6.445 6.003 6.445 3.108 0 4.596-1.457 4.596-1.457v-.012z"/></svg>'
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
        + '<svg aria-labelledby="simpleicons-spotify-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>'
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
    + '<svg aria-labelledby="simpleicons-youtube-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="a" d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>'
    +'</a>'
  links_string = links_string + link_youtube

  links_string = links_string + '</div>'

  return links_string


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