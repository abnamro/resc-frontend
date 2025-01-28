<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULE ANALYSIS</h1>

    <RuleAnalysisFilter
      :project-options="projectNames"
      :repository-options="repositoryNames"
      :rule-pack-options="rulePacks"
      :rule-tag-options="ruleTags"
      :rule-pack-filter="rulePacksFilter"
      @on-filter-change="handleFilterChange"
    >
    </RuleAnalysisFilter>

    <FindingsTable
      :findings="findingList"
      :is-rule-finding="true"
      @refresh-table="fetchPaginatedDetailedFindings"
    >
    </FindingsTable>

    <Paginator
      v-model:first="currentPage"
      v-model:rows="perPage"
      :totalRecords="totalRows"
      :rowsPerPageOptions="PAGE_SIZES"
      @update:first="handlePageClick"
      @update:rows="handlePageSizeChange"
    />
  </div>
</template>

<script lang="ts" setup>
import FindingsTable from '@/components/Findings/FindingsTable.vue';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import { type RuleAnalysisFilter } from '@/components/Filters/RuleAnalysisFilter.vue';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import { onMounted, ref } from 'vue';
import type { DetailedFindingRead, PaginationType } from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import { dispatchError, PAGE_SIZES } from '@/configuration/config';
import { storeToRefs } from 'pinia';
import Paginator from 'primevue/paginator';
import { usePaginator } from '@/composables/usePaginator';
import { useFetchers } from '@/composables/useFetchers';

const store = useAuthUserStore();

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } = usePaginator(
  fetchPaginatedDetailedFindings,
);

const {
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
  rulePacks,
  ruleTags,

  fetchDistinctProjects,
  fetchDistinctRepositories,
  fetchRuleTags,
  fetchRulePackVersions,
} = useFetchers();

const findingList = ref<DetailedFindingRead[] | undefined>(undefined);
const selectedStartDate = ref<string | undefined>(undefined);
const selectedEndDate = ref<string | undefined>(undefined);
const { selectedStatus } = storeToRefs(store);
const selectedRule = ref<string[] | undefined>(undefined);
const selectedCheckBoxIds = ref<number[]>([]);
const allSelected = ref(false);

function isRedirectedFromRuleMetricsPage() {
  const sourceRoute = store.sourceRoute;
  const destinationRoute = store.destinationRoute;
  return sourceRoute === '/metrics/rule-metrics' &&
    destinationRoute === '/rule-analysis' &&
    store.previousRouteState
    ? true
    : false;
}

function fetchPaginatedDetailedFindings() {
  const filterObj: QueryFilterType = {
    skip: currentPage.value,
    limit: perPage.value,
    startDate: selectedStartDate.value,
    endDate: selectedEndDate.value,
    vcsProvider: vcsFilter.value,
    findingStatus: selectedStatus.value.map((s) => s.value),
    project: projectFilter.value,
    repository: repositoryFilter.value,
    rule: selectedRule.value,
    ruleTags: ruleTagsFilter.value,
    rulePackVersions: rulePacksFilter.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };

  findingList.value = undefined;

  FindingsService.getDetailedFindings(filterObj)
    .then((response: AxiosResponse<PaginationType<DetailedFindingRead>>) => {
      totalRows.value = 0;
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
    })
    .catch(dispatchError);
}

function handleFilterChange(filterObj: RuleAnalysisFilter) {
  selectedStartDate.value = filterObj.startDate;
  selectedEndDate.value = filterObj.endDate;
  vcsFilter.value = filterObj.vcsProvider ?? [];
  projectFilter.value = filterObj.project;
  repositoryFilter.value = filterObj.repository;
  selectedRule.value = filterObj.rule;
  ruleTagsFilter.value = filterObj.ruleTags;
  rulePacksFilter.value = filterObj.rulePackVersions ?? [];
  includeDeletedRepositories.value = filterObj.includeDeletedRepositories ?? false;
  currentPage.value = 0;
  allSelected.value = false;
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedDetailedFindings();
}

function setRulePackSelectionFromStore() {
  const previousRouteState = store.previousRouteState as PreviousRouteState;
  if (previousRouteState && previousRouteState.rulePackVersions !== undefined) {
    for (const obj of previousRouteState.rulePackVersions) {
      rulePacksFilter.value.push(obj.version);
    }
    fetchRuleTags();
    store.update_previous_route_state(null);
  }
}

onMounted(() => {
  includeDeletedRepositories.value = false;
  includeZeroFindingRepos.value = false;
  onlyIfHasUntriagedFindings.value = false;

  if (isRedirectedFromRuleMetricsPage()) {
    fetchRulePackVersions(setRulePackSelectionFromStore);
  } else {
    store.update_previous_route_state(null);
    fetchRulePackVersions(fetchPaginatedDetailedFindings);
    fetchDistinctProjects();
    fetchDistinctRepositories();
  }
});
</script>
