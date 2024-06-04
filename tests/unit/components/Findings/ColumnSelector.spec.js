import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import App from '@/components/Findings/ColumnSelector.vue';
import { importFA } from '@/assets/font-awesome';
import bootstrapVue from 'bootstrap-vue-next';

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
          bootstrapVue({ plugins: { modalController: true } }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.loadModal()).not.toThrow();
    expect(() => wrapper.vm.show()).not.toThrow();
    expect(() => wrapper.vm.hide()).not.toThrow();
    expect(() => wrapper.vm.updateColumns()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('update-columns');
    expect(wrapper.emitted()['update-columns']).toStrictEqual([[['file_path']]]);
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
          bootstrapVue({ plugins: { modalController: true } }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.loadModal()).not.toThrow();
    expect(() => wrapper.vm.show()).not.toThrow();
    expect(() => wrapper.vm.hide()).not.toThrow();
    expect(() => wrapper.vm.updateColumns()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('update-columns');
    expect(wrapper.emitted()['update-columns']).toStrictEqual([
      [['project_key', 'repository_name', 'rule_name', 'file_path', 'line_number']],
    ]);
  });
});
