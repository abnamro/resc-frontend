import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/ScanFindings/AuditModal.vue';
import status from '@/../tests/resources/mock_status.json';
import { createTestingPinia } from '@pinia/testing';

vi.mock('axios');

describe('Audit Modal', () => {
  it('fetch a audit', async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce(status);
    axios.post.mockResolvedValueOnce({});

    const wrapper = mount(App, {
      props: {
        selectedCheckBoxIds: [1, 2, 3, 4, 5],
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

    expect(wrapper.vm.isStatusValid).toBe(true);
    expect(wrapper.vm.isCommentValid).toBe(true);
    expect(() => wrapper.vm.resetModal()).not.toThrow();
    expect(() => wrapper.vm.handleOk(new MouseEvent('click'))).not.toThrow();
  });
});
