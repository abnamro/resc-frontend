<template>
  <Tag :severity="severity" :value="val" class="text-xs"></Tag>
</template>
<script setup lang="ts">
import type { FindingStatus } from '@/services/shema-to-types';
import Tag from 'primevue/tag';
import { computed } from 'vue';
type Props = { status: FindingStatus };
const props = defineProps<Props>();

const severity = computed(() => {
  switch (props.status) {
    case 'NOT_ANALYZED':
      return 'secondary';
    case 'NOT_ACCESSIBLE':
      return 'info';
    case 'CLARIFICATION_REQUIRED':
      return 'warning';
    case 'TRUE_POSITIVE':
      return 'danger';
    case 'FALSE_POSITIVE':
      return 'success';
    case 'OUTDATED':
      return 'contrast';
    default:
      return 'danger';
  }
});

const val = computed(() => {
  switch (props.status) {
    case 'NOT_ANALYZED':
      return 'Not Analyzed';
    case 'NOT_ACCESSIBLE':
      return 'Not Accessible';
    case 'CLARIFICATION_REQUIRED':
      return 'Clarification Required';
    case 'TRUE_POSITIVE':
      return 'True Positive';
    case 'FALSE_POSITIVE':
      return 'False Positive';
    case 'OUTDATED':
      return 'Outdated';
    default:
      return 'Undefined';
  }
});
</script>
