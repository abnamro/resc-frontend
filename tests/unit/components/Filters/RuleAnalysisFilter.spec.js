import { shallowMount } from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Filters/RuleAnalysisFilter.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';
import rules from '@/../tests/resources/mock_rules.json';
import rule_tags from '@/../tests/resources/mock_rule_tags.json';
import axios from 'axios';

vi.mock('axios');

describe('RuleAnalysisFilter tests', () => {
  let mock;

  function initMount() {
    return shallowMount(App, {
      props: {
        projectOptions: [],
        repositoryOptions: [],
        rulePackOptions: [],
        ruleTagOptions: [],
      },
      components: {
        FontAwesomeIcon: FontAwesomeIcon,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              authUser: {
                idToken: '12345',
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
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // it('Given a RuleAnalysisFilter then RuleAnalysisFilter will be displayed', () => {

  //   vi.mock('axios');
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });
  //   // vi.spyOn(axios, 'get');

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);
  //   expect(() => wrapper.vm.toggleAdvancedSearch()).not.toThrow();
  //   expect(wrapper.vm.advancedSearchVisible).toBe(true);
  //   axios.get.mockReset();
  // });
 
  it('Given a RuleAnalysisFilter When updating VCS filters then on-filter-change is emitted', () => {
    let mock = new MockAdapter(axios);
    mock.onGet(/^\/resc\/v1\/detected-rules.*/).reply(200, rules)
    mock.onGet(/^\/resc\/v1\/rule-packs\/tags.*/).reply(200, rule_tags)

    const wrapper = initMount();
    expect(wrapper.exists()).toBe(true);

    axios.get.mockResolvedValueOnce({ data: rules });
    expect(() => wrapper.vm.onVcsProviderChange(['AZURE_DEVOPS'])).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    axios.get.mockReset();
  });

  // it('Given a RuleAnalysisFilter When updating Project filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   expect(() => wrapper.vm.onProjectChange('ABC')).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When updating Repo filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   expect(() => wrapper.vm.onRepositoryChange('Repo1')).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When updating FindingStatus filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   expect(() => wrapper.vm.onFindingsStatusChange(['NOT_ANALYZED'])).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When updating Rule filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);
  //   expect(() => wrapper.vm.onRuleChange(['Rule-1'])).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When updating RuleTag filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);
  //   expect(() => wrapper.vm.onRuleTagsChange(['Info'])).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When updating RulePack filters then on-filter-change is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });
  //   expect(() => wrapper.vm.onRulePackVersionChange(['0.0.5'])).not.toThrow();
  //   expect(wrapper.emitted()).toHaveProperty('on-filter-change');
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When onStartDateChange then on-filter-change  is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });
  //   expect(() => wrapper.vm.onStartDateChange()).not.toThrow();
  //   axios.get.mockReset();
  // });

  // it('Given a RuleAnalysisFilter When onEndDateChange then on-filter-change  is emitted', () => {
  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });

  //   const wrapper = initMount();
  //   expect(wrapper.exists()).toBe(true);

  //   axios.get.mockResolvedValueOnce({ data: rules });
  //   axios.get.mockResolvedValueOnce({ rule_tags });
  //   expect(() => wrapper.vm.onEndDateChange()).not.toThrow();
  //   axios.get.mockReset();
  // });
});
