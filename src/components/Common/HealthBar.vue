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
  { value: props.truePositive, label: 'True Positive', color: 'bg-red-300 text-red-750' },
  { value: props.falsePositive, label: 'False Positive', color: 'bg-green-570/50 text-teal-890' },
  {
    value: props.clarificationRequired,
    label: 'Clarification Required',
    color: 'bg-yellow-570/20 text-yellow-570',
  },
  { value: props.notAccessible, label: 'Not Accessible', color: 'bg-blue-70 text-blue-660' },
  { value: props.notAnalyzed, label: 'Not Analyzed', color: 'bg-gray-130 text-gray-620' },
  { value: props.outdated, label: 'Outdated', color: 'bg-gray-870 text-gray-50' },
]);

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
