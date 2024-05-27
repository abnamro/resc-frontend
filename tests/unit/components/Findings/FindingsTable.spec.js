import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Findings/FindingsTable.vue';
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createTestingPinia } from '@pinia/testing';
import { BFormCheckbox, BButton } from 'bootstrap-vue-next';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import detailed_findings from '@/../tests/resources/mock_detailed_findings.json';
import { BTable } from 'bootstrap-vue-next';

let allProjects = ['ABC', 'XYZ', 'GRD0000001', 'GRD0000002'];
let allRepos = ['bb_repo1', 'bb_repo2', 'ado_repo1', 'ado_repo2'];

importFA();

vi.mock('axios');

describe('FindingsTable tests', () => {
    it('Given a FindingsTable then FindingsTable will be displayed', () => {
        axios.get.mockResolvedValueOnce({ data: rule_packs });
        axios.get.mockResolvedValueOnce({ data: allProjects });
        axios.get.mockResolvedValueOnce({ data: allRepos });
        axios.get.mockResolvedValueOnce({ data: detailed_findings });

        const wrapper = shallowMount(App, {
            props: {
                findings: detailed_findings.data
            },
            components: {
                BTable,
                BButton,
                BFormCheckbox,
                FontAwesomeIcon,
            },
            global: {
                plugins: [createTestingPinia()],
                stubs: {
                    AuditModal: true,
                    FindingPanel: true,
                    FindingStatusBadge: true,
                },
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.vm.findingList).toEqual(detailed_findings.data);

        expect(() => wrapper.vm.toggleAllCheckboxes()).not.toThrow();
        expect(wrapper.vm.selectedCheckBoxIds).toEqual([detailed_findings.data[0].id_]);
        expect(() => wrapper.vm.selectAllCheckboxes()).not.toThrow();
        expect(() => wrapper.vm.updateVisualBadge([detailed_findings.data[0].id_], 'TRUE_POSITIVE')).not.toThrow();
        

        expect(() => wrapper.vm.selectSingleCheckbox()).not.toThrow();

        // expect(() => wrapper.vm.selectDown()).not.toThrow();

        axios.get.mockResolvedValueOnce({ data: detailed_findings });
        expect(() => wrapper.vm.updateAudit('NOT_ANALYZED', 'Rien a declarer')).not.toThrow();

    })


})