<template>
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

    <div class="p-3">
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
    </div>
</template>

<script lang="ts" setup>


import AuditModal from '@/components/ScanFindings/AuditModal.vue';
import FindingPanel from '@/components/ScanFindings/FindingPanel.vue';
import type {
  DetailedFindingRead,
  FindingStatus,
  PaginationType,
  RulePackRead,
  VCSProviders,
} from '@/services/shema-to-types';
import type { TableItem } from 'bootstrap-vue-next';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onKeyStroke } from '@vueuse/core';
import CommonUtils from '@/utils/common-utils';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { computed, onMounted, ref, type Ref } from 'vue';

type TableItemDetailedFindingRead = DetailedFindingRead & TableItem;

type Props = {
  findings: DetailedFindingRead[]
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

const auditButtonDisabled = computed(() => selectedCheckBoxIds.value.length <= 0);
const selectedIndex = ref(undefined as number | undefined);

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
  <!-- fetchPaginatedDetailedFindings(); -->
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

function closeAllDetails() {
  findingList.value.forEach((_item, idx, theArray) => {
    theArray[idx]._showDetails = false;
  });
}

</script>
