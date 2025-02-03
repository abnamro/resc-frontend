import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/views/metrics/RuleMetrics.vue';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import rule_tags from '@/../tests/resources/mock_rule_tags.json';
import rules_with_findings_status_count from '@/../tests/resources/mock_rules_with_findings_status_count.json';
import flushPromises from 'flush-promises';
import SorterBtn from '@/components/Common/SorterBtn.vue';
import { createTestingPinia } from '@pinia/testing';

vi.mock('axios');
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
      push: () => {},
    })),
  };
});

describe('RuleMetrics tests', () => {
  it('Given a RuleMetrics When props are passed then RuleMetrics will be displayed', async () => {
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    axios.get.mockResolvedValueOnce(rule_tags);
    axios.get.mockResolvedValueOnce({ data: rules_with_findings_status_count });
    const wrapper = mount(App, {
      components: {
        SorterBtn,
      },
      global: {
        stubs: {
          HealthBar: true,
          RulePackFilter: true,
          RuleTagsFilter: true,
          'router-view': true,
        },
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: null,
                accessToken: '12345',
                destinationRoute: 'resc',
                firstName: 'user',
                lastName: 'test',
                email: 'testuser@test.com',
              },
            },
          }),
        ],
      },
    });
    expect(wrapper.exists()).toBe(true);
    await flushPromises();
    expect(wrapper.vm.ruleList.length > 0).toBe(true);
    wrapper.vm.goToRuleAnalysisPage(0);
  });

  it('Given a RuleMetrics When props are passed then RuleMetrics will be displayed', () => {
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    axios.get.mockResolvedValueOnce(rule_tags);
    axios.get.mockResolvedValueOnce({ data: rules_with_findings_status_count });

    const wrapper = mount(App, {
      props: {
        rulePackVersion: [{ version: '0.0.6', active: true, created: 'today' }],
      },
      components: {
        SorterBtn,
      },
      global: {
        stubs: {
          HealthBar: true,
          RulePackFilter: true,
          RuleTagsFilter: true,
          'router-view': true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    axios.get.mockResolvedValueOnce(rule_tags);
    axios.get.mockResolvedValueOnce({ data: rules_with_findings_status_count });
    wrapper.vm.onRulePackVersionChange(['0.0.5']);

    axios.get.mockResolvedValueOnce({ data: rules_with_findings_status_count });
    wrapper.vm.onRuleTagsFilterChange(['Info']);
  });
});
