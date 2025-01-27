<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">REPOSITORIES</h1>

    <RepositoriesPageFilter
      v-model:projectOptions="projectNames"
      v-model:repositoryOptions="repositoryNames"
      @on-filter-change="handleFilterChange"
    />

    <!--Repository Table -->
    <DataTable
      :value="repositoryList"
      size="small"
      :loading="repositoryList === undefined"
      v-model:selection="selection"
      selection-mode="single"
      :highlight-on-select="true"
      :dataKey="(data) => `${data.id_}`"
      @row-click="handleRowClicked"
      class="mt-8"
    >
      <Column field="project_key" header="Project" headerClass="bg-teal-500/20"></Column>
      <Column field="repository_name" header="Repository" headerClass="bg-teal-500/20">
        <template #body="slotProps">
          {{ slotProps.data.repository_name.slice(0, 20) }}
        </template>
      </Column>
      <Column field="vcs_provider" header="VCS Provider" headerClass="bg-teal-500/20">
        <template #body="slotProps">
          {{ CommonUtils.formatVcsProvider(slotProps.data.vcs_provider) }}
        </template>
      </Column>
      <Column field="last_scan_timestamp" header="Last Scan Date" headerClass="bg-teal-500/20">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.last_scan_timestamp) }}
        </template>
      </Column>
      <Column
        field="total_findings_count"
        header="Finding Counts"
        headerClass="bg-teal-500/20"
      ></Column>
      <Column
        field="findings"
        header="Findings(%)"
        bodyClass=" w-[36rem]"
        headerClass="bg-teal-500/20"
      >
        <template #body="slotProps">
          <HealthBar
            :truePositive="slotProps.data.true_positive"
            :falsePositive="slotProps.data.false_positive"
            :notAnalyzed="slotProps.data.not_analyzed"
            :notAccessible="slotProps.data.not_accessible"
            :clarificationRequired="slotProps.data.clarification_required"
            :outdated="slotProps.data.outdated"
            :totalCount="slotProps.data.total_findings_count"
          />
        </template>
      </Column>
    </DataTable>
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

<script setup lang="ts">
import CommonUtils from '@/utils/common-utils';
import DateUtils from '@/utils/date-utils';
import HealthBar from '@/components/Common/HealthBar.vue';
import RepositoryService from '@/services/repository-service';
import RepositoriesPageFilter from '@/components/Filters/RepositoriesPageFilter.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RepositoryEnrichedRead, VCSProviders } from '@/services/shema-to-types';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { dispatchError, PAGE_SIZES } from '@/configuration/config';
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import { usePaginator } from '@/composables/usePaginator';
import { useFetchers } from '@/composables/useFetchers';

const router = useRouter();

const repositoryList = ref<RepositoryEnrichedRead[] | undefined>(undefined);
const selection = ref<RepositoryEnrichedRead | undefined>(undefined);
const selectedIndex = ref<number | undefined>(undefined);

const { totalRows, currentPage, perPage } = usePaginator();

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

function formatDate(timestamp: string) {
  const date = DateUtils.formatDate(timestamp);
  return timestamp ? date : 'Not Scanned';
}

function handlePageClick(page: number) {
  currentPage.value = page;
  fetchPaginatedRepositories();
}

function handlePageSizeChange(pageSize: number) {
  perPage.value = pageSize;
  currentPage.value = 0;
  fetchPaginatedRepositories();
}

function handleRowClicked(event: DataTableRowClickEvent) {
  selectedIndex.value = event.index;
  goToScanFindings();
}

function goToScanFindings() {
  if (selection.value?.last_scan_id) {
    const routeData = router.resolve({
      name: 'ScanFindings',
      params: { scanId: selection.value.last_scan_id },
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
  currentPage.value = 0;
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedRepositories();
}

function fetchPaginatedRepositories() {
  repositoryList.value = undefined;
  RepositoryService.getRepositoriesWithFindingsMetadata(
    perPage.value,
    currentPage.value,
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
    })
    .catch(dispatchError);
}

function selectUp(): boolean {
  if (!repositoryList.value) {
    return false;
  }

  selectedIndex.value = Math.max(0, (selectedIndex.value ?? 1) - 1);
  selection.value = repositoryList.value[selectedIndex.value];
  return true;
}

function selectDown(): boolean {
  if (!repositoryList.value) {
    return false;
  }

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % repositoryList.value.length;
  selection.value = repositoryList.value[selectedIndex.value];
  return true;
}

/* istanbul ignore next @preserve */
onKeyStroke('r', () => !shouldIgnoreKeystroke() && fetchPaginatedRepositories(), {
  eventName: 'keydown',
});

/* istanbul ignore next @preserve */
onKeyStroke(['ArrowDown', 'j', 'J'], () => !shouldIgnoreKeystroke() && selectDown(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke(['ArrowUp', 'k', 'K'], () => !shouldIgnoreKeystroke() && selectUp(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('o', () => !shouldIgnoreKeystroke() && goToScanFindings(), { eventName: 'keydown' });

onMounted(() => {
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedRepositories();
});
</script>
