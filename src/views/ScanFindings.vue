<template>
  <div class="mx-4">
    <!-- Page Title -->
    <div class="col-md-2 pt-2 text-start page-title">
      <h3><small class="text-nowrap">SCAN FINDINGS</small></h3>
    </div>

    <SpinnerVue v-if="!loadedData" />

    <!-- Repository Panel -->
    <div class="col-md-6 ms-2 mt-4 text-start" v-if="loadedRepoData">
      <RepositoryPanel
        :repository="repository"
        :vcs_instance="vcsInstance"
        @on-delete-at-change="fetchPaginatedFindingsByScanId"
      >
      </RepositoryPanel>
    </div>

    <div>
      <!-- Filters -->
      <ScanFindingsFilter
        :repository="repository"
        @on-filter-change="handleFilterChange"
        @previous-scans-checked="onPreviousScanChecked"
        @include-previous-scans="displayPreviousScans"
      ></ScanFindingsFilter>
    </div>

    <!--Scan Findings Table -->
    <div v-if="!hasRecords && loadedData" class="text-center cursor-default">
      <br />
      <br />No Record Found...
    </div>

    <FindingsTable
      :findings="findingList"
      :is_rule_finding="false"
      v-if="hasRecords"
      @refresh-table="fetchPaginatedFindingsByScanId"
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
      ></Pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import Config from '@/configuration/config';
import Pagination from '@/components/Common/PaginationVue.vue';
import RepositoryPanel from '@/components/ScanFindings/RepositoryPanel.vue';
import ScanFindingsFilter from '@/components/Filters/ScanFindingsFilter.vue';
import ScanFindingsService from '@/services/scan-findings-service';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import VCSInstanceService from '@/services/vcs-instance-service';
import { computed, ref, type Ref } from 'vue';
import type {
  DetailedFindingRead,
  ScanRead,
  PaginationType,
  RepositoryRead,
  VCSInstanceRead,
  FindingStatus,
  AugmentedDetailedFindingRead,
} from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import type { TableItem } from 'bootstrap-vue-next';

const loadedData = ref(false);
const loadedRepoData = ref(false);

type Props = {
  scanId: string;
};

type TableItemAugmentedDetailedFindingRead = AugmentedDetailedFindingRead & TableItem;

const props = defineProps<Props>();
const previousScanChecked = ref(false);
const scanType = ref(undefined) as Ref<string | undefined>;
const previousScanList = ref([] as ScanRead[]);
const incrementNumber = ref(undefined) as Ref<number | undefined>;
const repositoryId = ref(null) as Ref<number | null>;
const repository = ref({} as RepositoryRead);
const vcsInstance = ref({} as VCSInstanceRead);
const selectedCheckBoxIds = ref([] as number[]);
const allSelected = ref(false);
const findingList = ref([] as TableItemAugmentedDetailedFindingRead[]);
const selectedScanID = ref(Number(props.scanId));
const ruleFilter = ref([] as string[]);
const ruleTagsFilter = ref(undefined) as Ref<string[] | undefined>;
const statusFilter = ref(undefined) as Ref<FindingStatus[] | undefined>;
const totalRows = ref(0);
const currentPage = ref(1);
const perPage = ref(Number(`${Config.value('defaultPageSize')}`));
const pageSizes = ref([20, 50, 100, 1000]);
const requestedPageNumber = ref(1);
const includeDeletedRepositories = ref(false);

const hasRecords = computed(() => findingList.value.length > 0);
const skipRowCount = computed(() => (currentPage.value - 1) * perPage.value);

function onPreviousScanChecked(checked: boolean) {
  previousScanChecked.value = checked;
}

function handlePageClick(page: number) {
  allSelected.value = false;
  currentPage.value = page;
  previousScanChecked.value ? fetchPreviousScanFindings() : fetchPaginatedFindingsByScanId();
}

function handlePageSizeChange(pageSize: number) {
  perPage.value = pageSize;
  currentPage.value = 1;
  previousScanChecked.value ? fetchPreviousScanFindings() : fetchPaginatedFindingsByScanId();
}

