import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Filters/RulePackFilter.vue';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import { createTestingPinia } from '@pinia/testing';

const rule_pack_selected = [
  {
    version: '0.0.6',
    active: true,
    global_allow_list: 76,
  },
];

describe('RulePackFilter tests', () => {
  it('Given a RulePackFilter When props are passed then RulePackFilter will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        rulePackSelected: rule_pack_selected,
        rulePackOptions: rule_packs.data,
      },
      components: {},
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onRulePackVersionFilterChange()).not.toThrow();
  });

  it('Given a RulePackFilter When props are passed then RulePackFilter will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        rulePackSelected: [],
        rulePackOptions: rule_packs.data,
      },
      components: {},
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onRulePackVersionFilterChange()).not.toThrow();
  });

  it('Given a RulePackFilter When props are passed then RulePackFilter will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        rulePackSelected: rule_pack_selected,
        rulePackOptions: rule_packs.data,
      },
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: null,
                accessToken: '12345',
                firstName: 'user',
                lastName: 'test',
                email: 'testuser@test.com',
                sourceRoute: '/metrics/rule-metrics',
                destinationRoute: '/rule-analysis',
                previousRouteState: 'something',
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onRulePackVersionFilterChange()).not.toThrow();
  });
});
