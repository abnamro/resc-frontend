import { mount } from '@vue/test-utils';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import App from '@/views/RepositoriesPanel.vue';
import repositories from '@/../tests/resources/mock_repositories.json';
import vcs_providers from '@/../tests/resources/mock_vcs_providers.json';
import HealthBar from '@/components/Common/HealthBar.vue';
import RepositoriesPageFilter from '@/components/Filters/RepositoriesPageFilter.vue';
import ProgressSpinner from 'primevue/progressspinner';
import flushPromises from 'flush-promises';

vi.mock('axios');
const tooltip = vi.fn();

const allRepos = ['bb_repo1', 'bb_repo2', 'ado_repo1', 'ado_repo2'];
// const bitbucketRepos = ['bb_repo1', 'bb_repo2'];
// const adoRepos = ['ado_repo1', 'ado_repo2'];

const allProjects = ['ABC', 'XYZ', 'GRD0000001', 'GRD0000002'];
// const bitbucketProjects = ['ABC', 'XYZ'];
// const adoProjects = ['GRD0000001', 'GRD0000002'];
// const projectNameByRepoName = ['ABC'];

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');
  return {
    ...actual,
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
      push: () => {},
      resolve: () => {
        return { href: 'link' };
      },
    })),
  };
});

describe('RepositoriesPanel tests', () => {
  let wrapper;
  window.open = vi.fn()

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function initMountApp() {
    wrapper = mount(App, {
      components: {
        ProgressSpinner,
        HealthBar,
        RepositoriesPageFilter,
      },
      global: {
        stubs: {},
        directives: {
          tooltip
        }
      },
    });
  }

  it('Given a RepositoriesPanel then RepositoriesPanel will be displayed', async () => {
    vi.spyOn(window, 'open');
    axios.get.mockResolvedValueOnce({ data: allProjects });
    axios.get.mockResolvedValueOnce({ data: allRepos });
    axios.get.mockResolvedValueOnce(vcs_providers);
    axios.get.mockResolvedValueOnce({ data: repositories });
    // Repository Page Filter

    initMountApp();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.formatDate(0)).toBe('Not Scanned');
    expect(wrapper.vm.formatDate(123456)).toContain('Jan 01, 1970');

    axios.get.mockResolvedValueOnce({ data: repositories });
    wrapper.vm.handlePageClick(1);
    axios.get.mockResolvedValueOnce({ data: repositories });
    wrapper.vm.handlePageSizeChange(1);
    axios.get.mockResolvedValueOnce({ data: allProjects });
    axios.get.mockResolvedValueOnce({ data: allRepos });
    axios.get.mockResolvedValueOnce({ data: repositories });
    wrapper.vm.handleFilterChange(['AZURE_DEVOPS'], undefined, undefined);
    expect(wrapper.vm.selection).toBe(undefined);
    await flushPromises();
    expect(() => wrapper.vm.selectDown()).not.toThrow();
    expect(() => wrapper.vm.selectUp()).not.toThrow();
    expect(wrapper.vm.selectedIndex).toBe(0);
    expect(() => wrapper.vm.handleRowClicked({index: 1})).not.toThrow();
    expect(wrapper.vm.selectedIndex).toBe(1);
    expect(wrapper.vm.selection).not.toBe(undefined);
    expect(() => wrapper.vm.goToScanFindings()).not.toThrow();
  });
});
