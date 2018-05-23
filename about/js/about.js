$(document).ready(function () {

  // listen on click of tab
  $( "#Genre-tab" ).click(function() {
    var ifrm = document.createElement("iframe");
    ifrm.setAttribute("src", "//plot.ly/~cohenjota/79.embed");
    ifrm.frameBorder = 0;
    ifrm.style.width = "1400";
    ifrm.style.height = "100";
    document.getElementById('Genre').appendChild(ifrm);
  });




  // get
});

