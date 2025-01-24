import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import App from '@/components/Help/KeybindingModal.vue';

describe('Keybinding Modal', () => {
  it('show helper', async () => {
    const wrapper = mount(App, {
      props: {
        selectedCheckBoxIds: [1, 2, 3, 4, 5],
      },
      components: {},
    });
    expect(wrapper.exists()).toBe(true);
  });
});
