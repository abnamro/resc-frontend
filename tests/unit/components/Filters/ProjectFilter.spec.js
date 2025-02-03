import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Filters/ProjectFilter.vue';

describe('ProjectFilter tests', () => {
  it('Given a ProjectFilter When props are passed then ProjectFilter will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        projectOptions: ['project1', 'project2'],
      },
      components: {},
    });

    expect(wrapper.exists()).toBe(true);
    expect(() => wrapper.vm.onProjectFilterChange()).not.toThrow();
    expect(wrapper.emitted()).toHaveProperty('on-project-change');
  });
});
