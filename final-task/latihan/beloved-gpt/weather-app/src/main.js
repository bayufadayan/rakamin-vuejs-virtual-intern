import Vue from 'vue';
import App from './App.vue'
import router from './router'
import store from './store';
import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTint, faWind, faThermometerHalf, faCloud, faHome, faStar } from '@fortawesome/free-solid-svg-icons'

library.add(faTint, faWind, faThermometerHalf, faCloud, faHome, faStar)
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
store.dispatch("init");
