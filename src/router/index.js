import Vue from 'vue'
import router from 'vue-router'
import addressinfo from '../page/view/pages/addressInfo.vue'
import cutpricehome from '../page/view/pages/cutPriceHome.vue'
Vue.use(router)
export default new router({
    routes:[
        {
            path: '/',
            redirect: '/cutpricehome'
        },
        {
            path: '/cutpricehome',
            component: cutpricehome
        },
        {
            path: '/addressinfo',
            component: addressinfo
        }
    ]
})