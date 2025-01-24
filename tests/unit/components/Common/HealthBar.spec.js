import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/components/Common/HealthBar.vue';

describe('HealthBar tests', () => {
  it('Given a HealthBar When props are passed then HealthBar will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        truePositive: 5,
        falsePositive: 4,
        notAnalyzed: 3,
        notAccessible: 2,
        clarificationRequired: 1,
        outdated: 0,
        totalCount: 15,
      },
      components: {},
    });

    expect(wrapper.exists()).toBe(true);
  });
});
