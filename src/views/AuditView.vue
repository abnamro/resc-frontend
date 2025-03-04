<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">AUDITS</h1>

    <AuditModal
      v-model:visible="isAuditModalVisible"
      :selectedCheckBoxIds="selection"
      @update-audit="updateAudit"
    />

    <Panel :pt:header:class="'hidden'" class="pt-[1.125rem]">
      <div class="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-12 gap-x-2 gap-y-4">
        <div class="col-span-3">
          <div class="flex flex-col justify-start">
            <label for="start-date" class="font-bold text-lg text-left text-muted-color-emphasis"
              >From Date</label
            >
            <DatePicker
              v-model="fromDate"
              placeholder="Enter Scan Start Date"
              date-format="dd/mm/yyyy"
              :max-date="todaysDate"
              @update:model-value="fetchPaginatedData"
            />
          </div>
        </div>

        <!-- End Date Filter -->
        <div class="col-span-3">
          <div class="flex flex-col justify-start">
            <label for="end-date" class="font-bold text-lg text-left text-muted-color-emphasis"
              >To Date</label
            >
            <DatePicker
              v-model="toDate"
              placeholder="Enter Scan End Date"
              date-format="dd/mm/yyyy"
              :min-date="fromDate"
              :max-date="todaysDate"
              @update:model-value="fetchPaginatedData"
            />
          </div>
        </div>

        <div class="col-span-3 text-left flex items-center">
          <div class="flex flex-col justify-start w-full">
            <label
              for="includeDeletedRepositories"
              class="font-bold text-lg text-left text-muted-color-emphasis"
              >Auditor</label
            >
            <InputText class="w-full" v-model="auditor" @change="fetchPaginatedData" />
          </div>
        </div>

        <!-- Include zero finding repos -->
        <div class="col-span-3 text-left flex items-end">
          <ToggleSwitch
            size="small"
            v-model="isLatest"
            inputId="isLatestAudit"
            @change="fetchPaginatedData"
          >
          </ToggleSwitch>
          <label for="isLatestAudit" class="ml-2 text-left text-muted-color-emphasis"
            >Only include latest audits.</label
          >
        </div>
      </div>
    </Panel>

    <Panel :pt:header:class="'hidden'" class="mt-4 pt-[1.125rem]">
      <FindingTableHeader
        v-model:filter-string="filterString"
        v-model:is-audit-modal-visible="isAuditModalVisible"
        :audit-button-disabled="auditButtonDisabled"
        :has-column-selector="false"
      />

      <table class="w-full text-left mt-2">
        <thead>
          <tr class="bg-teal-500/20 pl-2">
            <th></th>
            <th class="px-1">Project</th>
            <th class="px-1">Repository</th>
            <th class="px-1">Rule</th>
            <th class="px-1">File Path:Line</th>
            <th class="px-1">Status</th>
            <th class="px-1">Date</th>
            <th class="text-right">Auditor</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="audits === undefined">
            <tr>
              <td :colspan="9" class="text-center p-4">
                <i class="pi pi-spin pi-spinner mr-2"></i> Loading data...
              </td>
            </tr>
          </template>
          <template
            v-else
            v-for="(data, idx) in filteredList"
            :key="`d${data.audit_id}-${selection.length}`"
          >
            <tr
              :class="{
                'h-7': true,
                'line-through text-muted-color': audited.includes(data.audit_id),
                'bg-teal-450/10': selectedIndex === idx,
                'hover:bg-teal-450/5': true,
              }"
              @click="selectedIndex = idx"
            >
              <td class="pl-2">
                <Checkbox
                  size="small"
                  v-model="selection"
                  :value="data.finding_id"
                  v-if="!audited.includes(data.audit_id)"
                />
              </td>
              <td class="px-1 text-nowrap">{{ data.project_key }}</td>
              <td class="px-1 text-nowrap">{{ data.repository_name }}</td>
              <td class="px-1 text-nowrap">{{ data.rule_name }}</td>
              <td class="px-1 text-nowrap">
                {{ trimPath(data.file_path) + ' :' + data.line_number }}
              </td>
              <td class="px-1 text-nowrap">
                <FindingStatusBadge :status="data.status" />
                <i v-if="data.comment" class="ml-1 pi pi-comment" v-tooltip="data.comment"></i>
              </td>
              <td>{{ data.timestamp.slice(0, 10) }}</td>
              <td class="text-nowrap text-right" v-tooltip.top="data.auditor">
                {{ userFormat(data.auditor) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </Panel>

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
import FindingTableHeader from '@/components/Findings/FindingTableHeader.vue';
import { useAuditFunctions } from '@/composables/useAuditFunctions';
import { useFiltering } from '@/composables/useFiltering';
import { useFormatter } from '@/composables/useFormatter';
import { usePaginator } from '@/composables/usePaginator';
import { dispatchError, MAX_LENGTH_PATH, PAGE_SIZES } from '@/configuration/config';
import FindingsService from '@/services/findings-service';
import type { AuditFinding, FindingStatus } from '@/services/shema-to-types';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { onKeyStroke } from '@vueuse/core';
import Checkbox from 'primevue/checkbox';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import ToggleSwitch from 'primevue/toggleswitch';
import { computed, onMounted, ref } from 'vue';

const audits = ref<AuditFinding[] | undefined>(undefined);
const isAuditModalVisible = ref(false);

const { userFormat } = useFormatter();

const expanded = ref(-1);
const selection = ref<number[]>([]);
const audited = ref<number[]>([]);
const selectedIndex = ref<number>(0);
const todaysDate = computed(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(today);
});

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } =
  usePaginator(fetchPaginatedData);

