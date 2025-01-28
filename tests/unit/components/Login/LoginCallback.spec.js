import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Login/LoginCallback.vue';
import { createTestingPinia } from '@pinia/testing';
import AuthService from '@/services/auth-service';

describe('LoginCallback tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Given a LoginCallback then Callback will throw error on mount', () => {
    vi.spyOn(window, 'dispatchEvent');
    mount(App, {
      props: {},
      components: {},
      global: {
        plugins: [createTestingPinia()],
      },
    })
    expect(window.dispatchEvent).toBeCalled();
  });

  it('Given a LoginCallback then AuthService execute Login', () => {
    vi.spyOn(AuthService, 'doLogin').mockImplementationOnce(() => true);
    expect(() =>
      mount(App, {
        props: {},
        components: {},
        global: {
          plugins: [createTestingPinia()],
        },
      }),
    ).not.toThrow();
  });

  it('Given a LoginCallback then AuthService execute Login', () => {
    vi.spyOn(AuthService, 'doLogin').mockImplementationOnce(() => false);
    expect(() =>
      mount(App, {
        props: {},
        components: {},
        global: {
          plugins: [createTestingPinia()],
        },
      }),
    ).not.toThrow();
  });
});
