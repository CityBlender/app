var today = moment().tz('Europe/London');

export function getDate(date_offset) {

  // zero day = today
  if (date_offset == 0) {
    var date_array = [getDateShort(today), getDateLong(today)]
  } else {
    var new_date = getDateOffset(date_offset);
    var date_array = [getDateShort(new_date), getDateLong(new_date)]
  }

  return date_array

}


function getDateShort(day) {
  return day.format('YYYY-MM-DD');
}

function getDateLong(day) {
  return day.format('MMM DD (dddd)')
}

function getDateOffset(offset) {
  var new_date = moment().tz('Europe/London').add(offset, 'days');
  return new_date
}
