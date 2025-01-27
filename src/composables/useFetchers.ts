import { dispatchError } from '@/configuration/config';
import RepositoryService from '@/services/repository-service';
import type { VCSProviders } from '@/services/shema-to-types';
import { ref } from 'vue';

export function useFetchers() {
  const vcsFilter = ref<VCSProviders[]>([]);
  const repositoryFilter = ref<string | undefined>(undefined);
  const projectFilter = ref<string | undefined>(undefined);
  const projectNames = ref<string[]>([]);
  const repositoryNames = ref<string[]>([]);
  const includeZeroFindingRepos = ref(false);
  const includeDeletedRepositories = ref(false);
  const onlyIfHasUntriagedFindings = ref(false);

  function fetchDistinctProjects() {
    RepositoryService.getDistinctProjects(
      vcsFilter.value,
      repositoryFilter.value,
      includeZeroFindingRepos.value,
      includeDeletedRepositories.value,
    )
      .then((response) => {
        projectNames.value = [];
        for (const projectKey of response.data) {
          projectNames.value.push(projectKey);
        }
      })
      .catch(dispatchError);
  }
  function fetchDistinctRepositories() {
    RepositoryService.getDistinctRepositories(
      vcsFilter.value,
      projectFilter.value,
      includeZeroFindingRepos.value,
      includeDeletedRepositories.value,
      onlyIfHasUntriagedFindings.value,
    )
      .then((response) => {
        repositoryNames.value = [];
        for (const repoName of response.data) {
          repositoryNames.value.push(repoName);
        }
      })
      .catch(dispatchError);
  }

  return {
    vcsFilter,
    repositoryFilter,
    projectFilter,

    includeZeroFindingRepos,
    includeDeletedRepositories,
    onlyIfHasUntriagedFindings,

    projectNames,
    repositoryNames,

    fetchDistinctProjects,
    fetchDistinctRepositories,
  };
}