function fetchVCSInstance() {
  VCSInstanceService.getVCSInstance(repository.value.vcs_instance)
    .then((res: AxiosResponse<VCSInstanceRead>) => {
      vcsInstance.value = res.data;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchRepository() {
  if (repositoryId.value === null) {
    return;
  }

  ScanFindingsService.getRepositoryById(repositoryId.value)
    .then((response: AxiosResponse<RepositoryRead>) => {
      repository.value = response.data;
      fetchVCSInstance();
      loadedRepoData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchScan() {
  loadedData.value = false;
  selectedScanID.value = Number(props.scanId);
  ScanFindingsService.getScanById(selectedScanID.value)
    .then((response: AxiosResponse<ScanRead>) => {
      repositoryId.value = response.data.repository_id;
      scanType.value = response.data.scan_type ?? '';
      incrementNumber.value = response.data.increment_number;
      fetchRepository();
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchPaginatedFindingsByScanId() {
  loadedData.value = false;
  ScanFindingsService.getScanById(selectedScanID.value)
    .then((response: AxiosResponse<ScanRead>) => {
      scanType.value = response.data.scan_type;
      incrementNumber.value = response.data.increment_number;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });

  const filterObj: QueryFilterType = {
    skip: skipRowCount.value,
    limit: perPage.value,
    scanIds: [selectedScanID.value],
    findingStatus: statusFilter.value,
    rule: ruleFilter.value,
    ruleTags: ruleTagsFilter.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };

  FindingsService.getDetailedFindings(filterObj)
    .then((response: AxiosResponse<PaginationType<DetailedFindingRead>>) => {
      totalRows.value = 0;
      findingList.value = [];
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
      addScanTypeTagForSingleScan();
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function addScanTypeTagForSingleScan() {
  findingList.value.forEach((_finding, idx, theArray) => {
    theArray[idx].scanType = scanType.value;
    theArray[idx].incrementNumber = incrementNumber.value;
  });
}

function handleFilterChange(
  scanId: number,
  rule: string[],
  status: FindingStatus[],
  ruleTags: string[],
) {
  selectedScanID.value = scanId;
  ruleFilter.value = rule;
  ruleTagsFilter.value = ruleTags;
  statusFilter.value = status;
  currentPage.value = 1;
  allSelected.value = false;
  fetchPaginatedFindingsByScanId();
}

function displayPreviousScans(
  rule: string[],
  ruleTags: string[],
  status: FindingStatus[],
  previousScanListUpdate: ScanRead[],
) {
  currentPage.value = 1;
  allSelected.value = false;
  previousScanList.value = previousScanListUpdate;
  ruleFilter.value = rule;
  ruleTagsFilter.value = ruleTags;
  statusFilter.value = status;
  fetchPreviousScanFindings();
}

function fetchPreviousScanFindings() {
  const previousScanIds = [];
  for (const scan of previousScanList.value) {
    previousScanIds.push(scan.id_);
  }

  loadedData.value = false;

  const filterObj: QueryFilterType = {
    skip: skipRowCount.value,
    limit: perPage.value,
    scanIds: previousScanIds,
    findingStatus: statusFilter.value,
    rule: ruleFilter.value,
    ruleTags: ruleTagsFilter.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };

  FindingsService.getDetailedFindings(filterObj)
    .then((response) => {
      totalRows.value = 0;
      findingList.value = [];
      selectedCheckBoxIds.value = [];
      totalRows.value = response.data.total;
      findingList.value = response.data.data;
      addScanTypeTagForMultipleScans();
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function addScanTypeTagForMultipleScans() {
  previousScanList.value.forEach((scan) => {
    findingList.value.forEach((finding, idx, theArray) => {
      if (scan.id_ === finding.scan_id) {
        theArray[idx].scanType = scan.scan_type;
        theArray[idx].incrementNumber = scan.increment_number;
      }
    });
  });
}

fetchScan();
</script>
