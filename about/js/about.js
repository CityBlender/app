$(document).ready(function () {

  function returnIframe(iframe_url) {
    var iframe = document.createElement("iframe");
    iframe.setAttribute('src', iframe_url);
    iframe.setAttribute('frameBorder', 0);
    return iframe;
  }

  $('.iframe-inject .nav-link').click(function() {

    var target_href = $(this).attr('href');
    var iframe_url = $(this).attr('data-iframe');
    var iframe_element = returnIframe(iframe_url)
    var target_element = $(target_href);

    // delete existing
    target_element.find('iframe').remove();

    // then add new one
    target_element.append(iframe_element);

  });

  // What type of music is out there?
  var ifrm_genre = document.createElement("iframe");
  ifrm_genre.setAttribute("src", "//plot.ly/~cohenjota/88.embed");
  ifrm_genre.setAttribute('frameBorder', 0);
  $( "#Genre-tab" ).click(function() {
    document.getElementById('Genre').appendChild(ifrm_genre);
  });
  $( "#words-tab" ).click(function() {
    ifrm_genre.remove()
  });




});

