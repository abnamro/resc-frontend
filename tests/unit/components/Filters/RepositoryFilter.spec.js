import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Filters/RepositoryFilter.vue';

describe('RepositoryFilter tests', () => {
  it('Given a RepositoryFilter When props are passed then RepositoryFilter will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        repositoryOptions: ['repo1', 'repo2'],
      },
      components: {},
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onRepositoryFilterChange()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-repository-change');
  });
});
