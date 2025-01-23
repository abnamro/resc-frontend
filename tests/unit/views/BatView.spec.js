import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/views/BatView.vue';

describe('BatView tests', () => {
  let wrapper;

  function initMountApp() {
    wrapper = shallowMount(App);
  }

  it('Given a BatView then BatView will be displayed', () => {
    initMountApp();
    expect(wrapper.exists()).toBe(true);
  });
});
