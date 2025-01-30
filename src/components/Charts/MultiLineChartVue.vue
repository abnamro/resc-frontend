<template>
  <Line
    ref="multiline"
    :data="chartData"
    :styles="styles"
    :chartId="props.chartId"
    :cssClasses="props.cssClasses"
    :options="chartOptions"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import type { DataSetObject } from '@/views/metrics/types';
import type { ChartData, ChartOptions } from 'chart.js';
import { $dt } from '@primevue/themes';
import { useAuthUserStore } from '@/store';
import { storeToRefs } from 'pinia';

function getColor() {
  return dark.value ? $dt('gray.50').value : $dt('gray.870').value;
}

const store = useAuthUserStore();
const { dark } = storeToRefs(store);

type Props = {
  chartData: { labels: string[]; datasets: DataSetObject[] };
  chartId?: string;
  width?: number;
  height?: number;
  cssClasses?: string;
  styles?: object;
};

const props = withDefaults(defineProps<Props>(), {
  chartId: 'multi-line-chart',
  width: 100,
  height: 300,
  cssClasses: '',
  styles: () => {
    return {};
  },
});

const chartData = ref(props.chartData as ChartData<'line', number[], string>);
const color = getColor();
const chartOptions = ref<ChartOptions<'line'>>({
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color
      },
      title: {
        color
      }
    }
  },
  scales: {
    x: { border: { color: color}, grid: { color: `${color}80`}, ticks: { color: color}},
    y: { border: { color: color}, grid: { color: `${color}80`}, ticks: { color: color}},
  }
});
const styles = ref(props.styles ?? { height: `${props.height} px`, width: `${props.width} px`, });

</script>
