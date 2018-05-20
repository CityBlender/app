export Vue.component('event-card', {
  props: ['event'],
  template: '<h2>{{ event.name }}</h2>'
})