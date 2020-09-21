import Vue from 'vue'
import App from './liveRooms.vue'


Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')