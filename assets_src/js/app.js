import { config } from './config';
import './components/pulsingIcon'
import { getEventCard } from './components/eventCard'

new Vue({
  el: '#app',
  data: {
    loading: true,
    errored: false,
    isLoaded: false,
    events: null,
    map: null,
    tileLayer: null,
    layers: [
      {
        id: 0,
        name: 'Gigs',
        active: true,
        features: []
      }
    ],
  },
  mounted() {
    this.initMap();
    this.getEvents();
  },
  methods: {

    // initialize a Leaflet instance
    initMap() {

      // configure map
      this.map = L.map('map', {
        zoomControl: false // disable default zoom
      }).setView(config.london_center, config.initial_zoom);

      // configure custom tiles
      this.tileLayer = L.tileLayer(config.mapbox_tiles, {
        attribution: config.map_attribution,
        maxZoom: config.max_zoom,
        id: config.mapbox_id
      }).addTo(this.map);

      // position zoom button
      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

    },

    getEvents() {
      this.isLoaded = false
      axios
        .get('https://fuinki-api.herokuapp.com/london/events/2018-05-19')
        .then(response => {
          this.events = response.data;
          this.isLoaded = true
          this.plotEvents()
        })
        .catch(error => {
          console.log(error)
          this.errored = true
        })
        .finally(() => this.loading = false)
    },

    plotEvents() {
      const events = this.events;
      const map = this.map;
      events.forEach(function(event) {
        var lat = event.location.lat;
        var lng = event.location.lng;
        var pulsingIcon = L.icon.pulse({ iconSize: [8, 8], color: '#C70039' });
        // create a marker
        L.marker([lat, lng], { icon: pulsingIcon }).bindPopup(getEventCard(event)).addTo(map);
      });
    }

  }
});


// $(document).ready(function () {

//     var date_format = 'YYYY-MM-DD';
//     var timezone = 'Europe/London';
//     var today = moment().tz(timezone).format(date_format);

//     // function plusDay(days) {
//     //     var new_date = moment().tz(timezone).add(days, 'days').calendar();
//     //     return new_date;
//     // }

//     // function minusDay(days) {
//     //     var new_date = moment().tz(timezone).substract(days, 'days').calendar().format(date_format);
//     //     return new_date;
//     // }

//     // var tomorrow = plusDay(1);

//     // console.log(today);
//     // console.log(tomorrow);


//     getEvents(today);

// });


