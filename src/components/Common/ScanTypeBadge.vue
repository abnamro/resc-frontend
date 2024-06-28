<template>
  <div>
    <BBadge v-if="props.scanType == 'BASE'" variant="success">{{ baseScanTag }}</BBadge>
    <BBadge v-if="props.scanType == 'INCREMENTAL'" variant="info"
      >INC: {{ props.incrementNumber }}</BBadge
    >
  </div>
</template>
<script setup lang="ts">
import { BBadge } from 'bootstrap-vue-next';
import { computed } from 'vue';
type Props = {
  scanType: string;
  incrementNumber: number;
};
const props = defineProps<Props>();

const baseScanTag = computed(() =>
  props.incrementNumber > 0 ? `BASE: ${props.incrementNumber}` : 'BASE',
);
</script>
