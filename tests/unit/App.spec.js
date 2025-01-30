import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import TopBarMenu from '@/components/Navigation/TopBarMenu.vue';
import { sidebarMenu } from '@/components/Navigation/Navigation';
import { SidebarMenu } from 'vue-sidebar-menu';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { vi } from 'vitest';
import Config from '@/configuration/config';
import { createTestingPinia } from '@pinia/testing';

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
      push: () => {},
    })),
  };
});

describe('App.vue unit tests', () => {
  it('Given an App When login then Top bar and SideMenubar will be displayed', async () => {
    const wrapper = shallowMount(App, {
      components: {
        SidebarMenu: SidebarMenu,
        TopBarMenu: TopBarMenu,
        fontAwesomeIcon: FontAwesomeIcon,
      },
      data() {
        return {
          sidebarCollapsed: false,
          sidebarNavigationMenu: sidebarMenu,
        };
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: ['router-view'],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent(TopBarMenu).exists()).toBe(true);
    expect(wrapper.findComponent(SidebarMenu).exists()).toBe(true);
    expect(wrapper.vm.showMenu).toBe(true);

    expect(() => wrapper.vm.onToggleCollapse(true)).not.toThrow();
    expect(wrapper.vm.sidebarCollapsed).toBe(true);
    expect(() => wrapper.vm.onToggleCollapse(false)).not.toThrow();
    expect(wrapper.vm.sidebarCollapsed).toBe(false);
  });

  it('Configuration with non Existing key should return error', () => {
    expect(() => Config.value('notExisting')).toThrow(
      'Configuration: There is no key named "notExisting"',
    );
    expect(Config.value('ssoClientId')).toBe('RESC');
  });
});
