export function getEventCard(event) {

  var eventCard =
    // open div
    '<div class="event-card">'
      + '<h2 class="event-name">'
        + event.name
      + '</h2>'

    // close div
    + '</div>'


  return eventCard
}
