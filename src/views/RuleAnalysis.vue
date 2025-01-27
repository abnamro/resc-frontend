<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULE ANALYSIS</h1>

    <RuleAnalysisFilter
      :projectOptions="projectNames"
      :repositoryOptions="repositoryNames"
      :rulePackPreSelected="selectedRulePackVersionsList"
      :rulePackOptions="rulePackVersions"
      @on-filter-change="handleFilterChange"
    ></RuleAnalysisFilter>

    <FindingsTable
      :findings="findingList"
      :is-rule-finding="true"
      :has-records="hasRecords"
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
import AxiosConfig from '@/configuration/axios-config';
import FindingsTable from '@/components/Findings/FindingsTable.vue';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import { type RuleAnalysisFilter } from '@/components/Filters/RuleAnalysisFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import { computed, onMounted, ref, type Ref } from 'vue';
import type { DetailedFindingRead, PaginationType, RulePackRead } from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import CommonUtils from '@/utils/common-utils';
import { PAGE_SIZES } from '@/configuration/config';
import { storeToRefs } from 'pinia';
import Paginator from 'primevue/paginator';
import { usePaginator } from '@/composables/usePaginator';
import { useFetchers } from '@/composables/useFetchers';

const loadedData = ref(false);
const store = useAuthUserStore();

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } = usePaginator(
  fetchPaginatedDetailedFindings,
);

const {
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
} = useFetchers();

const findingList = ref([] as DetailedFindingRead[]);
const rulePackVersions = ref([] as RulePackRead[]);
const ruleTagsList = ref([] as string[]);
const selectedStartDate = ref(undefined) as Ref<string | undefined>;
const selectedEndDate = ref(undefined) as Ref<string | undefined>;
const { selectedStatus } = storeToRefs(store);
const selectedRule = ref(undefined) as Ref<string[] | undefined>;
const selectedRuleTags = ref(undefined) as Ref<string[] | undefined>;
const selectedRulePackVersions = ref([] as string[]);
const selectedRulePackVersionsList = ref([] as RulePackRead[]);
const selectedCheckBoxIds = ref([] as number[]);
const allSelected = ref(false);

const hasRecords = computed(() => findingList.value.length > 0);

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
  loadedData.value = false;
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
    ruleTags: selectedRuleTags.value,
    rulePackVersions: selectedRulePackVersions.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };

  findingList.value = [];

  FindingsService.getDetailedFindings(filterObj)
    .then((response: AxiosResponse<PaginationType<DetailedFindingRead>>) => {
      totalRows.value = 0;
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
      loadedData.value = true;
    })
    .catch((error) => {
      /* istanbul ignore next @preserve */
      AxiosConfig.handleError(error);
    });
}

function handleFilterChange(filterObj: RuleAnalysisFilter) {
  selectedStartDate.value = filterObj.startDate;
  selectedEndDate.value = filterObj.endDate;
  vcsFilter.value = filterObj.vcsProvider ?? [];
  projectFilter.value = filterObj.project;
  repositoryFilter.value = filterObj.repository;
  selectedRule.value = filterObj.rule;
  selectedRuleTags.value = filterObj.ruleTags;
  selectedRulePackVersions.value = filterObj.rulePackVersions ?? [];
  includeDeletedRepositories.value = filterObj.includeDeletedRepositories ?? false;
  currentPage.value = 0;
  allSelected.value = false;
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedDetailedFindings();
}

function fetchRulePackVersionsWhenRedirectedFromRuleMetricsPage() {
  RulePackService.getRulePackVersions(10000, 0)
    .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
      rulePackVersions.value = [];
      selectedRulePackVersions.value = [];
      response.data.data.forEach((rulePack) => {
        if (rulePack.outdated !== true) {
          rulePackVersions.value.push(rulePack);
        }
      });
      rulePackVersions.value.sort(CommonUtils.compareRulePackRead).reverse();
      //Select rule pack versions passed from rule analysis scrren
      const previousRouteState = store.previousRouteState as PreviousRouteState;
      if (previousRouteState && previousRouteState.rulePackVersions !== undefined) {
        for (const obj of previousRouteState.rulePackVersions) {
          selectedRulePackVersions.value.push(obj.version);
          selectedRulePackVersionsList.value.push(obj);
        }
        fetchRuleTags();
        store.update_previous_route_state(null);
      }
    })
    .catch((error) => {
      /* istanbul ignore next @preserve */
      AxiosConfig.handleError(error);
    });
}

function fetchRulePackVersions() {
  RulePackService.getRulePackVersions(10000, 0)
    .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
      rulePackVersions.value = [];
      selectedRulePackVersions.value = [];
      selectedRulePackVersionsList.value = [];
      for (const index of response.data.data.keys()) {
        const data = response.data.data[index];
        if (data.active) {
          selectedRulePackVersions.value.push(data.version);
          selectedRulePackVersionsList.value.push(data);
        }
        rulePackVersions.value.push(data);
      }
      rulePackVersions.value.sort(CommonUtils.compareRulePackRead).reverse();
      fetchPaginatedDetailedFindings();
    })
    .catch((error) => {
      /* istanbul ignore next @preserve */
      AxiosConfig.handleError(error);
    });
}

function fetchRuleTags() {
  RulePackService.getRuleTagsByRulePackVersions(selectedRulePackVersions.value)
    .then((response: AxiosResponse<string[]>) => {
      selectedRuleTags.value = [];
      ruleTagsList.value = response.data;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

onMounted(() => {
  includeDeletedRepositories.value = false;
  includeZeroFindingRepos.value = false;
  onlyIfHasUntriagedFindings.value = false;

  if (isRedirectedFromRuleMetricsPage()) {
    fetchRulePackVersionsWhenRedirectedFromRuleMetricsPage();
  } else {
    store.update_previous_route_state(null);
    fetchRulePackVersions();
    fetchDistinctProjects();
    fetchDistinctRepositories();
  }
});
</script>
