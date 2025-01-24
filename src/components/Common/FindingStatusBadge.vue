<template>
  <Tag :severity="severity" :value="val" class="text-xs"></Tag>
</template>
<script setup lang="ts">
import { useStatus } from '@/composables/useStatus';
import type { FindingStatus } from '@/services/shema-to-types';
import Tag from 'primevue/tag';
import { computed } from 'vue';
type Props = { status: FindingStatus };
const props = defineProps<Props>();

const { getStatusString, getStatusSeverity } = useStatus();

const severity = computed(() => getStatusSeverity(props.status));
const val = computed(() => getStatusString(props.status));
</script>
