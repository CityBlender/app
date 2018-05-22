import { config } from './config';
import './components/pulsingIcon';
import { getEventCard } from './components/eventCard';

new Vue({
  el: '#app',
  data: {
    loading: true,
    errored: false,
    isLoaded: false,
    events: null,
    map: null,
    tileLayer: null,
    energyLayer: null,
    danceabilityLayer: null,
    laudnessLayer: null,
    layerSwitch: null,
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
        position: 'bottomleft'
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

    plotEvents() {
      const events = this.events;
      const map = this.map;
      events.forEach(function(event) {
        var lat = event.location.lat;
        var lng = event.location.lng;
        var event_artists = event.artists;
        var pulsingIcon = L.icon.pulse({ iconSize: [8, 8], color: '#C70039' });
        // create a marker
        L.marker([lat, lng], { icon: pulsingIcon }).bindPopup(getEventCard(event)).addTo(map);


      });
    },

    // create heatmap
    initLayer() {
      // var cfg = {
      //   "radius": 0.01,
      //   "maxOpacity": .8,
      //   "scaleRadius": true,
      //   "useLocalExtrema": true,
      //   latField: 'lat',
      //   lngField: 'lng',
      //   valueField: 'energy'
      // };
      const heatmapData = []
      this.events.forEach(function(event, i) {
        if (typeof event.spotify !== "undefined"){
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            energy: event.spotify.energy_median,
            danceability: event.spotify.danceability_median,
            laudness: event.spotify.loudness_median,
          }
        } else {
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            energy: 0,
            danceability: 0,
            laudness: 0
          }
        }
      });
      // var vibesData = {
      //   max: 1.0,
      //   data: heatmapData,
      // };

      this.energyLayer = L.heatLayer([
        [51.530067, -0.121631, 0.5],
        [51.530067, -0.121632, 0.3],
        [51.530067, -0.12, 0.2],

      ], {radius: 25}).addTo(this.map);
      

      // this.danceabilityLayer = L.heatLayer([
      //   [51.517286, -0.100752, 0.2],
      // ], {radius: 25})

      // this.laudnessLayer = L.heatLayer([
      //   [51.517286, -0.100752, 0.3],
      // ], {radius: 25})

      // this.energyLayer = new HeatmapOverlay(cfg);
      // this.energyLayer.setData(vibesData);
      

      // construct danceability layer
      // cfg.valueField = 'danceability';
      // this.danceabilityLayer = new HeatmapOverlay(cfg);
      // this.danceabilityLayer.setData(vibesData);

      // construct loudness layer 
      // cfg.valueField = 'laudness';
      // this.laudnessLayer = new HeatmapOverlay(cfg);
      // this.laudnessLayer.setData(vibesData);

      // set the layer list property to the map object
      this.map._layers = []

      // construct the layer switch buttons
      // var layer_list = {
      //   "Energy": this.energyLayer,
      //   "Danceability": this.danceabilityLayer,
      //   "Laudness": this.laudnessLayer,
      // }
      // this.layerSwitch = L.control.layers(layer_list);
    },

    // layer change
    layerChanged(active) {
      // construct layer list
      if (active) {

        


        
        // this.laudnessLayer.addTo(this.map);
        // this.layerSwitch.addTo(this.map);
      } else {
        // this.laudnessLayer.removeFrom(this.map);
        // this.layerSwitch.remove(this.map);
      }
    }
  }
});



