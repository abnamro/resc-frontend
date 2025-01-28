import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/ScanFindings/Tabs/HistoryTab.vue';
import audits from '@/../tests/resources/mock_finding_audits.json';
import findings from '@/../tests/resources/mock_findings.json';

vi.mock('axios');
const tooltip = vi.fn();

describe('History Tab', () => {
  it('Display an Audit in the History tab', async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce({ data: audits });

    const wrapper = mount(App, {
      props: {
        finding: findings.data[0],
      },
      components: {},
      global: {
        directives: { tooltip },
      },
    });

    expect(() => wrapper.vm.fetchAuditsForFinding()).not.toThrow();
  });
});