const auditor = ref<string | undefined>(undefined);
const fromDate = ref<Date | undefined>(undefined);
const toDate = ref<Date | undefined>(undefined);
const status = ref<FindingStatus[]>([]);
const isLatest = ref(true);
const auditButtonDisabled = computed(() => selection.value.length === 0);
const { filterString, filteredList } = useFiltering(audits);

function trimPath(path: string) {
  if (path.length < MAX_LENGTH_PATH) {
    return path;
  }

  return path.slice(path.length - MAX_LENGTH_PATH);
}

function fetchPaginatedData() {
  FindingsService.getAudits(
    perPage.value,
    currentPage.value,
    auditor.value,
    fromDate.value,
    toDate.value,
    status.value,
    isLatest.value,
  )
    .then((response) => {
      audits.value = response.data.data;
      totalRows.value = response.data.total;
    })
  /* istanbul ignore next @preserve */
  .catch(dispatchError);
}

function sendUpdate(selectedIds: number[], statusCandidate: FindingStatus) {
  FindingsService.auditFindings(selectedIds, statusCandidate, '')
    .then(() => {
      updateVisualBadge(selectedIds, statusCandidate);
    })
  .catch(
      /* istanbul ignore next @preserve */
    (error) => {
      dispatchError(error);
      return false;
    });
}

const {
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
  /* istanbul ignore next @preserve */
  (item) => item.finding_id,
  sendUpdate,
);

function updateAudit(statusCandidate: FindingStatus, _comment: string) {
  updateVisualBadge(selection.value, statusCandidate);
  fetchPaginatedData();
}

function updateVisualBadge(selectedIds: number[], statusCandidate: FindingStatus) {
  if (audits.value === undefined) {
    /* istanbul ignore next @preserve */
    return;
  }

  audits.value.forEach((finding: AuditFinding, idx, theArray) => {
    if (selectedIds.includes(finding.finding_id)) {
      theArray[idx].status = statusCandidate;
      audited.value.push(theArray[idx].audit_id);
    }
  });

  if (selectedIds.length > 1) {
    selection.value = [];
    return;
  }

  selection.value = selection.value.filter(
    /* istanbul ignore next @preserve */
    (s) => s !== selectedIds[0]);
}

onMounted(fetchPaginatedData);

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
onKeyStroke('r', () => !shouldIgnoreKeystroke() && fetchPaginatedData, { eventName: 'keydown' });
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
</script>
