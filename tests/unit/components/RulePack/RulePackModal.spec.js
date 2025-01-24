import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/RulePack/RulePackUploadModal.vue';

vi.mock('axios');

describe('RulePackUploadModal tests', () => {
  it('Given a RulePackUploadModal then RulePackUploadModal will be initiated', async () => {
    const wrapper = mount(App, {
      props: {},
      components: {},
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.loadedData).toBe(true);
    expect(wrapper.find('#versionInput').exists()).toBe(false);
    expect(wrapper.vm.validateVersion()).toBe(false);
    expect(() => wrapper.vm.hide()).not.toThrow();
    axios.post.mockResolvedValueOnce({ status: 200 });
    expect(() => wrapper.vm.handleOk(new MouseEvent('click'))).not.toThrow();
    expect(wrapper.find('.spinner').exists()).toBe(false);
    expect(() => wrapper.vm.resetModal()).not.toThrow();
    expect(() => wrapper.vm.show()).not.toThrow();
  });
});
