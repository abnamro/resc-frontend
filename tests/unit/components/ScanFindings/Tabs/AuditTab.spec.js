import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/ScanFindings/Tabs/AuditTab.vue';
import status from '@/../tests/resources/mock_status.json';
import findings from '@/../tests/resources/mock_findings.json';
import { createTestingPinia } from '@pinia/testing';

vi.mock('axios');

describe('Audit Tab', () => {
  it('display an audit', async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce(status);
    axios.post.mockResolvedValueOnce({});

    const wrapper = mount(App, {
      props: {
        finding: findings.data[0],
      },
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              findingStatusList: [],
            },
          }),
        ],
      },
    });

    expect(wrapper.vm.loadedData).toBe(true);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loadedData).toBe(true);
    expect(wrapper.vm.isStatusValid).toBe(true);
    expect(wrapper.vm.isCommentValid).toBe(true);
    expect(() => wrapper.vm.onReset(new Event('reset'))).not.toThrow();
    expect(() => wrapper.vm.onSubmit(new Event('submit'))).not.toThrow();
  });
});
