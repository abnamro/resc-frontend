import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import App from '@/views/ErrorView.vue';

describe('ErrorView tests', () => {
  let wrapper;

  function initMountApp() {
    wrapper = mount(App, {
      global: {
        plugins: [PrimeVue, ToastService],
      },
    });
  }

  it('Given a ErrorView then ErrorView will be displayed', () => {
    initMountApp();
    expect(wrapper.exists()).toBe(true);
  });
});
