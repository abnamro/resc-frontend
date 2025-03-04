import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi, beforeAll, afterEach } from 'vitest';
import App from '@/views/AuditView.vue';
import data from '@/../tests/resources/mock_audits_response.json';
import { importFA } from '@/assets/font-awesome';
import flushPromises from 'flush-promises';

importFA();
const tooltip = vi.fn();

vi.mock('axios');
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

describe('AuditView tests', () => {
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

  let wrapper;

  function initMountApp() {
    wrapper = mount(App, {
      components: {},
      global: {
        plugins: [],
        directives: { tooltip },
        stubs: {
          AuditModal: true,
        },
      },
    });
  }

  afterEach(() => {
    axios.get.mockReset();
    vi.restoreAllMocks();
  });

  it('Given a AuditView then AuditView will be displayed', async () => {
    const spy = vi.spyOn(axios, 'get');
    spy.mockImplementation((q) => {
      switch (q) {
        case 'audits':
          return { data: data };
        default:
          console.log(q);
      }
    });

    initMountApp();
    expect(wrapper.exists()).toBe(true);
    await flushPromises();

    expect(() => wrapper.vm.selectDown()).not.toThrow();
    // This does not seem to trigger coverage sadly...
    expect(() => wrapper.vm.sendUpdate(['123456'], 'FALSE_POSITIVE')).not.toThrow();
    expect(wrapper.vm.selectedIndex).toBe(0);
    expect(wrapper.vm.audits).not.toBe(undefined);
    expect(() => wrapper.vm.toggleSelect()).not.toThrow();

    expect(() => wrapper.vm.updateAudit('FALSE_POSITIVE', '')).not.toThrow();
    expect(wrapper.vm.trimPath('0123456789012345678901234567890123456789')).toBe('012345678901234567890123456789');
  });
});
