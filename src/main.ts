import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { PiniaVuePlugin, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import AxiosConfig from '@/configuration/axios-config';
import { chartJsSetup } from '@/configuration/chartjs';
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import Tooltip from 'primevue/tooltip';
import BasicAAB from './styles/preset';

import './styles/main.css';

const AABPreset = definePreset(Aura, BasicAAB);

const app = createApp(App);
app.use(PiniaVuePlugin);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: AABPreset,
    options: {
      darkModeSelector: '.dark',
      cssLayer: {
        name: 'primevue',
        order: 'base, primevue',
      },
    },
  },
});

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
