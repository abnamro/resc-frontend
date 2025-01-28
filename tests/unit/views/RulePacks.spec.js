import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/views/RulePacks.vue';
import RulePackUploadModal from '@/components/RulePack/RulePackUploadModal.vue';
import rule_packs from '@/../tests/resources/mock_rule_packs.json';
import { importFA } from '@/assets/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ToastService from 'primevue/toastservice';
import flushPromises from 'flush-promises';

importFA();

vi.mock('axios');
vi.mock('windows');
describe('RulePacks tests', () => {
  let wrapper;

  axios.get.mockResolvedValueOnce({ data: rule_packs });

  function initMountApp() {
    wrapper = mount(App, {
      props: {},
      global: {plugins:[ToastService]},
      components: {
        FontAwesomeIcon,
        RulePackUploadModal,
      },
    });
  }

  it('Given a RulePacks then RulePacks will be displayed', async () => {
    initMountApp();
    expect(wrapper.exists()).toBe(true);

    axios.get.mockResolvedValueOnce({ data: rule_packs });
    expect(() => wrapper.vm.handlePageClick(1)).not.toThrow();
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    expect(() => wrapper.vm.handlePageSizeChange(20)).not.toThrow();
    axios.get.mockResolvedValueOnce({ data: rule_packs });
    expect(() => wrapper.vm.onRulePackUploadSuccess()).not.toThrow();

    const buffer = new ArrayBuffer();
    axios.get.mockResolvedValueOnce(buffer);
    expect(() => wrapper.vm.downloadRulePack('0.0.6')).not.toThrow();
    await flushPromises();
 
    axios.post.mockResolvedValueOnce({});
    wrapper.vm.openMarkAsOutdated(rule_packs.data[0]);
    expect(wrapper.vm.isConfirmOpen).toBe(false);
    await flushPromises();

    wrapper.vm.openMarkAsOutdated(rule_packs.data[6]);
    expect(wrapper.vm.isConfirmOpen).toBe(true);
    expect(wrapper.vm.rulePackSelected).toStrictEqual(rule_packs.data[6]);
    await flushPromises();

    wrapper.vm.cancelAction()
    await flushPromises();
    expect(wrapper.vm.isConfirmOpen).toBe(false);
    expect(wrapper.vm.rulePackSelected).toBe(null);

    wrapper.vm.openMarkAsOutdated(rule_packs.data[6]);
    expect(wrapper.vm.isConfirmOpen).toBe(true);
    expect(wrapper.vm.rulePackSelected).toStrictEqual(rule_packs.data[6]);
    expect(() => wrapper.vm.markAsOutdated()).not.toThrow();
  });
});
