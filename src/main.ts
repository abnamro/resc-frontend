import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { PiniaVuePlugin, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import AxiosConfig from '@/configuration/axios-config';
import { importFA } from '@/assets/font-awesome';
import Vue3Toasity from 'vue3-toastify';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement);

import { createBootstrap } from 'bootstrap-vue-next';

import 'bootstrap/dist/css/bootstrap.css';
import 'vue3-toastify/dist/index.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import './styles/main.css';

const app = createApp(App);
app.use(PiniaVuePlugin);
app.use(router);
app.use(PrimeVue, {
  theme: {
      preset: Aura,
      options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
      }
  }
});

app.use(createBootstrap());
app.use(Vue3Toasity, { multiple: false });
importFA();
app.component('font-awesome-icon', FontAwesomeIcon);

AxiosConfig.axiosSetUp();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.mount('#app');
