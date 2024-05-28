<template>
  <div class="ml-3">
    <!-- Button to audit multiple findings -->
    <b-button
      class="float-left mt-2 mb-2"
      variant="primary"
      size="sm"
      id="AuditButton"
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

  <div class="py-3">
    <b-table
      ref="auditTable"
      id="rule-analysis-table"
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
          id="allSelected"
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
          :value="data.item.id_"
          @change="selectSingleCheckbox"
        ></b-form-checkbox>
        <template v-if="data.item.rowSelected">
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
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
        <span :title="data.item.file_path" class="span-path text-truncate">{{
          data.item.file_path
        }}</span>
      </template>

      <!-- Line Column -->
      <template #cell(line_number)="data">
        {{ data.item.line_number }}
      </template>

      <!-- Status Column -->
      <template #cell(status)="data">
        <FindingStatusBadge :status="data.item.status ?? 'NOT_ANALYZED'" />
      </template>

      <!-- Remaining Columns (Rule) -->
      <template #cell()="data">
        {{ data.value }}
      </template>

      <!-- Expand Table Row To Display Finding Panel -->
      <template v-slot:row-details="data">
        <FindingPanel
          :finding="data.item"
          :repository="{
            project_key: data.item.project_key,
            repository_name: data.item.repository_name,
            repository_url: data.item.repository_url,
            vcs_provider: data.item.vcs_provider,
          }"
        ></FindingPanel>
      </template>
    </b-table>
  </div>
</template>
<script lang="ts" setup>
import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
import type { TableItem } from 'bootstrap-vue-next';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FindingsService from '@/services/findings-service';
import AxiosConfig from '@/configuration/axios-config';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { computed, ref } from 'vue';
import { watch } from 'vue';
import { BTable, BFormCheckbox, BButton } from 'bootstrap-vue-next';

type TableItemDetailedFindingRead = DetailedFindingRead & TableItem;

type Props = {
  findings: DetailedFindingRead[];
  is_rule_finding: boolean;
};

const props = defineProps<Props>();

const auditModal = ref();
const auditTable = ref();

const findingList = ref(props.findings as TableItemDetailedFindingRead[]);
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
    sortable: false,
    label: 'Project',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'repository_name',
    sortable: false,
    label: 'Repository',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'rule_name',
    sortable: false,
    label: 'Rule',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'file_path',
    sortable: false,
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
    sortable: false,
    label: 'Status',
    class: 'text-end position-sticky',
    thStyle: { borderTop: '0px' },
  },
]);

if (!props.is_rule_finding) {
  // remove project_key
  // remove repository_name
  fields.value.splice(2, 2);
  fields.value.push({
    key: 'scanType',
    sortable: false,
    label: 'Scan Type',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  });
}

const auditButtonDisabled = computed(() => selectedCheckBoxIds.value.length <= 0);
const selectedIndex = ref(undefined as number | undefined);
const emit = defineEmits(['refresh-table']);

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

function updateAudit(status: FindingStatus, comment: string) {
  updateVisualBadge(selectedCheckBoxIds.value, status, comment);
  emit('refresh-table');
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

function toggleFindingDetails(row: TableItem, index: number) {
  selectedIndex.value = index;

  if (row._showDetails) {
    row._showDetails = false;
  } else {
    closeAllDetails();
    row._showDetails = true;
  }
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

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % props.findings.length;
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

function markAsGone() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  sendUpdate([item.id_], 'NOT_ACCESSIBLE');
  selectDown();
}

function markAllAsFalsePositive() {
  sendUpdate(selectedCheckBoxIds.value, 'FALSE_POSITIVE');
}

function markAllAsTruePositive() {
  sendUpdate(selectedCheckBoxIds.value, 'TRUE_POSITIVE');
}

function markAllAsGone() {
  sendUpdate(selectedCheckBoxIds.value, 'NOT_ACCESSIBLE');
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

/* istanbul ignore next @preserve */
onKeyStroke(['ArrowLeft', 'h', 'H'], () => !shouldIgnoreKeystroke() && closeDetails(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke(['ArrowRight', 'l', 'L'], () => !shouldIgnoreKeystroke() && openDetails(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke(
  ['ArrowDown', 'j', 'J'],
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectDown() && e.shiftKey && toggleSelect(),
  { eventName: 'keydown' },
);
/* istanbul ignore next @preserve */
onKeyStroke(
  ['ArrowUp', 'k', 'K'],
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectUp() && e.shiftKey && toggleSelect(),
  { eventName: 'keydown' },
);

/* istanbul ignore next @preserve */
onKeyStroke('o', () => !shouldIgnoreKeystroke() && openCommitUrl(), { eventName: 'keydown' });
/* istanbul ignore next @preserve */
onKeyStroke('f', () => !shouldIgnoreKeystroke() && markAsFalsePositive(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('F', () => !shouldIgnoreKeystroke() && markAllAsFalsePositive(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('t', () => !shouldIgnoreKeystroke() && markAsTruePositive(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('T', () => !shouldIgnoreKeystroke() && markAllAsTruePositive(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('g', () => !shouldIgnoreKeystroke() && markAsGone(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('G', () => !shouldIgnoreKeystroke() && markAllAsGone(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke('a', (e: KeyboardEvent) => !shouldIgnoreKeystroke() && !e.ctrlKey && auditThis(), {
  eventName: 'keydown',
});
/* istanbul ignore next @preserve */
onKeyStroke(' ', () => !shouldIgnoreKeystroke() && toggleSelect(), { eventName: 'keydown' });
/* istanbul ignore next @preserve */
onKeyStroke(
  'a',
  (e: KeyboardEvent) => !shouldIgnoreKeystroke() && e.ctrlKey && toggleAllCheckboxes(),
  { eventName: 'keydown' },
);

/* istanbul ignore next @preserve */
watch(
  () => props.findings,
  (findings, _prevFindings) => {
    findingList.value = findings;
  },
);
</script>
