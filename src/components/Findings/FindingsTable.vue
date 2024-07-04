<template>
  <AuditModal
    ref="auditModal"
    :selectedCheckBoxIds="selectedCheckBoxIds"
    @update-audit="updateAudit"
  />
  <ColumnSelector ref="columnModal" @update-columns="setTableFields" />

  <div class="py-3">
    <BTable
      ref="auditTable"
      id="rule-analysis-table"
      :items="filteredList"
      :fields="fields as TableField[]"
      :current-page="1"
      :per-page="0"
      :selectable="true"
      :select-mode="'single'"
      primary-key="id_"
      responsive
      small
      head-variant="light"
      @row-clicked="toggleFindingDetails"
      :caption-top="true"
    >
      <template #table-caption>
        <div class="row me-0 mr-0">
          <div class="col-md-4">
            <BButton
              class="d-inline-block me-3"
              variant="primary"
              size="sm"
              id="AuditButton"
              v-on:click="showAuditModal()"
              :disabled="auditButtonDisabled"
              >AUDIT</BButton
            >
            <BButton
              class="d-inline-block"
              variant="primary"
              size="sm"
              id="AuditButton"
              v-on:click="showColumnSelect()"
              >Columns</BButton
            >
          </div>
          <div class="col-md-4">
            <BFormInput
              class="hover-opacity"
              id="filter-files"
              placeholder="filename"
              v-model="filterString"
              :required="true"
            />
          </div>
        </div>
      </template>

      <!-- Select all checkboxes -->
      <template #head(select)>
        <BFormCheckbox
          id="allSelected"
          class="checkbox"
          v-model="allSelected"
          @change="selectAllCheckboxes"
        ></BFormCheckbox>
      </template>

      <!-- Selection checkboxes -->
      <template #cell(select)="data">
        <BFormCheckbox
          class="checkbox"
          v-model="selectedCheckBoxIds"
          :value="data.item.id_"
          @change="selectSingleCheckbox"
        ></BFormCheckbox>
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
        <span :title="data.item.file_path" class="rtl text-nowrap text-truncate d-inline-block">
          {{ data.item.file_path }}
        </span>
      </template>

      <!-- commit_timestamp Column -->
      <template #cell(commit_timestamp)="data">
        {{ data.item.commit_timestamp.substring(0, 10) }}
      </template>

      <!-- Scan timestamp Column -->
      <template #cell(timestamp)="data">
        {{ data.item.timestamp.substring(0, 10) }}
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
        <FindingPanel :finding="data.item"></FindingPanel>
      </template>
    </BTable>
  </div>
</template>
<script lang="ts" setup>
import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
import {
  BTable,
  BFormCheckbox,
  BButton,
  type TableField,
  type TableItem,
  BFormInput,
} from 'bootstrap-vue-next';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FindingsService from '@/services/findings-service';
import AxiosConfig from '@/configuration/axios-config';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { computed, ref } from 'vue';
import { watch } from 'vue';
import ColumnUtils, { type SimpleTableField, type TableColumn } from '@/utils/column-utils';
import { useAuthUserStore } from '@/store';
import ColumnSelector from '@/components/Findings/ColumnSelector.vue';

type TableItemDetailedFindingRead = DetailedFindingRead & TableItem;

type Props = {
  findings: DetailedFindingRead[];
  is_rule_finding: boolean;
};

const props = defineProps<Props>();

const auditModal = ref();
const columnModal = ref();
const auditTable = ref();
const filterString = ref('');

const findingList = ref(props.findings as TableItemDetailedFindingRead[]);
const selectedCheckBoxIds = ref([] as number[]);
const allSelected = ref(false);
const fields = ref([] as SimpleTableField[]);

const auditButtonDisabled = computed(() => selectedCheckBoxIds.value.length <= 0);
const selectedIndex = ref(undefined as number | undefined);
const store = useAuthUserStore();
const emit = defineEmits(['refresh-table']);

// Simple filter function
// if start with * we check the ending of the file path.
// if end with * we check the beginning of the file path.
// if does not contain * we only check if the needle is in the string.
function applyFilter() {
  if (filterString.value === '') {
    return findingList.value;
  }

  const token = filterString.value;

  if (token.startsWith('*')) {
    return findingList.value.filter((finding) => {
      return finding.file_path.endsWith(token.substring(1));
    });
  }

  if (token.endsWith('*')) {
    return findingList.value.filter((finding) => {
      return finding.file_path.startsWith(token.substring(0, token.length - 1));
    });
  }

  return findingList.value.filter((finding) => {
    return finding.file_path.includes(token);
  });
}

const filteredList = computed(applyFilter);

function setTableFields(selectedColumns: TableColumn[] = []) {
  // @ts-ignore ignore TS2589
  fields.value = ColumnUtils.getColumns(selectedColumns, store.tableColumns, props.is_rule_finding);
}

setTableFields();

function selectSingleCheckbox() {
  allSelected.value = false;
}

function selectAllCheckboxes() {
  selectedCheckBoxIds.value = [];
  if (allSelected.value) {
    for (const finding of filteredList.value) {
      selectedCheckBoxIds.value.push(finding.id_);
    }
  }
}

function toggleAllCheckboxes() {
  selectedCheckBoxIds.value = [];
  allSelected.value = !allSelected.value;
  if (allSelected.value) {
    for (const finding of filteredList.value) {
      selectedCheckBoxIds.value.push(finding.id_);
    }
  }
}

function showAuditModal() {
  auditModal.value.show();
}

function showColumnSelect() {
  columnModal.value.show();
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

  return filteredList.value[selectedIndex.value];
}

function selectDown(): boolean {
  const detailsStatus = getCurrentFindingSelected()?._showDetails;
  closeAllDetails();

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % filteredList.value.length;
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
  if (url !== undefined && url !== null) {
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
onKeyStroke('r', () => !shouldIgnoreKeystroke() && emit('refresh-table'), { eventName: 'keydown' });


/* istanbul ignore next @preserve */
watch(
  () => props.findings,
  (findings, _prevFindings) => {
    findingList.value = findings;
    selectedCheckBoxIds.value = [];
    allSelected.value = false;
    selectedIndex.value = undefined;
  },
);
</script>
<style lang="scss">
.hover-opacity {
  opacity: 0;
  transition: all 0.2s ease-in-out !important;

  &:hover {
    opacity: 1;
  }

  &:focus {
    opacity: 1;
  }
}

input.hover-opacity:valid {
  opacity: 1;
}
</style>
