<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">SCAN FINDINGS</h1>

    <RepositoryPanel
      v-if="repository && vcsInstance"
      :repository="repository"
      :vcs-instance="vcsInstance"
      @on-delete-at-change="fetchPaginatedFindingsByScanId"
    >
    </RepositoryPanel>

    <!-- Filters -->
    <ScanFindingsFilter
      v-if="repository"
      :repository="repository"
      @on-filter-change="handleFilterChange"
      @previous-scans-checked="onPreviousScanChecked"
      @include-previous-scans="displayPreviousScans"
    ></ScanFindingsFilter>

    <FindingsTable
      :findings="findingList"
      :is-rule-finding="false"
      @refresh-table="fetchPaginatedFindingsByScanId"
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

<script setup lang="ts">
import RepositoryPanel from '@/components/ScanFindings/RepositoryPanel.vue';
import ScanFindingsFilter from '@/components/Filters/ScanFindingsFilter.vue';
import ScanFindingsService from '@/services/scan-findings-service';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import VCSInstanceService from '@/services/vcs-instance-service';
import { onMounted, ref } from 'vue';
import type {
  DetailedFindingRead,
  ScanRead,
  PaginationType,
  RepositoryRead,
  VCSInstanceRead,
  AugmentedDetailedFindingRead,
} from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import { useAuthUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { dispatchError, PAGE_SIZES } from '@/configuration/config';
import Paginator from 'primevue/paginator';
import { usePaginator } from '@/composables/usePaginator';

type Props = {
  scanId: string;
};

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } =
  usePaginator(fetchPaginatedData);

const props = defineProps<Props>();
const previousScanChecked = ref(false);
const scanType = ref<string | undefined>(undefined);
const previousScanList = ref<ScanRead[]>([]);
const incrementNumber = ref<number | undefined>(undefined);
const repositoryId = ref<number | null>(null);
const repository = ref<RepositoryRead | undefined>(undefined);
const vcsInstance = ref<VCSInstanceRead | undefined>(undefined);
const selectedCheckBoxIds = ref<number[]>([]);
const allSelected = ref(false);
const findingList = ref<AugmentedDetailedFindingRead[] | undefined>(undefined);
const selectedScanID = ref(Number(props.scanId));
const ruleFilter = ref<string[]>([]);
const ruleTagsFilter = ref<string[] | undefined>(undefined);

const store = useAuthUserStore();
const { selectedStatus } = storeToRefs(store);

function onPreviousScanChecked(checked: boolean) {
  previousScanChecked.value = checked;
}

function fetchPaginatedData() {
  previousScanChecked.value ? fetchPreviousScanFindings() : fetchPaginatedFindingsByScanId();
}

function fetchVCSInstance() {
  if (repository.value === undefined) {
    return;
  }

  VCSInstanceService.getVCSInstance(repository.value.vcs_instance)
    .then((res: AxiosResponse<VCSInstanceRead>) => {
      vcsInstance.value = res.data;
    })
    .catch(dispatchError);
}

function fetchRepository() {
  if (repositoryId.value === null) {
    return;
  }

  ScanFindingsService.getRepositoryById(repositoryId.value)
    .then((response: AxiosResponse<RepositoryRead>) => {
      repository.value = response.data;
      fetchVCSInstance();
    })
    .catch(dispatchError);
}

function fetchScan() {
  selectedScanID.value = Number(props.scanId);
  ScanFindingsService.getScanById(selectedScanID.value)
    .then((response: AxiosResponse<ScanRead>) => {
      repositoryId.value = response.data.repository_id;
      scanType.value = response.data.scan_type ?? '';
      incrementNumber.value = response.data.increment_number;
      fetchRepository();
    })
    .catch(dispatchError);
}

function fetchPaginatedFindingsByScanId() {
  ScanFindingsService.getScanById(selectedScanID.value)
    .then((response: AxiosResponse<ScanRead>) => {
      scanType.value = response.data.scan_type;
      incrementNumber.value = response.data.increment_number;
    })
    .catch(dispatchError);

  const filterObj: QueryFilterType = {
    skip: currentPage.value,
    limit: perPage.value,
    scanIds: [selectedScanID.value],
    findingStatus: selectedStatus.value.map((s) => s.value),
    rule: ruleFilter.value,
    ruleTags: ruleTagsFilter.value,
    includeDeletedRepositories: true,
  };

  FindingsService.getDetailedFindings(filterObj)
    .then((response: AxiosResponse<PaginationType<DetailedFindingRead>>) => {
      totalRows.value = 0;
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
      addScanTypeTagForSingleScan();
    })
    .catch(dispatchError);
}

function addScanTypeTagForSingleScan() {
  if (findingList.value === undefined) {
    return;
  }

  findingList.value.forEach((_finding, idx, theArray) => {
    theArray[idx].scanType = scanType.value;
    theArray[idx].incrementNumber = incrementNumber.value;
  });
}

function handleFilterChange(scanId: number, rule: string[], ruleTags: string[]) {
  selectedScanID.value = scanId;
  ruleFilter.value = rule;
  ruleTagsFilter.value = ruleTags;
  currentPage.value = 0;
  allSelected.value = false;
  fetchPaginatedFindingsByScanId();
}

function displayPreviousScans(
  rule: string[],
  ruleTags: string[],
  previousScanListUpdate: ScanRead[],
) {
  currentPage.value = 0;
  allSelected.value = false;
  previousScanList.value = previousScanListUpdate;
  ruleFilter.value = rule;
  ruleTagsFilter.value = ruleTags;
  fetchPreviousScanFindings();
}

function fetchPreviousScanFindings() {
  const previousScanIds = [];
  for (const scan of previousScanList.value) {
    previousScanIds.push(scan.id_);
  }

  const filterObj: QueryFilterType = {
    skip: currentPage.value,
    limit: perPage.value,
    scanIds: previousScanIds,
    findingStatus: selectedStatus.value.map((s) => s.value),
    rule: ruleFilter.value,
    ruleTags: ruleTagsFilter.value,
    includeDeletedRepositories: true,
  };

  FindingsService.getDetailedFindings(filterObj)
    .then((response) => {
      totalRows.value = 0;
      findingList.value = [];
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
      addScanTypeTagForMultipleScans();
    })
    .catch(dispatchError);
}

function addScanTypeTagForMultipleScans() {
  if (findingList.value === undefined) {
    return;
  }

  previousScanList.value.forEach((scan) => {
    // @ts-expect-error
    findingList.value.forEach((finding, idx, theArray) => {
      if (scan.id_ === finding.scan_id) {
        theArray[idx].scanType = scan.scan_type;
        theArray[idx].incrementNumber = scan.increment_number;
      }
    });
  });
}

onMounted(fetchScan);
</script>
