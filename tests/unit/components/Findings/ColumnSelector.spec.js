import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import App from '@/components/Findings/ColumnSelector.vue';
import { importFA } from '@/assets/font-awesome';

importFA();

vi.mock('axios');

describe('ColumnSelector tests', () => {
  it('Given a ColumnSelector with PreSelection then ColumnSelector will be displayed', () => {
    const wrapper = mount(App, {
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              authUser: {
                tableColumns: ['file_path'],
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.reset_if_empty()).not.toThrow();
    expect(() => wrapper.vm.updateColumns()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('update-columns');
    expect(wrapper.emitted()['update-columns']).toStrictEqual([[]]);
  });

  it('Given a ColumnSelector without PreSelection then ColumnSelector will be displayed', () => {
    const wrapper = mount(App, {
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              authUser: {
                tableColumns: [],
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.reset_if_empty()).not.toThrow();
    expect(() => wrapper.vm.updateColumns()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('update-columns');
    expect(wrapper.emitted()['update-columns']).toStrictEqual([[]]);
  });
});
