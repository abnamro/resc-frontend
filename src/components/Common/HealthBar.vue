<template>
  <MeterGroup
    :value="value"
    :max="props.totalCount"
    :pt:meters:class="'rounded-lg h-3 overflow-hidden'"
    :pt:labelList:class="'hidden'"
  >
    <template #meter="slotProps">
      <span
        v-if="slotProps.value.value > 0"
        :class="slotProps.value.color"
        class="text-xs font-bold flex items-center justify-center"
        :style="{ width: slotProps.size }"
        v-tooltip.top="getPopOverContent(slotProps.value.label, slotProps.value.value)"
      >
        {{ showFindingsInPercentage(slotProps.value.value) }}
      </span>
    </template>
  </MeterGroup>
</template>
<script setup lang="ts">
import MeterGroup from 'primevue/metergroup';
import { computed } from 'vue';
import { $dt } from '@primevue/themes';
import {} from 'primevue/tag';
type Props = {
  truePositive: number;
  falsePositive: number;
  notAnalyzed: number;
  notAccessible: number;
  clarificationRequired: number;
  outdated: number;
  totalCount: number;
};
const props = defineProps<Props>();

const value = computed(() => [
  { value: props.truePositive, label: 'True Positive', color: 'bg-red-100 text-red-700' },
  { value: props.falsePositive, label: 'False Positive', color: 'bg-green-100 text-green-700' },
  {
    value: props.clarificationRequired,
    label: 'Clarification Required',
    color: 'bg-orange-100 text-orange-700',
  },
  { value: props.notAccessible, label: 'Not Accessible', color: 'bg-sky-100 text-sky-700' },
  { value: props.notAnalyzed, label: 'Not Analyzed', color: 'bg-surface-100 text-surface-600' },
  { value: props.outdated, label: 'Outdated', color: 'bg-surface-800 text-surface-0' },
]);

console.log($dt('sematic.danger.color'));
const PERCENT = 100;
function showFindingsInPercentage(count: number) {
  return String(Math.round((count / props.totalCount) * PERCENT));
}

function getPopOverContent(title: string, count: number) {
  const percentage = showFindingsInPercentage(count);
  return `${title}: ${count}, percentage: ${percentage}%`;
}
</script>

<style lang="css">
.p-metergroup-label-list {
  display: none;
}
</style>
