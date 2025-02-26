import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import App from '@/components/ScanFindings/Tabs/AuditTab.vue';
import status from '@/../tests/resources/mock_status.json';
import findings from '@/../tests/resources/mock_findings.json';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

vi.mock('axios');

describe('Audit Tab', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
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
  });

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
    await flushPromises();
    expect(wrapper.vm.loadedData).toBe(true);
    expect(wrapper.vm.isStatusValid).toBe(true);
    expect(wrapper.vm.isCommentValid).toBe(true);
    expect(() => wrapper.vm.onSubmit(new Event('submit'))).not.toThrow();
  });
});
