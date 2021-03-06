import { map } from 'asyncro';
import { config } from './config';
import './components/pulsingIcon';
import { getEventCardTemplate } from './components/eventCard';
import { getDate } from './components/utils';

Vue.component('v-select', VueSelect.VueSelect)


new Vue({
  el: '#app',
  data: {
    dayOptions: [
      { date: getDate(0)[0], string: getDate(0)[1] },
      { date: getDate(1)[0], string: getDate(1)[1] },
      { date: getDate(2)[0], string: getDate(2)[1] },
      { date: getDate(3)[0], string: getDate(3)[1] },
      { date: getDate(4)[0], string: getDate(4)[1] },
      { date: getDate(5)[0], string: getDate(5)[1] },
      { date: getDate(6)[0], string: getDate(6)[1] },
      { date: getDate(7)[0], string: getDate(7)[1] }
    ],
    daySelected: { date: getDate(0)[0], string: getDate(0)[1] },
    vibeChecked: false,
    loading: true,
    search: '',
    markers: {},
    markersLayer: L.layerGroup(),
    activeMarker: null,
    vibeChecked: false,
    errored: false,
    isLoaded: false,
    events: null,
    currentArtists: null,
    map: null,
    tileLayer: null,
    layerSwitch: null,
    energyAve: null,
    danceabilityAve: null,
    layers: [
      {
        id: 0,
        name: 'Turn on the vibes',
        active: false,
      }
    ],
  },
  mounted() {
    this.initMap();
    this.getEvents();
  },
  computed: {
    filteredList() {
      return this.events.filter(event => {
        var name = event.name
        var tags = ''

        // get spotify genres
        if(event.spotify) {
          if (event.spotify.genres.length > 0) {
            event.spotify.genres.forEach(function(genre) {
              tags = tags + ' ' + genre;
              // tags.push(genre)
            })
          }
        }

        // get last.fm tags
        if(event.lastfm) {
          if (event.lastfm.tags.length > 0) {
            event.lastfm.tags.forEach(function(tag) {
              tags = tags + ' ' + tag
              // tags.push(tag)
            })
          }
        }

        // get venue
        if(event.venue.name) {
          var venue = event.venue.name
        }

        // lowercase everything
        name = name.toLowerCase()
        tags = tags.toLowerCase()
        venue = venue.toLowerCase()

        var searchable = name + tags + venue

        return searchable.includes(this.search.toLowerCase())
      })
    }
  },
  methods: {

    // initialize a Leaflet instance
    initMap() {
      document.getElementById("vibe-checkbox").checked = true
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
      // console.log(this.map.getLayers())
      this.isLoaded = false
      axios
       // .get('https://fuinki-api.herokuapp.com/london/events/' + this.daySelected.date)
      .get('https://fuinki-api.herokuapp.com/london/events/2019-07-19')
      .then(response => {
        this.isLoaded = true
        this.events = response.data;
        this.getAve()
        this.plotEvents()
        this.initLayer()
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => this.loading = false)
    },

    toggleLayer(layer) {
      if (layer.active) {
        layer.active = false
      } else {
        layer.active = true
      }
    },

    checkActive(event) {
      var event_id = event.id;
      // remove all active classes first
      var target_el = document.querySelectorAll('.event-list .event');
      target_el.forEach(function(target) {
        if(target.classList.contains('active')) {
          target.classList.remove('active')
        }
        // target.classList.remove('active');
        console.log(target);
      });
      var active_el = document.getElementById('#list-' + event_id)
      active_el.classList.add('active');
    },

    async plotEvents() {
      var events = this.events;
      var map = this.map;
      var _this = this;

      this.removeMarkers();
      this.removeLayers();
      this.vibeChecked = false
      this.layers[0].active = false

      // var markers = {};

      this.asyncForEach(events, function(event) {


        if (event.location.lat) {
          var lat = event.location.lat;
          var lng = event.location.lng;
          var event_artists = event.artists;

          var pulsingIcon = L.icon.pulse({ iconSize: [11, 11], color: '#C70039' });

          // add marker to the map
          // var marker = L.marker([lat, lng], { icon: pulsingIcon });
          _this.markers[event.id] = L.marker([lat, lng], { icon: pulsingIcon });
          _this.markers[event.id].id = event.id;
          var marker = _this.markers[event.id];
          _this.markersLayer.addLayer(marker);


          // add onClick event
          marker.on('click', async function () {
            // var event_card = await _this.getEventCard(event);
            // marker.bindPopup(event_card).openPopup();
            _this.openMarker(event);
          });

          // add spider chart
          marker.on('mouseover', async function () {
            if (document.getElementById('vibe-checkbox').checked) {

              // prepare data for spider chat
              if (typeof event.spotify !== "undefined") {
                _this.openVibes(event);
              } else {
                var noVibe = '<div class="no-vibe">' + "No vibes data available for this event" + '</div>'
                marker.bindPopup(noVibe).openPopup();
              }

            } else {
              // do nothing
            }
          });

        }
      })

      // remove all the popup when the check box is clicked
      document.getElementById("vibe-checkbox").addEventListener("click", function () {
        map.closePopup()
      })

      // plot the layer group
      this.map.addLayer(this.markersLayer);
    },

    async openMarker(event) {
      // this.checkActive(event);
      var event_id = event.id
      var event_card = await this.getEventCard(event);
      var marker = this.markers[event_id];
      marker.bindPopup(event_card).openPopup();
      const players = Array.from(document.querySelectorAll('.audio-player')).map(p => new Plyr(p, {
        controls: ['play', 'progress']
      }));
    },

    async openVibes(event) {
      // this.checkActive(event);
      var event_id = event.id
      var vibe_card = await this.getVibeCard(event);
      var marker = this.markers[event_id];
      marker.bindPopup(vibe_card).openPopup();
    },


    async getEventCard(event) {

      // get artist array
      var artist_array = await this.getArtistArray(event.artists);

      // append artist array to event object
      event.artist_array = await artist_array;
      var event_card = await getEventCardTemplate(event);
      return event_card;
    },

    async getVibeCard(event) {
      var events = this.events;
      var map = this.map;
      var _this = this;
      var energyAve = this.energyAve
      var danceabilityAve = this.danceabilityAve
      var loudnessAve = this.loudnessAve / 60 + 1
      var speechinessAve = this.speechinessAve
      var acousticnessAve = this.acousticnessAve
      var livenessAve = this.livenessAve
      var instrumentalnessAve = this.instrumentalnessAve
      var valenceAve = this.valenceAve
      var tempoAve = (this.tempoAve - 80) / 70

      var energy_data = event.spotify.energy_median
      var danceability_data = event.spotify.danceability_median
      var loudness_data = event.spotify.loudness_median / 60 + 1
      var speechiness_data = event.spotify.speechiness_median
      var acousticness_data = event.spotify.acousticness_median
      var liveness_data = event.spotify.liveness_median
      var instrumentalness_data = event.spotify.instrumentalness_median
      var valence_data = event.spotify.valence_median
      var tempo_data = (event.spotify.tempo_median - 80) / 70

      // construct spider chart

      var canvas = document.createElement('canvas');
      canvas.width = 3
      canvas.height = 2
      var ctx = canvas.getContext('2d');
      var color = 'rgb(244, 53, 48, 0.4)';
      var color_ave = 'rgb(0, 152, 216, 0.4)'
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            "Energy", "Danceability", "Loudness", "Speechiness", "Acousticness",
            "Liveness", "Instrumentalness", "Valence", "Tempo"],
          datasets: [{
            label: "Vibes of this event",
            pointHitRadius: 2,
            pointHoverRadius: 3,
            backgroundColor: color,
            borderColor: color,
            pointBackgroundColor: color,
            gridLines: {
              display: false
            },
            data: [energy_data, danceability_data, loudness_data
              , speechiness_data, acousticness_data, liveness_data
              , instrumentalness_data, valence_data,],
          }, {
            label: "Average vibes",
            pointHitRadius: 2,
            pointHoverRadius: 3,
            backgroundColor: color_ave,
            borderColor: color_ave,
            pointBackgroundColor: color_ave,
            gridLines: {
              display: false
            },
            data: [energyAve, danceabilityAve, loudnessAve
              , speechinessAve, acousticnessAve, livenessAve
              , instrumentalnessAve, valenceAve,],
          }]
        },
        options: {
          legend: {
            position: 'top',
            labels: {
              stretch: false
            }
          },
          scale: {
            ticks: {
              display: false
            }
          }
        },
      });

      return canvas;
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

    removeMarkers() {
      this.markers = {};
      this.markersLayer.clearLayers();
    },




    async getAve (){
      var events = this.events

      // get average of energy
      var energyList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await energyList.push(event.spotify.energy_median)
        }
      })
      this.energyAve = energyList.reduce(function(a, b) { return a + b; }) / energyList.length

      // get average of danceability
      var danceabilityList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await danceabilityList.push(event.spotify.danceability_median)
        }
      })
      this.danceabilityAve = danceabilityList.reduce(function(a, b) { return a + b; }) / danceabilityList.length

      // get average of loudness
      var loudnessList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await loudnessList.push(event.spotify.loudness_median)
        }
      })
      this.loudnessAve = loudnessList.reduce(function(a, b) { return a + b; }) / loudnessList.length

      // get average of speechiness
      var speechinessList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await speechinessList.push(event.spotify.speechiness_median)
        }
      })
      this.speechinessAve = speechinessList.reduce(function(a, b) { return a + b; }) / speechinessList.length

      // get average of acousticness
      var acousticnessList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await acousticnessList.push(event.spotify.acousticness_median)
        }
      })
      this.acousticnessAve = acousticnessList.reduce(function(a, b) { return a + b; }) / acousticnessList.length

      // get average of liveness
      var livenessList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await livenessList.push(event.spotify.liveness_median)
        }
      })
      this.livenessAve = livenessList.reduce(function(a, b) { return a + b; }) / livenessList.length

      // get average of instrumentalness
      var instrumentalnessList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await instrumentalnessList.push(event.spotify.instrumentalness_median)
        }
      })
      this.instrumentalnessAve = instrumentalnessList.reduce(function(a, b) { return a + b; }) / instrumentalnessList.length

      // get average of valence
      var valenceList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await valenceList.push(event.spotify.valence_median)
        }
      })
      this.valenceAve  = valenceList.reduce(function(a, b) { return a + b; }) / valenceList.length

      // get average of tempo
      var tempoList = []
      events.forEach(async function(event) {
        if (event.spotify){
          await tempoList.push(event.spotify.tempo_median)
        }
      })
      this.tempoAve = tempoList.reduce(function(a, b) { return a + b; }) / tempoList.length
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

    removeLayers(){
      if (this.layerSwitch){
        this.layerSwitch.remove(this.map)
      }
      if (this.energyLayer){
        this.energyLayer.remove(this.map)
      }
      if (this.danceabilityLayer){
        this.danceabilityLayer.removeFrom(this.map);
      }
      if (this.loudnessLayer){
        this.loudnessLayer.removeFrom(this.map);
      }
      if (this.speechinessLayer){
        this.speechinessLayer.removeFrom(this.map);
      }
      if (this.acousticnessLayer){
        this.acousticnessLayer.removeFrom(this.map);
      }
      if (this.livenessLayer){
        this.livenessLayer.removeFrom(this.map);
      }
      if (this.instrumentalnessLayer){
        this.instrumentalnessLayer.removeFrom(this.map);
      }
      if (this.valenceLayer){
        this.valenceLayer.removeFrom(this.map);
      }
      if (this.tempoLayer){
        this.tempoLayer.removeFrom(this.map);
      }



    },

    // layer change
    layerChanged(active) {
      // construct layer list
      if (active) {
        this.energyLayer.addTo(this.map);
        this.layerSwitch.addTo(this.map);
      } else {
        this.removeLayers()
      }
    }
  }
});



