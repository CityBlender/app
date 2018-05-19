$(document).ready(function () {

    var today = moment().tz('Europe/London').format('YYYY-MM-DD');


    console.log(today)



    getEvents(today);

});


