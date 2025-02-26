import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import App from '@/components/Findings/FindingsTable.vue';
import { importFA } from '@/assets/font-awesome';
import rules from '@/../tests/resources/mock_rules.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings2.json';
import flushPromises from 'flush-promises';
import FindingTableHeader from '@/components/Findings/FindingTableHeader.vue';
import Panel from 'primevue/panel';

importFA();

const tooltip = vi.fn();

vi.mock('axios');

describe('FindingsTable tests', () => {
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

  it('Given a FindingsTable without data then FindingsTable will not be displayed', async () => {
    const wrapper = mount(App, {
      props: {
        findings: undefined,
        isRuleFinding: true,
      },
      components: {
        FindingTableHeader,
        Panel,
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {},
        directives: {
          tooltip,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.filteredList).toBe(undefined);

    expect(wrapper.vm.toggleAllCheckboxes()).toBe(undefined);
    expect(wrapper.vm.updateVisualBadge()).toBe(undefined);
    expect(() => wrapper.vm.getCurrentFindingSelected()).toThrowError();
    expect(wrapper.vm.selectDown()).toBe(false);
    expect(wrapper.vm.selectUp()).toBe(false);
  });

  it('Given a FindingsTable in rule findings then FindingsTable will be displayed', async () => {
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
        case 'findings/1/audit':
          return {
            data: {},
          };

        case '/rule-packs/0.0.0/rules?rule_name=Hardcoded-Username':
          return { data: rules };
        default:
          console.log(q);
      }
    });

    const wrapper = mount(App, {
      props: {
        findings: detailed_findings.data,
        isRuleFinding: true,
      },
      components: {
        FindingTableHeader,
        Panel,
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {},
        directives: {
          tooltip,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.findingList).toEqual(detailed_findings.data);
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(wrapper.vm.selection).toEqual([
      detailed_findings.data[0].id_,
      detailed_findings.data[1].id_,
    ]);

    expect(() =>
      wrapper.vm.updateVisualBadge(
        [detailed_findings.data[0].id_, detailed_findings.data[1].id_],
        'TRUE_POSITIVE',
        '',
      ),
    ).not.toThrow();
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(() =>
      wrapper.vm.updateVisualBadge([detailed_findings.data[0].id_], 'FALSE_POSITIVE', ''),
    ).not.toThrow();
    expect(() =>
      wrapper.vm.updateVisualBadge([detailed_findings.data[0].id_], 'NOT_ACCESSIBLE', ''),
    ).not.toThrow();

    expect(wrapper.vm.selectedIndex).toEqual(0);
    expect(() => wrapper.vm.selectDown()).not.toThrow();
    expect(wrapper.vm.selectedIndex).toEqual(1);
    expect(() => wrapper.vm.selectUp()).not.toThrow();
    expect(wrapper.vm.selectedIndex).toEqual(0);

    expect(() => wrapper.vm.openDetails()).not.toThrow();
    expect(() => wrapper.vm.openCommitUrl()).not.toThrow();
    await flushPromises();
    expect(() => wrapper.vm.closeDetails()).not.toThrow();
    expect(() => wrapper.vm.toggleSelect()).not.toThrow();
    expect(() => wrapper.vm.markAsFalsePositive()).not.toThrow();
    expect(() => wrapper.vm.markAsTruePositive()).not.toThrow();
    expect(() => wrapper.vm.markAsGone()).not.toThrow();
    expect(() => wrapper.vm.markAllAsFalsePositive()).not.toThrow();
    expect(() => wrapper.vm.markAllAsTruePositive()).not.toThrow();
    expect(() => wrapper.vm.markAllAsGone()).not.toThrow();
    expect(() => wrapper.vm.auditThis()).not.toThrow();

    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(() => wrapper.vm.markAsFalsePositive()).not.toThrow();
    expect(() => wrapper.vm.markAsTruePositive()).not.toThrow();
    expect(() => wrapper.vm.markAsGone()).not.toThrow();
    expect(() => wrapper.vm.markAllAsFalsePositive()).not.toThrow();
    expect(() => wrapper.vm.markAllAsTruePositive()).not.toThrow();
    expect(() => wrapper.vm.markAllAsGone()).not.toThrow();
    expect(() => wrapper.vm.auditThis()).not.toThrow();

    expect(() => wrapper.find('#filterFiles').setValue('file1')).not.toThrow();
    await flushPromises();
    expect(() => wrapper.find('#filterFiles').setValue('fi*')).not.toThrow();
    await flushPromises();
    expect(() => wrapper.find('#filterFiles').setValue('*e1')).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.updateAudit('NOT_ANALYZED', 'Rien a declarer')).not.toThrow();
  });

  it('Given a FindingsTable in repository then FindingsTable will be displayed', () => {
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
        case 'findings/1/audit':
          return {
            data: {
              data: [],
              total: 0,
              skip: 0,
              limit: 0,
            },
          };

        case '/rule-packs/0.0.0/rules?rule_name=Hardcoded-Username':
          return { data: rules };
        default:
          console.log(q);
      }
    });

    const wrapper = mount(App, {
      props: {
        findings: detailed_findings.data,
        isRuleFinding: false,
      },
      components: {
        FindingTableHeader,
        Panel,
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {},
        directives: {
          tooltip,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.findingList).toEqual(detailed_findings.data);
  });
});
