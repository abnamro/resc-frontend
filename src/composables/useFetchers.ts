import { dispatchError } from '@/configuration/config';
import RepositoryService from '@/services/repository-service';
import RulePackService from '@/services/rule-pack-service';
import type { RulePackRead, VCSProviders } from '@/services/shema-to-types';
import CommonUtils from '@/utils/common-utils';
import { ref } from 'vue';

export function useFetchers() {
  const vcsFilter = ref<VCSProviders[]>([]);
  const repositoryFilter = ref<string | undefined>(undefined);
  const projectFilter = ref<string | undefined>(undefined);
  const ruleTagsFilter = ref<string[] | undefined>(undefined);
  const rulePacksFilter = ref<string[]>([]);

  const projectNames = ref<string[]>([]);
  const repositoryNames = ref<string[]>([]);
  const ruleTags = ref<string[]>([]);
  const rulePacks = ref<RulePackRead[]>([]);

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

  function fetchRulePackVersions(callback: () => void) {
    RulePackService.getRulePackVersions(10000, 0)
      .then((response) => {
        rulePacks.value = [];
        rulePacksFilter.value = [];
        for (const index of response.data.data.keys()) {
          const data = response.data.data[index];
          if (data.active) {
            rulePacksFilter.value.push(data.version);
          }
          rulePacks.value.push(data);
        }
        rulePacks.value.sort(CommonUtils.compareRulePackRead).reverse();
        callback();
      })
      .catch(dispatchError);
  }

  function fetchRuleTags() {
    RulePackService.getRuleTagsByRulePackVersions(rulePacksFilter.value)
      .then((response) => {
        ruleTagsFilter.value = [];
        ruleTags.value = response.data;
      })
      .catch(dispatchError);
  }

  return {
    vcsFilter,
    repositoryFilter,
    projectFilter,
    ruleTagsFilter,
    rulePacksFilter,

    includeZeroFindingRepos,
    includeDeletedRepositories,
    onlyIfHasUntriagedFindings,

    projectNames,
    repositoryNames,
    ruleTags,
    rulePacks,

    fetchDistinctProjects,
    fetchDistinctRepositories,
    fetchRuleTags,
    fetchRulePackVersions,
  };
}
