$(document).ready(function () {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src", "//plot.ly/~cohenjota/79.embed");
  // What type of music is out there?
  $( "#Genre-tab" ).click(function() {
    document.getElementById('Genre').appendChild(ifrm);
  });
  $( "#words-tab" ).click(function() {
    ifrm.remove()
  });
  ifrm.remove()





  // get
});

