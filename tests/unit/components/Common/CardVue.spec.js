import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Common/CardVue.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { importFA } from '@/assets/font-awesome';
import { Card } from 'primevue';

importFA();
const tooltip = vi.fn();

describe('CardVue tests', () => {
  it('Given a Card When props are passed then Card will be displayed', async () => {
    const wrapper = mount(App, {
      props: {
        cardTitle: 'card-title',
        cardBodyContent: 'card-content',
        titleIcon: 'medal',
        titleIconColor: 'red',
        titleIconTooltip: 'this is a medal',
        contentColor: 'yellow',
        contentIcon: 'award',
        contentIconColor: 'green',
      },
      components: {
        Card,
        FontAwesomeIcon,
      },
      global: {
        stubs: {},

        directives: {
          tooltip,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain('card-title');
    expect(wrapper.html()).toContain('card-content');
  });

  it('Given a Card When minor props are passed then Card will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        cardTitle: 'card-title',
      },
      global: {
        stubs: { FontAwesomeIcon: true },
      },
      components: {
        Card,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.html()).toContain('card-title');
    expect(wrapper.vm.titleIconDefinition).toBe(null);
  });
});
