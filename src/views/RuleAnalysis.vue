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

    <div class="ml-3">
      <!-- Button to audit multiple findings -->
      <b-button
        class="float-left mt-2 mb-2"
        variant="primary"
        size="sm"
        v-on:click="showAuditModal()"
        :disabled="auditButtonDisabled"
        >AUDIT</b-button
      >
      <!-- Audit Modal -->
      <AuditModal
        ref="auditModal"
        :selectedCheckBoxIds="selectedCheckBoxIds"
        @update-audit="updateAudit"
      />
    </div>

    <!--Scan Findings Table -->
    <div v-if="!hasRecords && loadedData" class="text-center cursor-default">
      <br />
      <br />No Record Found...
    </div>

    <!-- sticky-header="85vh" -->
    <div class="p-3" v-if="hasRecords">
      <b-table
        ref="auditTable"
        id="rule-analysis-table"
        :sticky-header="true"
        :items="findingList"
        :fields="fields"
        :current-page="1"
        :per-page="0"
        :selectable="true"
        :select-mode="'single'"
        primary-key="id_"
        responsive
        small
        head-variant="light"
        @row-clicked="toggleFindingDetails"
      >
        <!-- Select all checkboxes -->
        <template #head(select)>
          <b-form-checkbox
            class="checkbox"
            v-model="allSelected"
            @change="selectAllCheckboxes"
          ></b-form-checkbox>
        </template>

        <!-- Selection checkboxes -->
        <template #cell(select)="data">
          <b-form-checkbox
            class="checkbox"
            v-model="selectedCheckBoxIds"
            :value="(data.item as DetailedFindingRead).id_"
            @change="selectSingleCheckbox"
          ></b-form-checkbox>
          <template v-if="data.item.rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>

        <!-- Collapse Icon Column -->
        <template v-slot:cell(toggle_row)="{ detailsShowing }">
          <FontAwesomeIcon
            size="lg"
            class="collapse-arrow"
            name="dropdown-icon"
            icon="angle-right"
            :rotation="detailsShowing ? 90 : undefined"
          />
        </template>

        <!-- Path Column -->
        <template #cell(file_path)="data">
          <span
            :title="(data.item as DetailedFindingRead).file_path"
            class="span-path text-truncate"
            >{{ (data.item as DetailedFindingRead).file_path }}</span
          >
        </template>

        <!-- Line Column -->
        <template #cell(line_number)="data">
          {{ (data.item as DetailedFindingRead).line_number }}
        </template>

        <!-- Status Column -->
        <template #cell(status)="data">
          <FindingStatusBadge
            :status="(data.item as DetailedFindingRead).status ?? 'NOT_ANALYZED'"
          />
        </template>

        <!-- Remaining Columns (Rule) -->
        <template #cell()="data">
          {{ data.value }}
        </template>

        <!-- Expand Table Row To Display Finding Panel -->
        <template v-slot:row-details="{ item }">
          <FindingPanel
            :finding="item as DetailedFindingRead"
            :repository="{
              project_key: item.project_key,
              repository_name: item.repository_name,
              repository_url: item.repository_url,
              vcs_provider: item.vcs_provider,
            }"
          ></FindingPanel>
        </template>
      </b-table>

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
import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import KeybindingModal from '@/components/Help/KeybindingModal.vue';
import Config from '@/configuration/config';
import AxiosConfig from '@/configuration/axios-config';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import FindingsService, { type QueryFilterType } from '@/services/findings-service';
import FindingStatusBadge from '@/components/Common/FindingStatusBadge.vue';
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/common-utils';

type TableItemDetailedFindingRead = DetailedFindingRead & TableItem;

const loadedData = ref(false);
const keybindingModal = ref();
const auditModal = ref();
const auditTable = ref();

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
const fields = ref([
  {
    key: 'select',
    label: '',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'toggle_row',
    label: '',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'project_key',
    sortable: true,
    label: 'Project',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'repository_name',
    sortable: true,
    label: 'Repository',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'rule_name',
    sortable: true,
    label: 'Rule',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'file_path',
    sortable: true,
    label: 'File Path',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'line_number',
    sortable: false,
    label: 'Line',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'status',
    sortable: true,
    label: 'Status',
    class: 'text-end position-sticky',
    thStyle: { borderTop: '0px' },
  },
]);

const hasRecords = computed(() => findingList.value.length > 0);
const skipRowCount = computed(() => (currentPage.value - 1) * perPage.value);
const auditButtonDisabled = computed(() => selectedCheckBoxIds.value.length <= 0);

const selectedIndex = ref(undefined as number | undefined);

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

function selectSingleCheckbox() {
  allSelected.value = false;
}

function selectAllCheckboxes() {
  selectedCheckBoxIds.value = [];
  if (allSelected.value) {
    for (const finding of findingList.value) {
      selectedCheckBoxIds.value.push(finding.id_);
    }
  }
}

function toggleAllCheckboxes() {
  selectedCheckBoxIds.value = [];
  allSelected.value = !allSelected.value;
  if (allSelected.value) {
    for (const finding of findingList.value) {
      selectedCheckBoxIds.value.push(finding.id_);
    }
  }
}

