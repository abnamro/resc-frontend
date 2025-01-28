<template>
  <DataTable :value="auditList" :loading="auditList === undefined">
    <Column>
      <template #body="slotProps">
        {{ formatDate(slotProps.data.timestamp) }}
      </template>
    </Column>
    <Column field="auditor" />
    <Column>
      <template #body="slotProps">
        <FindingStatusBadge :status="slotProps.data.status ?? 'NOT_ANALYZED'" />
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <p
          v-if="(slotProps.data?.comment?.length ?? 0) > 45"
          v-tooltip="slotProps.data.comment"
          class="text-ellipsis"
        >
          {{ slotProps.data.comment }}
        </p>
        <p v-else>{{ slotProps.data.comment }}</p>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import DateUtils from '@/utils/date-utils';
import FindingsService from '@/services/findings-service';
import type { AuditRead, DetailedFindingRead } from '@/services/shema-to-types';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { dispatchError } from '@/configuration/config';

type Props = {
  finding: DetailedFindingRead;
};
const props = defineProps<Props>();

const finding = ref(props.finding);
const auditList = ref<AuditRead[] | undefined>(undefined);
const totalRows = ref(0);

function formatDate(timestamp: string): string {
  return DateUtils.formatDate(timestamp);
}

function fetchAuditsForFinding() {
  FindingsService.getFindingAudits(finding.value.id_, 100, 0)
    .then((response) => {
      auditList.value = response.data.data;
      totalRows.value = response.data.total;
    })
    .catch(dispatchError);
}

onMounted(fetchAuditsForFinding);
</script>
