<template>
  <div class="mx-4">
    <!-- Page Title -->
    <div class="col-md-2 pt-2 text-start page-title">
      <h3><small class="text-nowrap">REPOSITORIES</small></h3>
    </div>

    <SpinnerVue v-if="!loadedData" />

    <!--Repository Filters -->
    <div class="ml-3 mt-4">
      <RepositoriesPageFilter
        v-model:projectOptions="projectNames"
        v-model:repositoryOptions="repositoryNames"
        @on-filter-change="handleFilterChange"
      ></RepositoriesPageFilter>
    </div>

    <!--Repository Table -->
    <div v-if="!hasRecords && loadedData" class="text-center cursor-default">
      <br />
      <br />No Record Found...
    </div>

    <div class="p-3" v-if="hasRecords">
      <BTable
        id="repositories-table"
        :items="repositoryList"
        :fields="fields"
        :current-page="1"
        :per-page="0"
        primary-key="id_"
        v-model="currentItems"
        responsive
        small
        head-variant="light"
        :tbody-tr-class="rowClass"
        @row-clicked="goToScanFindings"
      >
        <!-- Repository Column -->
        <template #cell(repository_name)="data">
          {{ (data.item as RepositoryEnrichedRead).repository_name }}
        </template>

        <template #cell(vcs_provider)="data">
          {{ formatVcsProvider((data.item as RepositoryEnrichedRead).vcs_provider) }}
        </template>

        <template #cell(last_scan_timestamp)="data">
          {{ formatDate((data.item as RepositoryEnrichedRead).last_scan_timestamp ?? '') }}
        </template>

        <!-- Health Bar Column -->
        <template #cell(findings)="data">
          <HealthBar
            :truePositive="(data.item as RepositoryEnrichedRead).true_positive"
            :falsePositive="(data.item as RepositoryEnrichedRead).false_positive"
            :notAnalyzed="(data.item as RepositoryEnrichedRead).not_analyzed"
            :notAccessible="(data.item as RepositoryEnrichedRead).not_accessible"
            :clarificationRequired="(data.item as RepositoryEnrichedRead).clarification_required"
            :outdated="(data.item as RepositoryEnrichedRead).outdated"
            :totalCount="(data.item as RepositoryEnrichedRead).total_findings_count"
          />
        </template>
      </BTable>

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

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import Config from '@/configuration/config';
import CommonUtils from '@/utils/common-utils';
import DateUtils from '@/utils/date-utils';
import HealthBar from '@/components/Common/HealthBar.vue';
import Pagination from '@/components/Common/PaginationVue.vue';
import RepositoryService from '@/services/repository-service';
import RepositoriesPageFilter from '@/components/Filters/RepositoriesPageFilter.vue';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RepositoryEnrichedRead, VCSProviders } from '@/services/shema-to-types';
import { BTable, type TableItem } from 'bootstrap-vue-next';

const loadedData = ref(false);
const router = useRouter();

type TableRepositoryEnrichedRead = RepositoryEnrichedRead & TableItem;

const repositoryList = ref([] as TableRepositoryEnrichedRead[]);
const currentItems = ref([] as TableRepositoryEnrichedRead[]);
const totalRows = ref(0);
const currentPage = ref(1);
const perPage = ref(Number(`${Config.value('defaultPageSize')}`));
const pageSizes = ref([20, 50, 100, 1000]);
const requestedPageNumber = ref(1);
const vcsFilter = ref([] as VCSProviders[]);
const repositoryFilter = ref(undefined as string | undefined);
const projectFilter = ref(undefined as string | undefined);
const projectNames = ref([] as string[]);
const repositoryNames = ref([] as string[]);
const includeZeroFindingRepos = ref(false);
const includeDeletedRepositories = ref(false);
const onlyIfHasUntriagedFindings = ref(false);
const fields = ref([
  {
    key: 'project_key',
    sortable: false,
    label: 'Project',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px', width: '10%' },
  },
  {
    key: 'repository_name',
    sortable: false,
    label: 'Repository',
    class: 'text-start position-sticky text-truncate',
    thStyle: { borderTop: '0px', width: '20%' },
  },
  {
    key: 'vcs_provider',
    sortable: false,
    label: 'VCS Provider',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px', width: '10%' },
  },
  {
    key: 'last_scan_timestamp',
    sortable: false,
    label: 'Last Scan Date',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px', width: '20%' },
  },
  {
    key: 'total_findings_count',
    sortable: false,
    label: 'Findings Count',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px', width: '15%' },
  },
  {
    key: 'findings',
    label: 'Findings(%)',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px', width: '25%' },
  },
]);

const hasRecords = computed(() => {
  return repositoryList.value.length > 0;
});

const skipRowCount = computed(() => {
  return (currentPage.value - 1) * perPage.value;
});

function rowClass(item: RepositoryEnrichedRead) {
  return item.last_scan_id ? 'row-clickable' : 'row-unclickable';
}

function formatDate(timestamp: string) {
  const date = DateUtils.formatDate(timestamp);
  return timestamp ? date : 'Not Scanned';
}

function formatVcsProvider(vcsProvider: VCSProviders) {
  return CommonUtils.formatVcsProvider(vcsProvider);
}

function handlePageClick(page: number) {
  currentPage.value = page;
  fetchPaginatedRepositories();
}

function handlePageSizeChange(pageSize: number) {
  perPage.value = Number(pageSize);
  currentPage.value = 1;
  fetchPaginatedRepositories();
}

function goToScanFindings(record: TableItem) {
  // Casting back to RepositoryEnrichedRead
  const recordItem = record as RepositoryEnrichedRead;
  if (recordItem.last_scan_id) {
    const routeData = router.resolve({
      name: 'ScanFindings',
      params: { scanId: recordItem.last_scan_id },
    });
    window.open(routeData.href, '_blank');
  }
}

function handleFilterChange(
  vcsProvider: VCSProviders[],
  project: string | undefined,
  repository: string | undefined,
  includeZeroFindingReposArg: boolean,
  includeDeletedRepositoriesArg: boolean,
  onlyIfHasUntriagedFindingsArg: boolean,
) {
  vcsFilter.value = vcsProvider;
  projectFilter.value = project;
  repositoryFilter.value = repository;
  includeZeroFindingRepos.value = includeZeroFindingReposArg;
  includeDeletedRepositories.value = includeDeletedRepositoriesArg;
  onlyIfHasUntriagedFindings.value = onlyIfHasUntriagedFindingsArg;
  currentPage.value = 1;
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedRepositories();
}

function fetchPaginatedRepositories() {
  repositoryList.value = [];
  loadedData.value = false;
  RepositoryService.getRepositoriesWithFindingsMetadata(
    perPage.value,
    skipRowCount.value,
    vcsFilter.value,
    projectFilter.value,
    repositoryFilter.value,
    includeZeroFindingRepos.value,
    includeDeletedRepositories.value,
    onlyIfHasUntriagedFindings.value,
  )
    .then((response) => {
      totalRows.value = response.data.total;
      repositoryList.value = response.data.data;
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

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
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
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
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

onMounted(() => {
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedRepositories();
});
</script>
