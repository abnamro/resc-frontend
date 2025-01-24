<template>
  <AuditModal
    v-model:visible="isAuditModalVisible"
    v-model:expandedRows="expandedRows"
    v-model:selectedCheckBoxIds="selectedCheckBoxIds"
  />
  <!-- @update-audit="updateAudit" -->
  <ColumnSelector v-model:visible="isColumnSelectorVisible" @update-columns="setTableFields" />

  <DataTable
    :value="filteredList"
    size="small"
    class="w-full"
    v-model:selection="selection"
    selection-mode="multiple"
    v-model:expanded-rows="expandedRows"
    :loading="!props.hasRecords"
    :dataKey="(data) => `${data.id_}`"
  >
    <template #header>
      <FindingTableHeader
        v-model:filter-string="filterString"
        v-model:is-audit-modal-visible="isAuditModalVisible"
        v-model:is-column-selector-visible="isColumnSelectorVisible"
        :audit-button-disabled="auditButtonDisabled"
      />
    </template>
    <Column selectionMode="multiple" headerStyle="width: 3rem" />
    <Column :expander="true" />
    <Column
      v-for="col of fields"
      :key="col.key"
      :field="col.key"
      :header="col.label"
      :sortable="col.sortable"
      :class="col.class"
    >
      <template #body="slotProps">
        <FindingStatusBadge
          v-if="col.key === 'status'"
          :status="slotProps.data[col.key] ?? 'NOT_ANALYZED'"
        />
        <span
          v-else-if="col.key === 'file_path'"
          :title="slotProps.data[col.key]"
          class="rtl text-nowrap truncate inline-block"
        >
          {{ slotProps.data[col.key] }}
        </span>
        <template v-else>
          {{ slotProps.data[col.key] }}
        </template>
      </template>
    </Column>
    <template #expansion="slotProps">
      <FindingPanel :finding="slotProps.data"></FindingPanel>
    </template>
  </DataTable>
</template>
<script lang="ts" setup>
import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import type { DetailedFindingRead } from '@/services/shema-to-types';
import FindingsService from '@/services/findings-service';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { computed, onMounted, ref } from 'vue';
import { watch } from 'vue';
import ColumnSelector from '@/components/Findings/ColumnSelector.vue';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import FindingTableHeader from './FindingTableHeader.vue';
import { useFiltering } from '@/composables/useFiltering';
import { useColumnFiltering } from '@/composables/useColumnFiltering';

type Props = {
  findings: DetailedFindingRead[];
  isRuleFinding: boolean;
  hasRecords: boolean;
};

const props = defineProps<Props>();

const isAuditModalVisible = ref(false);
const isColumnSelectorVisible = ref(false);
const selection = ref([] as DetailedFindingRead[]);
const expandedRows = ref<Record<string, boolean>>({});

const findingList = ref(props.findings as DetailedFindingRead[]);
const selectedCheckBoxIds = ref([] as number[]);
const allSelected = ref(false);

const auditButtonDisabled = computed(() => selectedCheckBoxIds.value.length <= 0);
const selectedIndex = ref(undefined as number | undefined);
const emit = defineEmits(['refresh-table']);

const { fields, setTableFields } = useColumnFiltering(props.isRuleFinding);
const { filterString, filteredList } = useFiltering(findingList);

setTableFields();

// function toggleAllCheckboxes() {
//   selectedCheckBoxIds.value = [];
//   allSelected.value = !allSelected.value;
//   if (allSelected.value) {
//     for (const finding of filteredList.value) {
//       selectedCheckBoxIds.value.push(finding.id_);
//     }
//   }
// }

function showAuditModal() {
  isAuditModalVisible.value = true;
}

// function updateAudit(status: FindingStatus, comment: string) {
//   updateVisualBadge(selectedCheckBoxIds.value, status, comment);
//   emit('refresh-table');
// }

// function updateVisualBadge(selectedIds: number[], status: FindingStatus, comment: string) {
//   findingList.value.forEach((finding: DetailedFindingRead, idx, theArray) => {
//     if (selectedIds.includes(finding.id_)) {
//       theArray[idx].status = status;
//       theArray[idx].comment = comment;
//     }
//   });

//   if (selectedIds.length > 1) {
//     selectedCheckBoxIds.value = [];
//     allSelected.value = false;
//     return;
//   }

//   const index = selectedCheckBoxIds.value.indexOf(selectedIds[0]);
//   if (index !== -1) {
//     selectedCheckBoxIds.value.splice(index, 1);
//   }
// }

// function getCurrentFindingSelected(): DetailedFindingRead | undefined {
//   if (selectedIndex.value === undefined) {
//     return undefined;
//   }

//   return filteredList.value[selectedIndex.value];
// }

// function selectDown(): boolean {
//   const detailsStatus = getCurrentFindingSelected()?._showDetails;
//   closeAllDetails();

//   selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % filteredList.value.length;
//   auditTable.value.clearSelected();
//   auditTable.value.selectRow(selectedIndex.value);

//   (getCurrentFindingSelected() as DetailedFindingRead)._showDetails = detailsStatus;

//   return true;
// }

// function selectUp(): boolean {
//   const detailsStatus = getCurrentFindingSelected()?._showDetails;
//   closeAllDetails();

