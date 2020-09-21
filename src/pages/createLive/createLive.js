import Vue from 'vue'
import App from './createLive.vue'


Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')