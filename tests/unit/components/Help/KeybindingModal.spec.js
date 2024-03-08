import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Help/KeybindingModal.vue';
import { BTab, BBadge, BTable, BButton } from 'bootstrap-vue-next';

describe('Keybinding Modal', () => {
  it('show helper', async () => {
    const wrapper = mount(App, {
      props: {
        selectedCheckBoxIds: [1, 2, 3, 4, 5],
      },
      components: {
        BTab,
        BTable,
        BBadge,
        BButton,
      },
    });

    expect(() => wrapper.vm.show()).not.toThrow();
    expect(() => wrapper.vm.hide()).not.toThrow();
  });
});
