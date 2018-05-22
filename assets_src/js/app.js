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
    layerSwitch: null,
    layers: [
      {
        name: 'Turn on the vibes',
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
        .get('https://fuinki-api.herokuapp.com/london/events/2018-05-22')
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
        var artist_info = await _this.getArtist(artist.id, artist.songkick_url);
        return artist_info;
      });

      return artist_array;
    },

    async getArtist(artist_id, artist_url) {
      try {
        var response = await axios.get('https://fuinki-api.herokuapp.com/artist/' + artist_id);
        var artist_data = await response.data[0];
        artist_data['songkick_url'] = artist_url;
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

      // set heatmap
      const heatmapData = []
      var heatmapConfig = {
        max:0.1,
        radius: 100, 
        blur:30, 
        gradient:{0.0: 'green', 0.5: 'yellow', 1.0: 'red'}
      }
      this.events.forEach(function(event, i) {
        if (typeof event.spotify !== "undefined"){
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            energy: event.spotify.energy_median,
            danceability: event.spotify.danceability_median,
            loudness: event.spotify.loudness_median,
            speechiness: event.spotify.speechiness_median,
            acousticness: event.spotify.acousticness_median,
            liveness: event.spotify.liveness_median,
            instrumentalness: event.spotify.instrumentalness_median,
            valence: event.spotify.valence_median,
            tempo: event.spotify.tempo_median
          }
        } else {
          heatmapData[i] = {
            lat: event.location.lat,
            lng: event.location.lng,
            // store vibes data
            energy: 0,
            danceability: 0,
            loudness: 0,
            speechiness: 0,
            acousticness: 0,
            liveness: 0,
            instrumentalness: 0,
            valence: 0,
            tempo: 0
          }
        }
      });
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
        return [a.lat, a.lng, a.speechiness]; //  speechiness ranges from 0 to 1
      });
      this.speechinessLayer = L.heatLayer(speechinessData, heatmapConfig)

      // construct acousticness layer
      var acousticnessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.acousticness];
      });
      this.acousticnessLayer = L.heatLayer(acousticnessData, heatmapConfig)

      // construct liveness layer
      var livenessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.liveness];
      });
      this.livenessLayer = L.heatLayer(livenessData, heatmapConfig)

      // construct instrumentalness layer
      var instrumentalnessData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.instrumentalness];
      });
      this.instrumentalnessLayer = L.heatLayer(instrumentalnessData, heatmapConfig)

      // construct valence layer
      var valenceData = heatmapData.map(function(a) {
        return [a.lat, a.lng, a.valence];
      });
      this.valenceLayer = L.heatLayer(valenceData, heatmapConfig)

      // construct tempo layer
      var tempoData = heatmapData.map(function(a) {
        return [a.lat, a.lng, (a.tempo-80)/70]; // tempo ranges from around 80 to 150
      });
      this.tempoLayer = L.heatLayer(tempoData, heatmapConfig)

      // set the layer list property to the map object
      this.map._layers = []

      // construct the layer switch buttons
      var layer_list = {
        "Energy": this.energyLayer,
        "Danceability": this.danceabilityLayer,
        "Loudness": this.loudnessLayer,
        "Speechiness": this.speechinessLayer,
        "Acousticness": this.acousticnessLayer,
        "Liveness": this.livenessLayer,
        "Instrumentalness": this.instrumentalnessLayer,
        "Valence": this.valenceLayer,
        "Tempo": this.tempoLayer,
      }
      this.layerSwitch = L.control.layers(layer_list);

    },

    // layer change
    layerChanged(active) {
      // construct layer list
      if (active) {
        this.energyLayer.addTo(this.map);
        this.layerSwitch.addTo(this.map);
      } else {
        this.layerSwitch.remove(this.map);
        this.energyLayer.removeFrom(this.map);
        this.danceabilityLayer.removeFrom(this.map);
        this.loudnessLayer.removeFrom(this.map);
        this.speechinessLayer.removeFrom(this.map);
        this.acousticnessLayer.removeFrom(this.map);
        this.livenessLayer.removeFrom(this.map);
        this.instrumentalnessLayer.removeFrom(this.map);
        this.valenceLayer.removeFrom(this.map);
        this.tempoLayer.removeFrom(this.map);
      }
    }
  }
});



