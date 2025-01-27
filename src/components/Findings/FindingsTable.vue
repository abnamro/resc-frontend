<template>
  <AuditModal
    v-model:visible="isAuditModalVisible"
    :selectedCheckBoxIds="selectedCheckBoxIds"
    @update-audit="updateAudit"
  />
  <ColumnSelector v-model:visible="isColumnSelectorVisible" @update-columns="setTableFields" />

  <DataTable
    :value="filteredList"
    size="small"
    class="w-full"
    v-model:selection="selection"
    selection-mode="multiple"
    :rowHover="false"
    v-model:expanded-rows="expandedRows"
    :loading="filteredList === undefined"
    :dataKey="(data) => `${data.id_}`"
    :rowClass="rowClass"
    @row-click="(e) => (selectedIndex = e.index)"
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
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
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
import { dispatchError, dispatchMessage } from '@/configuration/config';

type Props = {
  findings: DetailedFindingRead[] | undefined;
  isRuleFinding: boolean;
};

const props = defineProps<Props>();

const isAuditModalVisible = ref(false);
const isColumnSelectorVisible = ref(false);

const selection = ref<DetailedFindingRead[]>([]);
const expandedRows = ref<Record<string, boolean>>({});

const findingList = ref<DetailedFindingRead[] | undefined>(props.findings);
const selectedCheckBoxIds = computed(() => selection.value.map((s) => s.id_));

const auditButtonDisabled = computed(() => selection.value.length == 0);
const selectedIndex = ref<number>(0);
const emit = defineEmits(['refresh-table']);

const { fields, setTableFields } = useColumnFiltering(props.isRuleFinding);
const { filterString, filteredList } = useFiltering(findingList);

setTableFields();

function rowClass(data: DetailedFindingRead) {
  if (filteredList.value === undefined) {
    return '';
  }
  return data.id_ === filteredList.value[selectedIndex.value].id_ ? 'bg-emerald-200/20' : '';
}

function toggleAllCheckboxes() {
  if (filteredList.value === undefined) {
    return;
  }

  if (selection.value.length < filteredList.value.length) {
    selection.value = filteredList.value;
  } else {
    selection.value = [];
  }
}

function updateAudit(status: FindingStatus, comment: string) {
  updateVisualBadge(selectedCheckBoxIds.value, status, comment);
  emit('refresh-table');
}

function updateVisualBadge(selectedIds: number[], status: FindingStatus, comment: string) {
  if (findingList.value === undefined) {
    return;
  }

  findingList.value.forEach((finding: DetailedFindingRead, idx, theArray) => {
    if (selectedIds.includes(finding.id_)) {
      theArray[idx].status = status;
      theArray[idx].comment = comment;
    }
  });

  if (selectedIds.length > 1) {
    selection.value = [];
    return;
  }

  selection.value = selection.value.filter((s) => s.id_ !== selectedIds[0]);
}

function getCurrentFindingSelected(): DetailedFindingRead {
  if (filteredList.value === undefined) {
    dispatchMessage('List is empty');
    throw new Error('oups!');
  }

  return filteredList.value[selectedIndex.value];
}

function selectDown(): boolean {
  if (filteredList.value === undefined) {
    return false;
  }

  const s = getCurrentFindingSelected();
  const detailsStatus = expandedRows.value[s.id_];
  expandedRows.value = {};
  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % filteredList.value.length;

  const c = getCurrentFindingSelected();
  if (c !== undefined) {
    expandedRows.value[c.id_] = detailsStatus;
  }

  return true;
}

function selectUp(): boolean {
  if (filteredList.value === undefined) {
    return false;
  }

  const s = getCurrentFindingSelected();
  const detailsStatus = expandedRows.value[s.id_];
  expandedRows.value = {};
  selectedIndex.value =
    (selectedIndex.value + filteredList.value.length - 1) % filteredList.value.length;

  const c = getCurrentFindingSelected();
  if (c !== undefined) {
    expandedRows.value[c.id_] = detailsStatus;
  }

  return true;
}

function openDetails() {
  const item = getCurrentFindingSelected();
  if (item === undefined) {
    return;
  }
  expandedRows.value = {};
  expandedRows.value[item.id_] = true;
}

function closeDetails() {
  expandedRows.value = {};
}

function openCommitUrl() {
  const url = getCurrentFindingSelected()?.commit_url;
  if (url !== undefined && url !== null) {
    window.open(url, '_blank')?.focus();
  }
}

function toggleSelect() {
  const item = getCurrentFindingSelected();
  if (selection.value.filter((p) => p.id_ === item.id_).length > 0) {
    selection.value = selection.value.filter((p) => p.id_ !== item.id_);
  } else {
    selection.value.push(item);
  }
}

function markAsFalsePositive() {
  const item = getCurrentFindingSelected();
  sendUpdate([item.id_], 'FALSE_POSITIVE');
  selectDown();
}

function markAsTruePositive() {
  const item = getCurrentFindingSelected();
  sendUpdate([item.id_], 'TRUE_POSITIVE');
  selectDown();
}

function markAsGone() {
  const item = getCurrentFindingSelected();
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
  if (selection.value.length > 0) {
    isAuditModalVisible.value = true;
    return;
  }

  openDetails();
}

function sendUpdate(selectedIds: number[], status: FindingStatus) {
  FindingsService.auditFindings(selectedIds, status, '')
    .then(() => {
      updateVisualBadge(selectedIds, status, '');
    })
    .catch((error) => {
      dispatchError(error);
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
onKeyStroke(
  '\\',
  () => shouldIgnoreKeystroke() && document.getElementById('filterFiles')?.focus(),
  { eventName: 'keydown' },
);
/* istanbul ignore next @preserve */
onKeyStroke('Escape', () => document.getElementById('filterFiles')?.blur(), {
  eventName: 'keydown',
});

onMounted(setTableFields);

/* istanbul ignore next @preserve */
watch(
  () => props.findings,
  (findings, _prevFindings) => {
    findingList.value = findings;
    selection.value = [];
    selectedIndex.value = 0;
  },
);
</script>
