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

      // set heatmap
      const heatmapData = []
      var heatmapConfig = {
        max:0.1,
        radius: 50, 
        blur:10, 
        gradient:{0.0: 'green', 0.5: 'yellow', 1.0: 'red'}
      }
      this.events.forEach(function(event, i) {
        if (typeof event.spotify !== "undefined"){
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            liveness: event.spotify.liveness,
            energy: event.spotify.energy_median,
            danceability: event.spotify.danceability_median,
            loudness: event.spotify.loudness_median,
            speechiness: event.spotify.speechiness_median,
            acousticness: event.spotify.acousticness_median,
            instrumentalness: event.spotify.instrumentalness,
            
            valence: event.spotify.valence,
            tempo: event.spotify.tempo
          }
        } else {
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            liveness: 0,
            energy: 0,
            danceability: 0,
            loudness: 0,
            speechiness: 0,
            acousticness: 0,
            instrumentalness: 0,
            
            valence: 0,
            tempo: 0
          }
        }
      });

      // construct liveness layer
      // var livenessData = heatmapData.map(function(a) {
      //   return [a.lat, a.lng, a.liveness];
      // });
      // this.livenessLayer = L.heatLayer(livenessData, heatmapConfig)

      // construct energy layer
      var energyData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.energy];
      });
      this.energyLayer = L.heatLayer(energyData, heatmapConfig)

      // construct danceability layer
      var danceabilityData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.danceability];
      });
      this.danceabilityLayer = L.heatLayer(danceabilityData, heatmapConfig)

      // construct loudness layer 
      var loudnessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.loudness/60 + 1]; // loudness ranges from around -60 to 0
      });
      this.loudnessLayer = L.heatLayer(loudnessData, heatmapConfig)

      // construct speechiness layer 
      var speechinessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, (a.speechiness-0.33)/0.33]; //  speechiness ranges from 0.33 to 0.66
      });
      this.speechinessLayer = L.heatLayer(speechinessData, heatmapConfig)

      // construct acousticness layer
      var acousticnessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.acousticness];
      });
      this.acousticnessLayer = L.heatLayer(acousticnessData, heatmapConfig)

      // construct instrumentalness layer
      // var instrumentalnessData = heatmapData.map(function(a) {
      //   return [a.lat, a.lng, a.instrumentalness];
      // });
      // this.instrumentalnessLayer = L.heatLayer(instrumentalnessData, heatmapConfig)



      // // construct valence layer
      // var valenceData = heatmapData.map(function(a) {
      //   return [a.lat, a.lng, a.valence];
      // });
      // this.valenceLayer = L.heatLayer(valenceData, heatmapConfig)

      // // construct tempo layer
      // var tempoData = heatmapData.map(function(a) {
      //   return [a.lat, a.lng, (a.tempo-80)/70]; // tempo ranges from around 80 to 150
      // });
      // this.tempoLayer = L.heatLayer(tempoData, heatmapConfig)

      // set the layer list property to the map object
      this.map._layers = []

      // construct the layer switch buttons
      var layer_list = {
        // "Liveness": this.livenessLayer,
        "Energy": this.energyLayer,
        "Danceability": this.danceabilityLayer,
        "Loudness": this.loudnessLayer,
        "Speechiness": this.speechinessLayer,
        "Acousticness": this.acousticnessLayer,
        // "Instrumentalness": this.instrumentalnessLayer,
        
        // "Valence": this.valenceLayer,
        // "Tempo": this.tempoLayer,
      }
      this.layerSwitch = L.control.layers(layer_list);
    },

    // layer change
    layerChanged(active) {
      // construct layer list
      if (active) {
        // this.energyLayer.addTo(this.map);
        this.layerSwitch.addTo(this.map);
      } else {
        // this.energyLayer.removeFrom(this.map);
        this.layerSwitch.remove(this.map);
      }
    }
  }
});



