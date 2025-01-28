import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Filters/FindingStatusFilter.vue';
import mock_statuses from '@/../tests/resources/mock_status.json';
import { createTestingPinia } from '@pinia/testing';
import MultiSelect from 'primevue/multiselect';
import flushPromises from 'flush-promises';

vi.mock('axios');

describe('FindingStatusFilter tests', () => {
  it('Given a FindingStatusFilter then FindingStatusFilter will be displayed', async () => {
    axios.get.mockResolvedValueOnce(mock_statuses);

    const wrapper = mount(App, {
      props: {},
      components: {
        MultiSelect,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              findingStatusList: [
                'NOT_ANALYZED',
                'NOT_ACCESSIBLE',
                'CLARIFICATION_REQUIRED',
                'FALSE_POSITIVE',
                'TRUE_POSITIVE',
                'OUTDATED',
              ],
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(MultiSelect).exists()).toBe(true);
    expect(() => wrapper.vm.onStatusFilterChange()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-findings-status-change');

    await flushPromises();

    wrapper.setProps({
      statusOptions: [
        'NOT_ANALYZED',
        'NOT_ACCESSIBLE',
        'CLARIFICATION_REQUIRED',
        'FALSE_POSITIVE',
        'TRUE_POSITIVE',
        'OUTDATED',
      ],
    });
  });
});
