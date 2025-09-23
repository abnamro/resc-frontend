import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import App from '@/components/Charts/MultiLineChartVue.vue';
import { Line } from 'vue-chartjs';
import { createTestingPinia } from '@pinia/testing';

HTMLCanvasElement.prototype.getContext = vi.fn();

describe('MultilineChart tests', () => {
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

  let spy;
  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    console.error.mockClear();
  });

  beforeEach(() => {
    spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('Given a Chart When props are passed then Chart will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        chartData: {
          labels: ['data1', 'data2'],
          datasets: [{ data: [1, 2, 3, 5] }, { data: [2, 2, 3, 4] }],
        },
      },
      components: {
        Line: Line,
      },
      global: {
        plugins: [createTestingPinia()],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain(
      "Failed to create chart: can't acquire context from the given item",
    );
  });

  it('Given a Chart When props are passed with style then Chart will be displayed', () => {
    const wrapper = mount(App, {
      props: {
        chartData: {
          labels: ['data1', 'data2'],
          datasets: [{ data: [0, 2, 3, 5] }, { data: [2, 2, 3, 4] }],
        },
        styles: { height: '300px', width: '200px' },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain(
      "Failed to create chart: can't acquire context from the given item",
    );
  });
});
