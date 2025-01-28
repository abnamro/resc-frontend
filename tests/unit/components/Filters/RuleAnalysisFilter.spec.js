import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Filters/RuleAnalysisFilter.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';
import rules from '@/../tests/resources/mock_rules.json';
import axios from 'axios';
import flushPromises from 'flush-promises';

vi.mock('axios');

describe('RuleAnalysisFilter tests', () => {
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

  function initMount() {
    return mount(App, {
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
    axios.get.mockReset();
    vi.restoreAllMocks();
  });

  it('Given a RuleAnalysisFilter a RuleAnalysisFilter is displayed', async () => {
    const spy = vi.spyOn(axios, 'get');
    spy.mockImplementation((q) => {
      switch (q) {
        case '/findings/supported-statuses/':
          return {
            data: [
              'NOT_ANALYZED',
              'NOT_ACCESSIBLE',
              'CLARIFICATION_REQUIRED',
              'FALSE_POSITIVE',
              'TRUE_POSITIVE',
              'OUTDATED',
            ],
          };
        case '/supported-vcs-providers':
          return { data: ['AZURE_DEVOPS', 'BITBUCKET', 'GITHUB_PUBLIC'] };
        case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC':
          return { data: rules };
        case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC&rule_pack_version=0.0.0':
          return { data: rules };
        case '/rule-packs/tags?version=0.0.0':
          return { data: [] };
        case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC&repository_name=Repo1&rule_pack_version=0.0.0':
          return { data: rules };
        default:
          console.log(q);
      }
    });

    const wrapper = initMount();
    expect(wrapper.exists()).toBe(true);

    expect(wrapper.vm.advancedSearchVisible).toBe(false);
    wrapper.vm.toggleAdvancedSearch();
    expect(wrapper.vm.advancedSearchVisible).toBe(true);
    await flushPromises();

    axios.get.mockResolvedValueOnce({ data: rules });
    expect(() => wrapper.vm.onVcsProviderChange(['AZURE_DEVOPS'])).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onProjectChange('ABC')).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onRulePackVersionChange(['0.0.0'])).not.toThrowError();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onRepositoryChange('Repo1')).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onFindingsStatusChange()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onRuleChange(['Rule-1'])).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');

    expect(() => wrapper.vm.onStartDateChange()).not.toThrow();
    expect(() => wrapper.vm.onEndDateChange()).not.toThrow();
    expect(() => wrapper.vm.onRuleTagsChange(['cli'])).not.toThrow();
  });
});
