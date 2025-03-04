import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import App from '@/views/AuditView.vue';
import repositories from '@/../tests/resources/mock_repositories.json';
import vcs_providers from '@/../tests/resources/mock_vcs_providers.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings.json';
import FindingStatusBadge from '@/components/Common/FindingStatusBadge.vue';
import RepositoryPanel from '@/components/ScanFindings/RepositoryPanel.vue';
import ScanFindingsService from '@/services/scan-findings-service';
import ScanTypeBadge from '@/components/Common/ScanTypeBadge.vue';
import data from '@/../tests/resources/mock_audits_response.json'
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

importFA();
const tooltip = vi.fn();

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

describe('AuditView tests', () => {
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

  let wrapper;

  const scan = {
    scan_type: 'BASE',
    last_scanned_commit: '1fb42a9ee177ed8141a4ab162a3e33952a4cf6c0',
    timestamp: '2023-05-23T15:52:22.270000',
    increment_number: 0,
    rule_pack: '1.0.0',
    repository_id: 1,
    id_: 1,
  };

  function initMountApp() {
    wrapper = mount(App, {
      components: {
        // FindingStatusBadge,
        // RepositoryPanel,
        // ScanFindingsService,
        // ScanTypeBadge,
        // FontAwesomeIcon,
      },
      global: {
        plugins: [
        //   createTestingPinia({
        //     initialState: {
        //       authUser: {
        //         idToken: null,
        //         accessToken: '12345',
        //         destinationRoute: 'resc',
        //         firstName: 'user',
        //         lastName: 'test',
        //         email: 'testuser@test.com',
        //         findingStatusList: [
        //           'NOT_ANALYZED',
        //           'NOT_ACCESSIBLE',
        //           'CLARIFICATION_REQUIRED',
        //           'FALSE_POSITIVE',
        //           'TRUE_POSITIVE',
        //           'OUTDATED',
        //         ],
        //         selectedStatus: [],
        //       },
        //     },
        //   }),
        ],
        directives: { tooltip },
        stubs: {
          AuditModal: true,
        //   ScanFindingsFilter: true,
        //   RepositoriesPageFilter: true,
        //   FindingPanel: true,
        },
      },
    });
  }

  afterEach(() => {
    axios.get.mockReset();
    vi.restoreAllMocks();
  });

  it('Given a AuditView then AuditView will be displayed', async () => {

    const spy = vi.spyOn(axios, 'get');
    spy.mockImplementation((q) => {
      switch (q) {
        case 'audits':
            return data;
        // case '/findings/supported-statuses/':
        //   return {
        //     data: [
        //       'NOT_ANALYZED',
        //       'NOT_ACCESSIBLE',
        //       'CLARIFICATION_REQUIRED',
        //       'FALSE_POSITIVE',
        //       'TRUE_POSITIVE',
        //       'OUTDATED',
        //     ],
        //   };
        // case '/supported-vcs-providers':
        //   return { data: ['AZURE_DEVOPS', 'BITBUCKET', 'GITHUB_PUBLIC'] };
        // case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC':
        //   return { data: rules };
        // case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC&rule_pack_version=0.0.0':
        //   return { data: rules };
        // case '/rule-packs/tags?version=0.0.0':
        //   return { data: [] };
        // case '/detected-rules?vcs_provider=AZURE_DEVOPS&project_name=ABC&repository_name=Repo1&rule_pack_version=0.0.0':
        //   return { data: rules };
        default:
          console.log(q);
      }
    });

    initMountApp();
    expect(wrapper.exists()).toBe(true);
    await flushPromises();

    expect(() => wrapper.vm.selectDown()).not.toThrow();
    expect(() => wrapper.vm.sendUpdate(['123456'], 'FALSE_POSITIVE'));
    expect(wrapper.vm.selectedIndex).toBe(0);
    // expect(() => wrapper.vm.onPreviousScanChecked(true)).not.toThrow();

    // axios.get.mockResolvedValueOnce({ data: detailed_findings });
    // expect(() => wrapper.vm.displayPreviousScans([], [], [])).not.toThrow();
    // expect(() => wrapper.vm.onPreviousScanChecked(false)).not.toThrow();

    // axios.get.mockResolvedValueOnce({ data: scan });
    // axios.get.mockResolvedValueOnce({ data: detailed_findings });
    // expect(() => wrapper.vm.handlePageSizeChange(10)).not.toThrow();

    // axios.get.mockResolvedValueOnce({ data: scan });
    // axios.get.mockResolvedValueOnce({ data: detailed_findings });
    // expect(() => wrapper.vm.handlePageClick(1)).not.toThrow();

    // axios.get.mockResolvedValueOnce({ data: scan });
    // axios.get.mockResolvedValueOnce({ data: detailed_findings });
    // expect(() => wrapper.vm.handleFilterChange(1, ['rule1'], [])).not.toThrow();

    // axios.get.mockResolvedValueOnce({ data: scan });
    // axios.get.mockResolvedValueOnce({ data: detailed_findings });
  });
});
