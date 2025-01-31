<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">REPOSITORIES</h1>

    <RepositoriesPageFilter
      v-model:projectOptions="projectNames"
      v-model:repositoryOptions="repositoryNames"
      @on-filter-change="handleFilterChange"
    />

    <Panel :pt:header:class="'hidden'" class="mt-2 pt-[1.125rem]">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-teal-500/20 text-lg">
            <th class="pl-2">Project</th>
            <th>Repository</th>
            <th>VCS Provider</th>
            <th>Last Scan Date</th>
            <th>Findings Count</th>
            <th class="w-36 md:w-48 xl:w-72">Findings (%)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="repositoryList === undefined">
            <tr>
              <td colspan="5" class="text-center p-4">
                <i class="pi pi-spin pi-spinner mr-2"></i> Loading data...
              </td>
            </tr>
          </template>
          <tr
            v-else
            v-for="(data, idx) in repositoryList"
            :key="`${data.repository_id}`"
            :class="{
              'bg-teal-450/10': selectedIndex === idx,
              'hover:bg-teal-450/5': true,
            }"
            @click="handleRowClicked(idx)"

            >
            <td class="pl-2">{{ data.project_key }}</td>
            <td>{{ data.repository_name.slice(0,20) }}</td>
            <td>{{ CommonUtils.formatVcsProvider(data.vcs_provider) }}</td>
            <td>{{ data.last_scan_timestamp ? DateUtils.formatDate(data.last_scan_timestamp) : 'Not scanned' }}</td>
            <td>{{ data.total_findings_count }}</td>
            <td>
              <HealthBar
                :truePositive="data.true_positive"
                :falsePositive="data.false_positive"
                :notAnalyzed="data.not_analyzed"
                :notAccessible="data.not_accessible"
                :clarificationRequired="data.clarification_required"
                :outdated="data.outdated"
                :totalCount="data.total_findings_count"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
    <!--Repository Table -->
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
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { RepositoryEnrichedRead, VCSProviders } from '@/services/shema-to-types';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { dispatchError, PAGE_SIZES } from '@/configuration/config';
import Paginator from 'primevue/paginator';
import { usePaginator } from '@/composables/usePaginator';
import { useFetchers } from '@/composables/useFetchers';
import Panel from 'primevue/panel';

const router = useRouter();

const repositoryList = ref<RepositoryEnrichedRead[] | undefined>(undefined);
const selectedIndex = ref<number | undefined>(undefined);
const selection = computed(() => !repositoryList.value ? undefined : repositoryList.value[selectedIndex.value ?? 0]);

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } = usePaginator(
  fetchPaginatedRepositories,
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

function handleRowClicked(idx: number) {
  selectedIndex.value = idx;
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
  return true;
}

function selectDown(): boolean {
  if (!repositoryList.value) {
    return false;
  }

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % repositoryList.value.length;
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
onKeyStroke(['o','Enter'], () => !shouldIgnoreKeystroke() && goToScanFindings(), { eventName: 'keydown' });

onMounted(() => {
  fetchDistinctProjects();
  fetchDistinctRepositories();
  fetchPaginatedRepositories();
});
</script>
