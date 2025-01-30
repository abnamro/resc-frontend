<template>
  <AuditModal v-model:visible="isAuditModalVisible" :selectedCheckBoxIds="selection"
    @update-audit="updateAudit" />
  <ColumnSelector v-model:visible="isColumnSelectorVisible" @update-columns="setTableFields" />

  <Panel :pt:header:class="'hidden'" class="mt-4 pt-[1.125rem]">
    <FindingTableHeader v-model:filter-string="filterString" v-model:is-audit-modal-visible="isAuditModalVisible"
          v-model:is-column-selector-visible="isColumnSelectorVisible" :audit-button-disabled="auditButtonDisabled" />

    <table class="w-full text-left mt-2">
      <thead>
        <tr>
          <th class="bg-teal-500/20 pl-2">
            <!-- <Checkbox binary v-model="selection" /> -->
          </th>
          <th class="bg-teal-500/20"></th>
          <th v-for="col of fields" :class="col.class" class="text-lg bg-teal-500/20">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="filteredList === undefined">
          <tr>
            <td :colspan="3 + fields.length" class="text-center p-4">
              <i class="pi pi-spin pi-spinner mr-2" ></i> Loading data...
            </td>
          </tr>
        </template>
        <template v-else v-for="(data, idx) in filteredList">
          <tr :class="{
            'bg-teal-450/10': selectedIndex === idx,
            'hover:bg-teal-450/5': true
          }"
          @click="selectedIndex = idx"
          >
            <td class="pl-2">
              <Checkbox v-model="selection" :value="data.id_" />
            </td>
            <td>
              <Button rounded text :icon="'pi ' + (expanded === idx ? 'pi-chevron-down' : 'pi-chevron-right')"
              class="border-none" 
              @click="toggleExpand(idx)"></Button>
            </td>
            <td v-for="col of fields" :class="col.class">
              <FindingStatusBadge v-if="col.key === 'status'" :status="data[col.key] ?? 'NOT_ANALYZED'" />
              <span v-else-if="col.key === 'file_path'" :title="data[col.key]"
                class="rtl text-nowrap truncate inline-block">
                {{ data[col.key] }}
              </span>
              <template v-else>
                <!-- @vue-expect-error We expect that it is going to complain that string is not part of the reccord... -->
                {{ data[col.key] }}
              </template>
            </td>
          </tr>
          <tr v-if="expanded === idx">
            <td :colspan="3 + fields.length">
              <FindingPanel :finding="data"></FindingPanel>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <!-- <DataTable :value="filteredList" size="small" class="w-full" v-model:selection="selection" selection-mode="multiple"
      :rowHover="false" v-model:expanded-rows="expandedRows" scrollable :scrollHeight="scrollHeight"
      :virtualScrollerOptions="{ itemSize: 42 }" :loading="filteredList === undefined"
      :dataKey="(data) => `${data.id_}`" :rowClass="rowClass" @row-click="(e) => (selectedIndex = e.index)">
      <template #header>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column :expander="true" />
      <Column v-for="col of fields" :key="col.key" :field="col.key" :header="col.label" :sortable="col.sortable"
        :class="col.class">
        <template #body="slotProps">
          <FindingStatusBadge v-if="col.key === 'status'" :status="slotProps.data[col.key] ?? 'NOT_ANALYZED'" />
          <span v-else-if="col.key === 'file_path'" :title="slotProps.data[col.key]"
            class="rtl text-nowrap truncate inline-block">
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
    </DataTable> -->
  </Panel>
</template>
<script lang="ts" setup>
import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
import FindingsService from '@/services/findings-service';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { computed, ref } from 'vue';
import { watch } from 'vue';
import ColumnSelector from '@/components/Findings/ColumnSelector.vue';
import FindingTableHeader from './FindingTableHeader.vue';
import { useFiltering } from '@/composables/useFiltering';
import { useColumnFiltering } from '@/composables/useColumnFiltering';
import { dispatchError, dispatchMessage } from '@/configuration/config';
import Panel from 'primevue/panel';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const props = defineProps<{
  findings: DetailedFindingRead[] | undefined;
  isRuleFinding: boolean;
}>();

const isAuditModalVisible = ref(false);
const isColumnSelectorVisible = ref(false);

const expanded = ref(-1);
const selection = ref<number[]>([]);
const selectedIndex = ref<number>(0);

const findingList = ref<DetailedFindingRead[] | undefined>(props.findings);
const auditButtonDisabled = computed(() => selection.value.length === 0);
const emit = defineEmits(['refresh-table']);

const { fields, setTableFields } = useColumnFiltering(props.isRuleFinding);
const { filterString, filteredList } = useFiltering(findingList);

setTableFields();

function toggleExpand(idx: number) {
  selectedIndex.value = idx;
  expanded.value = (expanded.value === idx) ? -1 : idx;
}

function toggleAllCheckboxes() {
  if (filteredList.value === undefined) {
    return;
  }

  if (selection.value.length < filteredList.value.length) {
    selection.value = filteredList.value.map((f) => f.id_);
  } else {
    selection.value = [];
  }
}

function updateAudit(status: FindingStatus, comment: string) {
  updateVisualBadge(selection.value, status, comment);
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

  selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % filteredList.value.length;
  expanded.value = expanded.value === -1 ? -1 : selectedIndex.value;

  return true;
}

function selectUp(): boolean {
  if (filteredList.value === undefined) {
    return false;
  }

  selectedIndex.value =
    (selectedIndex.value + filteredList.value.length - 1) % filteredList.value.length;
    expanded.value = expanded.value === -1 ? -1 : selectedIndex.value;

  return true;
}

function openDetails() {
  expanded.value = selectedIndex.value;
}

function closeDetails() {
  expanded.value = -1;
}

function openCommitUrl() {
  const url = getCurrentFindingSelected()?.commit_url;
  if (url !== undefined && url !== null) {
    window.open(url, '_blank')?.focus();
  }
}

function toggleSelect() {
  const item = getCurrentFindingSelected();
  if (selection.value.filter((idx) => idx === item.id_).length > 0) {
    selection.value = selection.value.filter((idx) => idx !== item.id_);
  } else {
    selection.value.push(item.id_);
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
  sendUpdate(selection.value, 'FALSE_POSITIVE');
}

function markAllAsTruePositive() {
  sendUpdate(selection.value, 'TRUE_POSITIVE');
}

function markAllAsGone() {
  sendUpdate(selection.value, 'NOT_ACCESSIBLE');
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

// onMounted(setTableFields);

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
