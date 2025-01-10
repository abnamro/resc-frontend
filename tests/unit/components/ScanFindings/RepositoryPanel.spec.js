import { mount } from '@vue/test-utils';
import axios from 'axios';
import { vi, describe, expect, it } from 'vitest';
import App from '@/components/ScanFindings/RepositoryPanel.vue';

vi.mock('axios');

describe('Repository Panel', () => {
  let repositoryId = 1;
  let deletedAt = '2021-10-01T00:00:00Z';
  let deletedAtResponse = {
    id_: repositoryId,
    project_key: 'project_name',
    repository_name: 'repo_name',
    deleted_at: deletedAt,
  };

  it('Display dummy data in a Repository Panel', async () => {
    axios.patch.mockResolvedValueOnce({ data: deletedAtResponse });

    const wrapper = await mount(App, {
      props: {
        repository: {
          project_key: 'project_name',
          repository_id: '1',
          repository_name: 'repo_name',
          id_: 1,
          vcs_instance: 1,
        },
        vcs_instance: { name: 'vcs_name' },
      },
      components: {},
    });

    expect(wrapper.text()).toContain('project_name');
    expect(wrapper.text()).toContain('repo_name');
    expect(wrapper.text()).toContain('vcs_name');
    expect(wrapper.vm.repoDeleted).toBe(false);
    expect(async () => await wrapper.vm.handleDeletedChange()).not.toThrow();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.repoDeleted).toBe(true);
  });
});