//   selectedIndex.value = Math.max(0, (selectedIndex.value ?? 1) - 1);
//   auditTable.value.clearSelected();
//   auditTable.value.selectRow(selectedIndex.value);

//   (getCurrentFindingSelected() as DetailedFindingRead)._showDetails = detailsStatus;

//   return true;
// }

// function closeAllDetails() {
//   findingList.value.forEach((_item, idx, theArray) => {
//     theArray[idx]._showDetails = false;
//   });
// }

// function openDetails() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   item._showDetails = true;
// }

// function closeDetails() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   item._showDetails = false;
// }

// function openCommitUrl() {
//   const url = getCurrentFindingSelected()?.commit_url;
//   if (url !== undefined && url !== null) {
//     window.open(url, '_blank')?.focus();
//   }
// }

// function toggleSelect() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   const index = selectedCheckBoxIds.value.indexOf(item.id_);
//   if (index === -1) {
//     selectedCheckBoxIds.value.push(item.id_);
//   } else {
//     selectedCheckBoxIds.value.splice(index, 1);
//   }
// }

// function markAsFalsePositive() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   sendUpdate([item.id_], 'FALSE_POSITIVE');
//   selectDown();
// }

// function markAsTruePositive() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   sendUpdate([item.id_], 'TRUE_POSITIVE');
//   selectDown();
// }

// function markAsGone() {
//   const item = getCurrentFindingSelected();
//   if (item === undefined) {
//     return;
//   }
//   sendUpdate([item.id_], 'NOT_ACCESSIBLE');
//   selectDown();
// }

// function markAllAsFalsePositive() {
//   sendUpdate(selectedCheckBoxIds.value, 'FALSE_POSITIVE');
// }

// function markAllAsTruePositive() {
//   sendUpdate(selectedCheckBoxIds.value, 'TRUE_POSITIVE');
// }

// function markAllAsGone() {
//   sendUpdate(selectedCheckBoxIds.value, 'NOT_ACCESSIBLE');
// }

// function auditThis() {
//   if (selectedCheckBoxIds.value.length > 0) {
//     showAuditModal();
//     return;
//   }

//   openDetails();
// }

// function sendUpdate(selectedIds: number[], status: FindingStatus) {
//   FindingsService.auditFindings(selectedIds, status, '')
//     .then(() => {
//       updateVisualBadge(selectedIds, status, '');
//     })
//     .catch((error) => {
//       AxiosConfig.handleError(error);
//       return false;
//     });
// }

// /* istanbul ignore next @preserve */
// onKeyStroke(['ArrowLeft', 'h', 'H'], () => !shouldIgnoreKeystroke() && closeDetails(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke(['ArrowRight', 'l', 'L'], () => !shouldIgnoreKeystroke() && openDetails(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke(
//   ['ArrowDown', 'j', 'J'],
//   (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectDown() && e.shiftKey && toggleSelect(),
//   { eventName: 'keydown' },
// );
// /* istanbul ignore next @preserve */
// onKeyStroke(
//   ['ArrowUp', 'k', 'K'],
//   (e: KeyboardEvent) => !shouldIgnoreKeystroke() && selectUp() && e.shiftKey && toggleSelect(),
//   { eventName: 'keydown' },
// );

// /* istanbul ignore next @preserve */
// onKeyStroke('o', () => !shouldIgnoreKeystroke() && openCommitUrl(), { eventName: 'keydown' });
// /* istanbul ignore next @preserve */
// onKeyStroke('f', () => !shouldIgnoreKeystroke() && markAsFalsePositive(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('F', () => !shouldIgnoreKeystroke() && markAllAsFalsePositive(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('t', () => !shouldIgnoreKeystroke() && markAsTruePositive(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('T', () => !shouldIgnoreKeystroke() && markAllAsTruePositive(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('g', () => !shouldIgnoreKeystroke() && markAsGone(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('G', () => !shouldIgnoreKeystroke() && markAllAsGone(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke('a', (e: KeyboardEvent) => !shouldIgnoreKeystroke() && !e.ctrlKey && auditThis(), {
//   eventName: 'keydown',
// });
// /* istanbul ignore next @preserve */
// onKeyStroke(' ', () => !shouldIgnoreKeystroke() && toggleSelect(), { eventName: 'keydown' });
// /* istanbul ignore next @preserve */
// onKeyStroke(
//   'a',
//   (e: KeyboardEvent) => !shouldIgnoreKeystroke() && e.ctrlKey && toggleAllCheckboxes(),
//   { eventName: 'keydown' },
// );
// /* istanbul ignore next @preserve */
// onKeyStroke('r', () => !shouldIgnoreKeystroke() && emit('refresh-table'), { eventName: 'keydown' });
// /* istanbul ignore next @preserve */
// onKeyStroke(
//   '\\',
//   () => shouldIgnoreKeystroke() && document.getElementById('filterFiles')?.focus(),
//   { eventName: 'keydown' },
// );
// /* istanbul ignore next @preserve */
// onKeyStroke('Escape', () => document.getElementById('filterFiles')?.blur(), {
//   eventName: 'keydown',
// });

onMounted(setTableFields);

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