function showAuditModal() {
  auditModal.value.show();
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

function toggleFindingDetails(row: TableItem, index: number) {
  selectedIndex.value = index;

  if (row._showDetails) {
    row._showDetails = false;
  } else {
    closeAllDetails();
    row._showDetails = true;
  }
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

function updateAudit(status: FindingStatus, comment: string) {
  updateVisualBadge(selectedCheckBoxIds.value, status, comment);
  fetchPaginatedDetailedFindings();
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

function getCurrentFindingSelected(): TableItemDetailedFindingRead | undefined {
  if (selectedIndex.value === undefined) {
    return undefined;
  }

  return findingList.value[selectedIndex.value];
}

function selectDown(): boolean {
  const detailsStatus = getCurrentFindingSelected()?._showDetails;
  closeAllDetails();

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % perPage.value;
  auditTable.value.clearSelected();
  auditTable.value.selectRow(selectedIndex.value);

  (getCurrentFindingSelected() as TableItemDetailedFindingRead)._showDetails = detailsStatus;

  return true;
}

function selectUp(): boolean {
  const detailsStatus = getCurrentFindingSelected()?._showDetails;
  closeAllDetails();

  selectedIndex.value = Math.max(0, (selectedIndex.value ?? 1) - 1);
  auditTable.value.clearSelected();
  auditTable.value.selectRow(selectedIndex.value);

  (getCurrentFindingSelected() as TableItemDetailedFindingRead)._showDetails = detailsStatus;

  return true;
}

function closeAllDetails() {
  findingList.value.forEach((_item, idx, theArray) => {
    theArray[idx]._showDetails = false;
  });
}

function openDetails() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  item._showDetails = true;
}

function closeDetails() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  item._showDetails = false;
}

function openCommitUrl() {
  const url = getCurrentFindingSelected()?.commit_url;
  if (url !== undefined) {
    window.open(url, '_blank')?.focus();
  }
}

function toggleSelect() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  const index = selectedCheckBoxIds.value.indexOf(item.id_);
  if (index === -1) {
    selectedCheckBoxIds.value.push(item.id_);
  } else {
    selectedCheckBoxIds.value.splice(index, 1);
  }
}

function markAsFalsePositive() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  sendUpdate([item.id_], 'FALSE_POSITIVE');
  selectDown();
}

function markAsTruePositive() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  sendUpdate([item.id_], 'TRUE_POSITIVE');
  selectDown();
}

function markAllAsFalsePositive() {
  sendUpdate(selectedCheckBoxIds.value, 'FALSE_POSITIVE');
}

function markAllAsTruePositive() {
  sendUpdate(selectedCheckBoxIds.value, 'TRUE_POSITIVE');
}

function auditThis() {
  if (selectedCheckBoxIds.value.length > 0) {
    showAuditModal();
    return;
  }

  openDetails();
}

function sendUpdate(selectedIds: number[], status: FindingStatus) {
  FindingsService.auditFindings(selectedIds, status, '')
    .then(() => {
      updateVisualBadge(selectedIds, status);
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
      return false;
    });
}

function updateVisualBadge(selectedIds: number[], status: FindingStatus, comment: string = '') {
  findingList.value.forEach((finding: DetailedFindingRead, idx, theArray) => {
    if (selectedIds.includes(finding.id_)) {
      theArray[idx].status = status;
      theArray[idx].comment = comment;
    }
  });

  if (selectedIds.length > 1) {
    selectedCheckBoxIds.value = [];
    allSelected.value = false;
    return;
  }

  const index = selectedCheckBoxIds.value.indexOf(selectedIds[0]);
  if (index !== -1) {
    selectedCheckBoxIds.value.splice(index, 1);
  }
}

onKeyStroke('ArrowLeft', () => !shouldIgnoreKeystroke() && closeDetails(), {
  eventName: 'keydown',
});
onKeyStroke('ArrowRight', () => !shouldIgnoreKeystroke() && openDetails(), {
  eventName: 'keydown',
});
onKeyStroke(
  'ArrowDown',
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectDown() && e.shiftKey && toggleSelect(),
  { eventName: 'keydown' },
);
onKeyStroke(
  'ArrowUp',
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectUp() && e.shiftKey && toggleSelect(),
  { eventName: 'keydown' },
);
onKeyStroke('o', () => !shouldIgnoreKeystroke() && openCommitUrl(), { eventName: 'keydown' });
onKeyStroke('f', () => !shouldIgnoreKeystroke() && markAsFalsePositive(), {
  eventName: 'keydown',
});
onKeyStroke('F', () => !shouldIgnoreKeystroke() && markAllAsFalsePositive(), {
  eventName: 'keydown',
});
onKeyStroke('t', () => !shouldIgnoreKeystroke() && markAsTruePositive(), {
  eventName: 'keydown',
});
onKeyStroke('T', () => !shouldIgnoreKeystroke() && markAllAsTruePositive(), {
  eventName: 'keydown',
});
onKeyStroke('a', (e: KeyboardEvent) => !shouldIgnoreKeystroke() && !e.ctrlKey && auditThis(), {
  eventName: 'keydown',
});
onKeyStroke(' ', () => !shouldIgnoreKeystroke() && toggleSelect(), { eventName: 'keydown' });
onKeyStroke('?', () => !shouldIgnoreKeystroke() && showKeybindingHelp(), { eventName: 'keydown' });
onKeyStroke(
  'a',
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && e.ctrlKey && toggleAllCheckboxes(),
  { eventName: 'keydown' },
);

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
