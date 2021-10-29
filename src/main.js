import Vue from 'vue';
import {CascaderPanel, Tooltip, Popover, Autocomplete, Tag} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {getVal} from '@/utils/arr'

import App from './App.vue';

Vue.use(CascaderPanel)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Autocomplete)
Vue.use(Tag)

Vue.prototype.getVal = getVal
Vue.filter('getVal', getVal)

new Vue({
  el: '#app',
  render: (h) => h(App),
});