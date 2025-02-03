<template>
  <Tag v-if="props.scanType === 'BASE'" severity="success" :value="baseScanTag"></Tag>
  <Tag
    v-if="props.scanType === 'INCREMENTAL'"
    severity="info"
    :value="'INC: ' + props.incrementNumber"
  ></Tag>
</template>
<script setup lang="ts">
import Tag from 'primevue/tag';
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
