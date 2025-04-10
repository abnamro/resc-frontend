import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import App from '@/views/ScanFindings.vue';
import repositories from '@/../tests/resources/mock_repositories.json';
import vcs_providers from '@/../tests/resources/mock_vcs_providers.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings.json';
import FindingStatusBadge from '@/components/Common/FindingStatusBadge.vue';
import RepositoryPanel from '@/components/ScanFindings/RepositoryPanel.vue';
import ScanFindingsService from '@/services/scan-findings-service';
import ScanTypeBadge from '@/components/Common/ScanTypeBadge.vue';
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';

importFA();

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

describe('ScanFindings tests', () => {
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
      props: {
        scanId: '1',
      },
      components: {
        FindingStatusBadge,
        RepositoryPanel,
        ScanFindingsService,
        ScanTypeBadge,
        FontAwesomeIcon,
      },
      global: {
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
                findingStatusList: [
                  'NOT_ANALYZED',
                  'NOT_ACCESSIBLE',
                  'CLARIFICATION_REQUIRED',
                  'FALSE_POSITIVE',
                  'TRUE_POSITIVE',
                  'OUTDATED',
                ],
                selectedStatus: [],
              },
            },
          }),
        ],
        stubs: {
          AuditModal: true,
          ScanFindingsFilter: true,
          RepositoriesPageFilter: true,
          FindingPanel: true,
        },
      },
    });
  }

  it('Given a ScanFindings then ScanFindings will be displayed', () => {
    axios.get.mockResolvedValueOnce({ data: scan });
    axios.get.mockResolvedValueOnce({ data: repositories });
    axios.get.mockResolvedValueOnce(vcs_providers);

    initMountApp();
    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onPreviousScanChecked(true)).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.displayPreviousScans([], [], [])).not.toThrow();
    expect(() => wrapper.vm.onPreviousScanChecked(false)).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: scan });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.handlePageSizeChange(10)).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: scan });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.handlePageClick(1)).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: scan });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.handleFilterChange(1, ['rule1'], [])).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: scan });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });
  });
});
