<template>
  <table class="w-full text-left mt-2 text-muted-color">
    <tbody>
      <tr v-for="data in auditList" :key="`audit${data.id_}`" class="hover:bg-teal-450/5">
        <td>
          {{ DateUtils.formatDate(data.timestamp) }}
        </td>
        <td>{{ data.auditor }}</td>
        <td>
          <FindingStatusBadge :status="data.status ?? 'NOT_ANALYZED'" />
        </td>
        <td v-if="(data?.comment?.length ?? 0) > 45" v-tooltip="data.comment" class="text-ellipsis">
          {{ data.comment }}
        </td>
        <td v-else>{{ data.comment }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import DateUtils from '@/utils/date-utils';
import FindingsService from '@/services/findings-service';
import type { AuditRead, DetailedFindingRead } from '@/services/shema-to-types';
import { onMounted, ref } from 'vue';
import { dispatchError } from '@/configuration/config';

type Props = {
  finding: DetailedFindingRead;
};
const props = defineProps<Props>();

const finding = ref(props.finding);
const auditList = ref<AuditRead[] | undefined>(undefined);
const totalRows = ref(0);

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
