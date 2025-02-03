import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '@/components/Login/SessionTimeout.vue';
import { createTestingPinia } from '@pinia/testing';
// import axios from 'axios';
import * as jose from 'jose';

describe('BatView tests', () => {
  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('Given a SessionTimeout without session will be displayed', async () => {
    vi.mock('axios');
    vi.mock('jose');

    vi.spyOn(window, 'dispatchEvent');
    vi.spyOn(window, 'setInterval');
    const wrapper = mount(App, {
      props: {},
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {},
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.idToken).toBe(null);

    wrapper.vm.updateTimer();
    expect(window.setInterval).toBeCalled();
    expect(window.dispatchEvent).not.toBeCalled();
  });

  it('Given a SessionTimeout then SessionTimeout will be displayed', async () => {
    vi.mock('axios');
    vi.mock('jose');

    vi.spyOn(window, 'dispatchEvent');
    vi.spyOn(window, 'setInterval');
    jose.decodeJwt.mockResolvedValue({ exp: undefined });
    const wrapper = mount(App, {
      props: {},
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: '123456',
                tokenLength: 3600,
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.idToken).toBe('123456');

    wrapper.vm.updateTimer();
    expect(window.setInterval).toBeCalled();
    expect(window.dispatchEvent).toBeCalled();
  });

  it('Given a SessionTimeout then SessionTimeout will be displayed with time', async () => {
    vi.mock('axios');
    vi.mock('jose');

    vi.spyOn(window, 'dispatchEvent');
    vi.spyOn(window, 'setInterval');
    const claims = { exp: Date.now() / 1000 + 50 * 36 };
    const spy = vi.spyOn(jose, 'decodeJwt');
    spy.mockImplementation(() => claims);

    const wrapper = mount(App, {
      props: {},
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: '123456',
                tokenLength: 3600,
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.idToken).toBe('123456');

    wrapper.vm.updateTimer();
    expect(window.setInterval).toBeCalled();
    expect(window.dispatchEvent).not.toBeCalled();
    expect(wrapper.vm.timeLeft).toBeCloseTo(50, 0);
  });

  it('Given a SessionTimeout then SessionTimeout will throw', async () => {
    vi.mock('axios');
    vi.mock('jose');

    vi.spyOn(window, 'dispatchEvent');
    vi.spyOn(window, 'setInterval');

    const spy = vi.spyOn(jose, 'decodeJwt');
    spy.mockImplementation(() => {
      throw new Error('oups');
    });

    const wrapper = mount(App, {
      props: {},
      components: {},
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              authUser: {
                idToken: '123456',
                tokenLength: 3600,
              },
            },
          }),
        ],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.idToken).toBe('123456');

    wrapper.vm.updateTimer();
    expect(window.setInterval).toBeCalled();
    expect(window.dispatchEvent).toBeCalled();
  });
});
