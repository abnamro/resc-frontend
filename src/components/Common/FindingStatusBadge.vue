<template>
  <div>
    <BBadge v-if="props.status == 'NOT_ANALYZED'" variant="secondary">Not Analyzed</BBadge>
    <BBadge v-if="props.status == 'NOT_ACCESSIBLE'" class="badge bg-info">Not Accessible</BBadge>
    <BBadge v-if="props.status == 'CLARIFICATION_REQUIRED'" variant="warning"
      >Clarification Required</BBadge
    >
    <BBadge v-if="props.status == 'TRUE_POSITIVE'" variant="danger">True Positive</BBadge>
    <BBadge v-if="props.status == 'FALSE_POSITIVE'" variant="success">False Positive</BBadge>
    <BBadge v-if="props.status == 'OUTDATED'" variant="dark">Outdated</BBadge>
  </div>
</template>
<script setup lang="ts">
import type { FindingStatus } from '@/services/shema-to-types';
import { BBadge } from 'bootstrap-vue-next';
type Props = { status: FindingStatus };
const props = defineProps<Props>();
</script>
