import { map } from 'asyncro';
import { config } from './config';
import './components/pulsingIcon';
import { getEventCardTemplate } from './components/eventCard';

new Vue({
  el: '#app',
  data: {
    loading: true,
    errored: false,
    isLoaded: false,
    events: null,
    currentArtists: null,
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

    async plotEvents() {
      var events = this.events;
      var map = this.map;
      var _this = this;

      this.asyncForEach(events, function(event) {
        var lat = event.location.lat;
        var lng = event.location.lng;
        var event_artists = event.artists;
        // console.log(event_artists)
        // var artists = getArtistArray('llaaaa');
        // console.log(artists)
        var pulsingIcon = L.icon.pulse({ iconSize: [10, 10], color: '#C70039' });

        // add marker to the map
        var marker = L.marker([lat, lng], { icon: pulsingIcon }).addTo(map);

        // add onClick event
        marker.on('click mouseover', async function () {
          var event_card = await _this.getEventCard(event);
          marker.bindPopup(event_card);

          const players = Array.from(document.querySelectorAll('.audio-player')).map(p => new Plyr(p, {
            controls: ['play', 'progress']
          }));
        });
      })
      // events.forEach(function(event) {


      // });
    },

    async getEventCard(event) {

      // get artist array
      var artist_array = await this.getArtistArray(event.artists);

      // append artist array to event object
      event.artist_array = await artist_array;

      var event_card = await getEventCardTemplate(event);

      return event_card;

    },

    async getArtistArray(artists) {
      var _this = this;

      var artist_array = await map(artists, async function(artist) {
        var artist_info = await _this.getArtist(artist.id);
        return artist_info;
      });

      return artist_array;
    },

    async getArtist(artist_id) {
      try {
        var response = await axios.get('https://fuinki-api.herokuapp.com/artist/' + artist_id);
        var artist_data = await response.data[0];
        return artist_data;
      } catch(error) {
        console.log(error);
      }
    },

    async asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
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
    }
  }
});