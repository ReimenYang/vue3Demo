import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Element from './plugins/element'
import * as echarts from 'echarts'
import libs from '@/libs'

const app = createApp(App)
  .use(store)
  .use(router)
  .use(VueAxios, axios)
  .use((app, options, name) => app.config.globalProperties[name] = options, libs, 'libs')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.configProject.globalData, 'globalData')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.request, 'request')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.api, 'api')
  .use(Element)
  .mount('#app')

app.echarts = echarts
window.X = { ...libs }
