function getArtistCard(artist) {

  var image_placeholder = '/assets/img/no_image_artist.jpeg';

  function getImageUrl(artist) {
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

      + '</div>'
      // /links

    // /artist
    + '</div>'


  return artist_card
}

function printArtistCards(artists) {

  var all_cards = ''

  for (var i = 0, l = artists.length; i < l; i++) {
    var artist_card = getArtistCard(artists[i]);
    all_cards = all_cards + artist_card;
  }

  return all_cards;

  // for (var i = 0, l = all_cards.length; i < l; i++) {
  //   return all_cards[i];
  // }

  // console.log(all_cards);

  // var all_cards = []

  // artists.map(function(artist) {
  //   var artist_card = getArtistCard(artist);
  //   // console.log(artist_card)
  //   all_cards.push(artist_card);
  // })

  // all_cards.map(function(card) {
  //   return card;
  // })
  // artists.forEach(artist => {
  //   var artist_card = getArtistCard(artist);
  //   console.log(artist_card);
  //   return artist_card;
  // });
}

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
