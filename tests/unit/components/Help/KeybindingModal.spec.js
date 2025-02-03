import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Help/KeybindingModal.vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Chip from 'primevue/chip';

describe('Keybinding Modal', () => {
  it('show helper', async () => {
    const wrapper = mount(App, {
      props: {
        visible: true,
      },
      components: {
        Dialog,
        Button,
        DataTable,
        Column,
        Chip,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.visible).toBe(true);
  });
});
