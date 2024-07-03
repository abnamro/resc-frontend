import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import App from '@/components/Findings/FindingsTable.vue';
import { importFA } from '@/assets/font-awesome';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings2.json';
import bootstrapVue from 'bootstrap-vue-next';

let allProjects = ['ABC', 'XYZ', 'GRD0000001', 'GRD0000002'];
let allRepos = ['bb_repo1', 'bb_repo2', 'ado_repo1', 'ado_repo2'];

importFA();

vi.mock('axios');

describe('FindingsTable tests', () => {
  it('Given a FindingsTable in rule findings then FindingsTable will be displayed', async () => {
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    axios.get.mockResolvedValueOnce({ data: allProjects });
    axios.get.mockResolvedValueOnce({ data: allRepos });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });

    const wrapper = mount(App, {
      props: {
        findings: detailed_findings.data,
        is_rule_finding: true,
      },
      components: {},
      global: {
        plugins: [createTestingPinia(), bootstrapVue({ plugins: { modalController: true } })],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.findingList).toEqual(detailed_findings.data);
    expect(() => wrapper.find('#allSelected').setValue(true)).not.toThrow();
    expect(() => wrapper.vm.selectAllCheckboxes()).not.toThrow();
    expect(wrapper.vm.selectedCheckBoxIds).toEqual([
      detailed_findings.data[0].id_,
      detailed_findings.data[1].id_,
    ]);
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(wrapper.vm.selectedCheckBoxIds).toEqual([]);
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(wrapper.vm.selectedCheckBoxIds).toEqual([
      detailed_findings.data[0].id_,
      detailed_findings.data[1].id_,
    ]);

    expect(() =>
      wrapper.vm.updateVisualBadge(
        [detailed_findings.data[0].id_, detailed_findings.data[1].id_],
        'TRUE_POSITIVE',
      ),
    ).not.toThrow();
    expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
    expect(() =>
      wrapper.vm.updateVisualBadge([detailed_findings.data[0].id_], 'FALSE_POSITIVE'),
    ).not.toThrow();
    expect(() =>
      wrapper.vm.updateVisualBadge([detailed_findings.data[0].id_], 'NOT_ACCESSIBLE'),
    ).not.toThrow();

    expect(() => wrapper.vm.selectSingleCheckbox()).not.toThrow();

    expect(() => wrapper.vm.toggleFindingDetails(detailed_findings.data[0], 0)).not.toThrow();
    expect(wrapper.vm.selectedIndex).toEqual(0);
    expect(() => wrapper.vm.selectDown()).not.toThrow();
    expect(wrapper.vm.selectedIndex).toEqual(1);
    expect(() => wrapper.vm.selectUp()).not.toThrow();
    expect(wrapper.vm.selectedIndex).toEqual(0);

    expect(() => wrapper.vm.openDetails()).not.toThrow();
    expect(() => wrapper.vm.openCommitUrl()).not.toThrow();
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

    expect(() => wrapper.find('#filter-files').setValue('file1')).not.toThrow();
    await wrapper.vm.$nextTick();
    expect(() => wrapper.find('#filter-files').setValue('fi*')).not.toThrow();
    await wrapper.vm.$nextTick();
    expect(() => wrapper.find('#filter-files').setValue('*e1')).not.toThrow();

    axios.get.mockResolvedValueOnce({ data: detailed_findings });
    expect(() => wrapper.vm.updateAudit('NOT_ANALYZED', 'Rien a declarer')).not.toThrow();
  });

  it('Given a FindingsTable in repository then FindingsTable will be displayed', () => {
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    axios.get.mockResolvedValueOnce({ data: allProjects });
    axios.get.mockResolvedValueOnce({ data: allRepos });
    axios.get.mockResolvedValueOnce({ data: detailed_findings });

    const wrapper = mount(App, {
      props: {
        findings: detailed_findings.data,
        is_rule_finding: false,
      },
      components: {},
      global: {
        plugins: [createTestingPinia(), bootstrapVue({ plugins: { modalController: true } })],
        stubs: {},
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.findingList).toEqual(detailed_findings.data);
  });
});
