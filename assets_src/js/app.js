import { config } from './config';
import './components/pulsingIcon';
// import { getEventCard } from './components/eventCard';
// import { getArtists } from './components/getArtists';

new Vue({
  el: '#app',
  data: {
    loading: true,
    errored: false,
    isLoaded: false,
    events: null,
    map: null,
    tileLayer: null,
    heatmapLayer: null,
    layers: [
      {
        name: 'Vibes',
        active: false,
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
          this.isLoaded = true
          this.events = response.data;
          this.plotEvents()
          this.initLayer()

        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => this.loading = false)
    },

    getArtist(artist_id) {
      axios
        .get('https://fuinki-api.herokuapp.com/artist/' + artist_id)
        .then(response => {
          var artist_data = response.data;
          return artist_data;
        })
        .catch(error => {
          console.log(error);
          return;
        })
    },

    getArtistArray(argument) {

      return argument

      // create empty artist array
      // var artist_array = [];

      // if (artists === undefined || artists.length == 0) {
      //   return artist_array;
      // } else {
      //   // loop through artists
      //   artists.forEach(function (artist) {
      //     var artist_data = artist.name;
      //     artist_array.push(artist_data);
      //   });

      //   return artist_array;
      // }

    },

    plotEvents() {
      const events = this.events;
      const map = this.map;
      const lala = this.getArtistArray('muuuuu');
      var _this = this;

      console.log(lala);
      events.forEach(function(event) {
        var lat = event.location.lat;
        var lng = event.location.lng;
        var event_artists = event.artists;
        // console.log(event_artists)
        // var artists = getArtistArray('llaaaa');
        // console.log(artists)
        var pulsingIcon = L.icon.pulse({ iconSize: [8, 8], color: '#C70039' });
        // create a marker
        var marker = L.marker([lat, lng], { icon: pulsingIcon }).addTo(map);


        // attach event listener to marker
        marker.on('click', console.log('meh..'))
        // marker.addEventListener('click', _this.getEventCard('hahaha'), false);


      });
    },

    getEventCard(para) {
      console.log(para);
    },

    // create heatmap
    initLayer() {
      var cfg = {
        "radius": 0.01,
        "maxOpacity": .8,
        "scaleRadius": true,
        "useLocalExtrema": true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
      };
      const heatmapData = []
      this.events.forEach(function(event, i) {
        if (typeof event.spotify !== "undefined"){
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            count: event.spotify.danceability_median
          }
        } else {
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            count: 0
          }
        }
      });
      var vibesData = {
        max: 1.0,
        data: heatmapData,
      };
      this.heatmapLayer = new HeatmapOverlay(cfg);
      this.heatmapLayer.setData(vibesData);
    },

    // layer change
    layerChanged(active) {
      if (active) {
        this.heatmapLayer.addTo(this.map);
      } else {
        this.heatmapLayer.removeFrom(this.map);
      }
    },

    getEvent(event_id) {
      console.log(event_id);
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


