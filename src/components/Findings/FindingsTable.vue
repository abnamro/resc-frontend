<template>
  <AuditModal
    v-model:visible="isAuditModalVisible"
    :selectedCheckBoxIds="selection"
    @update-audit="updateAudit"
  />
  <ColumnSelector v-model:visible="isColumnSelectorVisible" @update-columns="setTableFields" />

  <Panel :pt:header:class="'hidden'" class="mt-4 pt-[1.125rem]">
    <FindingTableHeader
      v-model:filter-string="filterString"
      v-model:is-audit-modal-visible="isAuditModalVisible"
      v-model:is-column-selector-visible="isColumnSelectorVisible"
      :audit-button-disabled="auditButtonDisabled"
      :has-column-selector="true"
    />

    <table class="w-full text-left mt-2">
      <thead>
        <tr>
          <th class="bg-teal-500/20 pl-2">
            <!-- <Checkbox binary v-model="selection" /> -->
          </th>
          <th class="bg-teal-500/20"></th>
          <th
            v-for="col of fields"
            :key="col.key"
            :class="col.class"
            class="text-lg bg-teal-500/20"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="filteredList === undefined">
          <tr>
            <td :colspan="3 + fields.length" class="text-center p-4">
              <i class="pi pi-spin pi-spinner mr-2"></i> Loading data...
            </td>
          </tr>
        </template>
        <template v-else v-for="(data, idx) in filteredList" :key="`d${data.id_}`">
          <tr
            :class="{
              'bg-teal-450/10': selectedIndex === idx,
              'hover:bg-teal-450/5': true,
            }"
            @click="selectedIndex = idx"
          >
            <td class="pl-2">
              <Checkbox size="small" v-model="selection" :value="data.id_" />
            </td>
            <td>
              <Button
                rounded
                text
                :icon="'pi ' + (expanded === idx ? 'pi-chevron-down' : 'pi-chevron-right')"
                class="border-none h-7"
                size="small"
                @click="toggleExpand(idx)"
              ></Button>
            </td>
            <td v-for="col of fields" :class="col.class" :key="`d${data.id_}f${col.key}`">
              <FindingStatusBadge
                v-if="col.key === 'status'"
                :status="data[col.key] ?? 'NOT_ANALYZED'"
              />
              <span
                v-else-if="col.key === 'file_path'"
                :title="data[col.key]"
                class="rtl text-nowrap truncate inline-block"
              >
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
import { dispatchError } from '@/configuration/config';
import Panel from 'primevue/panel';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import FindingStatusBadge from '../Common/FindingStatusBadge.vue';
import { useAuditFunctions } from '@/composables/useAuditFunctions';

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

const {
  toggleExpand,
  toggleAllCheckboxes,
  selectDown,
  selectUp,
  openDetails,
  closeDetails,
  openCommitUrl,
  toggleSelect,
  markAsFalsePositive,
  markAsTruePositive,
  markAsGone,
  markAllAsFalsePositive,
  markAllAsTruePositive,
  markAllAsGone,
  auditThis,
} = useAuditFunctions(
  selection,
  selectedIndex,
  expanded,
  // @ts-expect-error
  filteredList,
  isAuditModalVisible,
  (item) => item.id_,
  sendUpdate,
);

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

  selection.value = selection.value.filter((s) => s !== selectedIds[0]);
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
