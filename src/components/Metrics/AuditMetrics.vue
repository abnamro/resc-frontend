<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">Audit Metrics</h1>
    <h5 class="text-xl">Audits by Auditor per week</h5>
    <ProgressSpinner v-if="!loadedAuditCounts" />
    <div class="mx-20">
      <MultiLineChartVue
        v-if="loadedAuditCounts"
        :chart-data="chartDataForAuditCountsGraph"
        :height="600"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import FindingsService from '@/services/findings-service';
import MultiLineChartVue from '@/components/Charts/MultiLineChartVue.vue';
import { ref, type Ref } from 'vue';
import type { DataSetObject, DataSetObjectCollection, AuditData } from './types';
import ProgressSpinner from 'primevue/progressspinner';

const loadedAuditCounts = ref(false);
const loadedAuditCountsAuditors = ref(false);

const chartDataForAuditCountsGraph = ref({
  labels: [] as string[],
  datasets: [] as DataSetObject[],
});
const auditCounts = ref([]) as Ref<AuditData[]>;

function getGraphData() {
  FindingsService.getAuditsByAuditorPerWeek()
    .then((response) => {
      auditCounts.value = response.data;
      let datasets: DataSetObjectCollection = {};
      auditCounts.value.forEach((data: AuditData) => {
        (chartDataForAuditCountsGraph.value.labels as string[]).push(data.time_period);

        if (!loadedAuditCountsAuditors.value) {
          Object.entries(data.audit_by_auditor_count).forEach((auditorData) => {
            const auditor: string = auditorData[0];
            const count: number = auditorData[1];
            datasets[auditor] = prepareDataSet(auditor, count);
          });
          datasets['Total'] = prepareDataSet('Total', data.total ?? 0);
          loadedAuditCountsAuditors.value = true;
        } else {
          Object.entries(data.audit_by_auditor_count).forEach((auditorData) => {
            const auditor: string = auditorData[0];
            const count: number = auditorData[1];
            datasets[auditor].data.push(count);
          });
          datasets['Total'].data.push(data.total ?? 0);
        }
      });
      Object.entries(datasets).forEach((auditorDataset) => {
        chartDataForAuditCountsGraph.value.datasets.push(auditorDataset[1]);
      });
      loadedAuditCounts.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function prepareDataSet(datasetLabel: string, datasetFirstValue: number): DataSetObject {
  const hexMult = 16777215;
  const base16 = 16;
  const colourCode: string = '#' + Math.floor(Math.random() * hexMult).toString(base16);
  const datasetsObj: DataSetObject = {
    borderWidth: 1.5,
    cubicInterpolationMode: 'monotone',
    data: [datasetFirstValue],
    pointStyle: 'circle',
    pointRadius: 3,
    pointHoverRadius: 8,
    label: datasetLabel,
    borderColor: colourCode,
    pointBackgroundColor: colourCode,
    backgroundColor: colourCode,
  };

  if (datasetLabel === 'Total' || datasetLabel === 'resc') {
    datasetsObj.hidden = true;
  }

  return datasetsObj;
}

getGraphData();
</script>
