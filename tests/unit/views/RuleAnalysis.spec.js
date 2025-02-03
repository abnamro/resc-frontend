import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/views/RuleAnalysis.vue';
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings.json';
import rule_tags from '@/../tests/resources/mock_rule_tags.json';

let allProjects = ['ABC', 'XYZ', 'GRD0000001', 'GRD0000002'];
let allRepos = ['bb_repo1', 'bb_repo2', 'ado_repo1', 'ado_repo2'];

importFA();

vi.mock('axios');

describe('RuleAnalysis tests', () => {
  it('Given a RuleAnalysis then RuleAnalysis will be displayed', () => {
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
        case 'rule-packs/versions':
          return { data: rule_packs };
        case '/repositories/distinct-projects/?only_if_has_findings=true':
          return { data: allProjects };
        case '/repositories/distinct-repositories/?only_if_has_findings=true':
          return { data: allRepos };
        case '/detailed-findings':
          return { data: detailed_findings };
        default:
          console.log(q);
      }
    });

    const wrapper = shallowMount(App, {
      components: {
        FontAwesomeIcon,
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          AuditModal: true,
          RuleAnalysisFilter: true,
          RepositoriesPageFilter: true,
          FindingPanel: true,
          FindingStatusBadge: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.currentPage).toBe(0);

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.handlePageSizeChange(10)).not.toThrow();
    expect(wrapper.vm.currentPage).toBe(0);

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.handlePageClick(50)).not.toThrow();
    expect(wrapper.vm.currentPage).toBe(50);

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.fetchPaginatedDetailedFindings()).not.toThrow();
  });

  it('Given a RuleAnalysis then RuleAnalysis will be displayed', () => {
    const spy = vi.spyOn(axios, 'get');
    spy.mockImplementation((q) => {
      switch (q) {
        case 'rule-packs/versions':
          return { data: rule_packs };
        case '/rule-packs/tags?version=0.0.6&version=null&version=null&version=null&version=null&version=null':
          return rule_tags;
        case '/repositories/distinct-projects/?only_if_has_findings=true':
          return { data: allProjects };
        case '/repositories/distinct-repositories/?only_if_has_findings=true':
          return { data: allRepos };
        case '/detailed-findings':
          return { data: detailed_findings };
        default:
          console.log(q);
      }
    });

    const wrapper = shallowMount(App, {
      components: {
        FontAwesomeIcon,
      },
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: '12345',
                accessToken: '12345',
                firstName: 'user',
                lastName: 'test',
                email: 'testuser@test.com',
                sourceRoute: '/metrics/rule-metrics',
                destinationRoute: '/rule-analysis',
                previousRouteState: { rulePackVersions: '0.0.1' },
                findingStatusList: [
                  'NOT_ANALYZED',
                  'NOT_ACCESSIBLE',
                  'CLARIFICATION_REQUIRED',
                  'FALSE_POSITIVE',
                  'TRUE_POSITIVE',
                  'OUTDATED',
                ],
                selectedStatus: [{ value: 'TRUE_POSITIVE' }],
              },
            },
          }),
        ],
        stubs: {
          AuditModal: true,
          RuleAnalysisFilter: true,
          RepositoriesPageFilter: true,
          FindingPanel: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() =>
      wrapper.vm.handleFilterChange({ findingStatus: [{ status: 'TRUE_POSITIVE' }] }),
    ).not.toThrow();
  });
});
