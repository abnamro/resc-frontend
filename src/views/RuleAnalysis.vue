<template>
  <b-navbar toggleable="lg" type="dark" class="px-4 right">
    <!-- variant="warning" -->
    <b-navbar-brand
      class="ml-auto float-right px-3 rounded-circle bg-warning text-white font-bold"
      @click="showKeybindingHelp"
      >?</b-navbar-brand
    >
  </b-navbar>

  <KeybindingModal ref="keybindingModal"></KeybindingModal>

  <div class="m-4">
    <!-- Page Title -->
    <div class="col-md-2 pt-2 text-start page-title">
      <h3><small class="text-nowrap">RULE ANALYSIS</small></h3>
    </div>

    <SpinnerVue v-if="!loadedData" />

    <!-- Filters -->
    <div class="mt-4">
      <RuleAnalysisFilter
        :projectOptions="projectNames"
        :repositoryOptions="repositoryNames"
        :rulePackPreSelected="selectedRulePackVersionsList"
        :rulePackOptions="rulePackVersions"
        @on-filter-change="handleFilterChange"
      ></RuleAnalysisFilter>
    </div>

    <!--Scan Findings Table -->
    <div v-if="!hasRecords && loadedData" class="text-center cursor-default">
      <br />
      <br />No Record Found...
    </div>

    <FindingsTable
      :findings="findingList"
      v-if="hasRecords"
      @refresh-table="fetchPaginatedDetailedFindings"
    >
    </FindingsTable>

    <div class="p-3" v-if="hasRecords">
      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :perPage="perPage"
        :totalRows="totalRows"
        :pageSizes="pageSizes"
        :requestedPageNumber="requestedPageNumber"
        @page-click="handlePageClick"
        @page-size-change="handlePageSizeChange"
      >
      </Pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import KeybindingModal from '@/components/Help/KeybindingModal.vue';
import Config from '@/configuration/config';
import AxiosConfig from '@/configuration/axios-config';
import FindingsTable from '@/components/Findings/FindingsTable.vue';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import RepositoryService from '@/services/repository-service';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import Pagination from '@/components/Common/PaginationVue.vue';
import { type RuleAnalysisFilter } from '@/components/Filters/RuleAnalysisFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import { computed, onMounted, ref, type Ref } from 'vue';
import type {
  DetailedFindingRead,
  FindingStatus,
  PaginationType,
  RulePackRead,
  VCSProviders,
} from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import type { TableItem } from 'bootstrap-vue-next';
import CommonUtils from '@/utils/common-utils';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';

type TableItemDetailedFindingRead = DetailedFindingRead & TableItem;

const loadedData = ref(false);
const keybindingModal = ref();

const findingList = ref([] as TableItemDetailedFindingRead[]);
const totalRows = ref(0);
const currentPage = ref(1);
const perPage = ref(Number(`${Config.value('defaultPageSize')}`));
const pageSizes = ref([20, 50, 100]);
const requestedPageNumber = ref(1);
const rulePackVersions = ref([] as RulePackRead[]);
const ruleTagsList = ref([] as string[]);
const projectNames = ref([] as string[]);
const repositoryNames = ref([] as string[]);
const selectedStartDate = ref(undefined) as Ref<string | undefined>;
const selectedEndDate = ref(undefined) as Ref<string | undefined>;
const selectedVcsProvider = ref([] as VCSProviders[]);
const selectedStatus = ref(undefined) as Ref<FindingStatus[] | undefined>;
const selectedProject = ref(undefined) as Ref<string | undefined>;
const selectedRepository = ref(undefined) as Ref<string | undefined>;
const selectedRule = ref(undefined) as Ref<string[] | undefined>;
const selectedRuleTags = ref(undefined) as Ref<string[] | undefined>;
const selectedRulePackVersions = ref([] as string[]);
const selectedRulePackVersionsList = ref([] as RulePackRead[]);
const selectedCheckBoxIds = ref([] as number[]);
const allSelected = ref(false);

const hasRecords = computed(() => findingList.value.length > 0);
const skipRowCount = computed(() => (currentPage.value - 1) * perPage.value);

function isRedirectedFromRuleMetricsPage() {
  const store = useAuthUserStore();
  const sourceRoute = store.sourceRoute;
  const destinationRoute = store.destinationRoute;
  return sourceRoute === '/metrics/rule-metrics' &&
    destinationRoute === '/rule-analysis' &&
    store.previousRouteState
    ? true
    : false;
}

function showKeybindingHelp() {
  keybindingModal.value.show();
}

function handlePageClick(page: number) {
  allSelected.value = false;
  currentPage.value = page;
  fetchPaginatedDetailedFindings();
}

function handlePageSizeChange(pageSize: number) {
  perPage.value = pageSize;
  currentPage.value = 1;
  fetchPaginatedDetailedFindings();
}

function fetchPaginatedDetailedFindings() {
  loadedData.value = false;
  const filterObj: QueryFilterType = {
    skip: skipRowCount.value,
    limit: perPage.value,
    startDate: selectedStartDate.value,
    endDate: selectedEndDate.value,
    vcsProvider: selectedVcsProvider.value,
    findingStatus: selectedStatus.value,
    project: selectedProject.value,
    repository: selectedRepository.value,
    rule: selectedRule.value,
    ruleTags: selectedRuleTags.value,
    rulePackVersions: selectedRulePackVersions.value,
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
      AxiosConfig.handleError(error);
    });
}

function handleFilterChange(filterObj: RuleAnalysisFilter) {
  selectedStartDate.value = filterObj.startDate;
  selectedEndDate.value = filterObj.endDate;
  selectedVcsProvider.value = filterObj.vcsProvider ?? [];
  selectedStatus.value = filterObj.status;
  selectedProject.value = filterObj.project;
  selectedRepository.value = filterObj.repository;
  selectedRule.value = filterObj.rule;
  selectedRuleTags.value = filterObj.ruleTags;
  selectedRulePackVersions.value = filterObj.rulePackVersions ?? [];
  currentPage.value = 1;
  allSelected.value = false;
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedDetailedFindings();
}

function fetchDistinctProjects() {
  RepositoryService.getDistinctProjects(selectedVcsProvider.value, selectedRepository.value)
    .then((response) => {
      projectNames.value = [];
      for (const projectKey of response.data) {
        projectNames.value.push(projectKey);
      }
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchDistinctRepositories() {
  RepositoryService.getDistinctRepositories(selectedVcsProvider.value, selectedProject.value)
    .then((response) => {
      repositoryNames.value = [];
      for (const repoName of response.data) {
        repositoryNames.value.push(repoName);
      }
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchRulePackVersionsWhenRedirectedFromRuleMetricsPage() {
  const store = useAuthUserStore();
  RulePackService.getRulePackVersions(10000, 0)
    .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
      rulePackVersions.value = [];
      selectedRulePackVersions.value = [];
      response.data.data.forEach((rulePack) => {
        rulePackVersions.value.push(rulePack);
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

onKeyStroke('?', () => !shouldIgnoreKeystroke() && showKeybindingHelp(), { eventName: 'keydown' });

onMounted(() => {
  if (isRedirectedFromRuleMetricsPage()) {
    fetchRulePackVersionsWhenRedirectedFromRuleMetricsPage();
  } else {
    const store = useAuthUserStore();
    store.update_previous_route_state(null);
    fetchRulePackVersions();
    fetchDistinctProjects();
    fetchDistinctRepositories();
  }
});
</script>
