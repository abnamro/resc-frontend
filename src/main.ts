import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { PiniaVuePlugin, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import AxiosConfig from '@/configuration/axios-config';
import { chartJsSetup } from '@/configuration/chartjs';
import { importFA } from '@/assets/font-awesome';
import Vue3Toasity from 'vue3-toastify';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';

import './styles/main.css';

const app = createApp(App);
app.use(PiniaVuePlugin);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
});

app.use(Vue3Toasity, { multiple: false });
importFA();
app.directive('tooltip', Tooltip);
app.component('font-awesome-icon', FontAwesomeIcon);

AxiosConfig.axiosSetUp();
chartJsSetup();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(ToastService);

app.use(pinia);
app.mount('#app');
