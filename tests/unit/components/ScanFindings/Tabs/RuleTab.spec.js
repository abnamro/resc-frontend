import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/ScanFindings/Tabs/RuleTab.vue';
import rule from '@/../tests/resources/mock_rule.json';

vi.mock('axios');

describe('Rule Tab', () => {
  it('Display an Audit in the History tab', async () => {
    // Mock axios response
    axios.get.mockResolvedValueOnce(rule);

    const wrapper = mount(App, {
      props: {
        ruleName: 'rule_1',
        rulePack: 'rule_pack_1',
      },
      components: {},
    });

    expect(wrapper.vm.loadedData).toBe(false);

    expect(() => wrapper.vm.fetchRuleForRulePack()).not.toThrow();
  });
});
