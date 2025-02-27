import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import App from '@/components/Filters/ScanFindingsFilter.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import scans_for_a_repository from '@/../tests/resources/mock_scans_for_a_repository.json';
import mock_statuses from '@/../tests/resources/mock_status.json';
import rule_tags from '@/../tests/resources/mock_rule_tags.json';
import RuleTagsFilter from '@/components/Filters/RuleTagsFilter.vue';
import RuleFilter from '@/components/Filters/RuleFilter.vue';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

vi.mock('axios');
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn(() => {
      return { params: { scanId: 2 } };
    }),
    useRouter: vi.fn(() => ({
      push: () => {},
    })),
  };
});
const mock_rules = [
  'Azure-Token',
  'Environment-configuration-file',
  'File-extensions-with-keys-and-credentials',
];

const repository = {
  project_key: 'RESC',
  repository_id: '1',
  repository_name: 'test-repo1',
  repository_url: 'https://dev.azure.com/org1/xyz/_git/test-repo1',
  vcs_provider: 'AZURE_DEVOPS',
  last_scan_id: 1,
  last_scan_timestamp: '2023-05-23T15:52:22.270000',
  true_positive: 1,
  false_positive: 2,
  not_analyzed: 3,
  not_accessible: 4,
  clarification_required: 5,
  outdated: 0,
  total_findings_count: 15,
  id_: 1,
};

const components = {
  FontAwesomeIcon,
  RuleTagsFilter,
  RuleFilter,
};

describe('ScanFindingsFilter tests', () => {
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

  afterAll(() => {
    axios.mockRestore();
  });

  afterEach(() => {
    axios.mockReset();
  });

  it('Given a ScanFindingsFilter with toggledPreviousScans When props are passed then ScanFindingsFilter will be displayed', () => {
    axios.get.mockResolvedValueOnce(mock_statuses);

    const wrapper = mount(App, {
      props: {
        repository,
        includePreviousScans: true,
      },
      components,
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

    expect(wrapper.exists()).toBe(true);
  });

  it('Given a ScanFindingsFilter with toggledPreviousScans When props are passed and toggle some actions then ScanFindingsFilter will be displayed', async () => {
    axios.get.mockResolvedValueOnce(mock_statuses);

    const wrapper = mount(App, {
      props: {
        repository,
        includePreviousScans: true,
      },
      components,
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

    expect(wrapper.exists()).toBe(true);
    axios.get.mockResolvedValueOnce({ data: scans_for_a_repository });
    expect(() => wrapper.vm.fetchScanDates()).not.toThrow();
    await flushPromises();
    expect(wrapper.vm.selectedScan).not.toBe(null);

    axios.get.mockResolvedValueOnce(rule_tags);
    expect(() => wrapper.vm.handleToggleButtonClick()).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: mock_rules });
    expect(() => wrapper.vm.handleRuleFilterChange(['Azure-Token'])).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('previous-scans-checked');
    expect(wrapper.emitted()).toHaveProperty('include-previous-scans');
    expect(wrapper.emitted()['previous-scans-checked'].length).toBe(1);
    expect(wrapper.emitted()['include-previous-scans'].length).toBe(1);

    axios.get.mockResolvedValueOnce({ data: mock_rules });
    expect(() => wrapper.vm.handleRuleTagsFilterChange(['Info'])).not.toThrow();
    expect(wrapper.emitted()['previous-scans-checked'].length).toBe(2);
    expect(wrapper.emitted()['include-previous-scans'].length).toBe(2);

    axios.get.mockResolvedValueOnce({ data: mock_rules });
    axios.get.mockResolvedValueOnce({ data: mock_rules });
    axios.get.mockResolvedValueOnce(rule_tags);
    expect(() => wrapper.vm.handleScanDateFilterChange()).not.toThrow();
  });

  it('Given a ScanFindingsFilter When props are passed then ScanFindingsFilter will be displayed', async () => {
    axios.get.mockResolvedValueOnce(mock_statuses);

    const wrapper = mount(App, {
      props: {
        repository,
      },
      components,
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

    expect(wrapper.exists()).toBe(true);
    axios.get.mockResolvedValueOnce({ data: scans_for_a_repository });
    axios.get.mockResolvedValueOnce({ data: mock_rules });
    axios.get.mockResolvedValueOnce(rule_tags);

    expect(() => wrapper.vm.fetchScanDates()).not.toThrow();
    await flushPromises();
    expect(wrapper.vm.selectedScan).not.toBe(null);

    axios.get.mockResolvedValueOnce(rule_tags);
    expect(() => wrapper.vm.handleToggleButtonClick()).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: mock_rules });
    expect(() => wrapper.vm.togglePreviousScans()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('previous-scans-checked');
    expect(wrapper.emitted()).toHaveProperty('on-filter-change');
    expect(wrapper.emitted()['previous-scans-checked'].length).toBe(1);
    expect(wrapper.emitted()['on-filter-change'].length).toBe(2);
  });
});
