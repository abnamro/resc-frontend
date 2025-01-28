import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { Collapse } from 'vue-collapsed';
import App from '@/views/ErrorView.vue';
import Button from 'primevue/button';
import flushPromises from 'flush-promises';

describe('ErrorView tests', () => {
  let wrapper;

  function initMountApp() {
    wrapper = mount(App, {
      components: {
        Collapse,
        Button,
      },
      global: {
        plugins: [PrimeVue, ToastService],
      },
    });
  }

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  })

  it('Given a ErrorView then ErrorView will be displayed', async () => {
    initMountApp();
    expect(wrapper.exists()).toBe(true);

    expect(wrapper.vm.isOpen).toBe(false);
    wrapper.vm.openOrToast();
    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.vm.errors).toStrictEqual([]);
    wrapper.vm.errorHandler({ details: 'with details' });
    expect(wrapper.vm.errors).toStrictEqual([ { details: 'with details' } ]);
    wrapper.vm.errorHandler({ detail: { foo: 'bar' }});
    expect(wrapper.vm.errors).toStrictEqual([ { details: 'with details' }, {foo: 'bar'} ]);
    wrapper.vm.errorHandler({ detail: { axios: { fizz: 'fizz' } }});
    expect(wrapper.vm.errors).toStrictEqual([ { details: 'with details' }, {foo: 'bar'}, { fizz: 'fizz' } ]);
    wrapper.vm.errorHandler({ detail: { response: { data: 'data' } }});
    expect(wrapper.vm.errors).toStrictEqual([ { details: 'with details' }, {foo: 'bar'}, { fizz: 'fizz' }, { data: 'data' } ]);
    wrapper.vm.openOrToast();
    expect(wrapper.vm.isOpen).toBe(true);
    await flushPromises()
    expect(wrapper.find('.pi-exclamation-triangle').exists()).toBe(true);
    wrapper.get('.pi-exclamation-triangle').trigger('click');
    await flushPromises()
    expect(wrapper.vm.isOpen).toBe(false);
  });
});
