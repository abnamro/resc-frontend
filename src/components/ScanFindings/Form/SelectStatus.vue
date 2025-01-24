<template>
  <div class="flex flex-col justify-start">
    <label for="status" class="font-bold text-lg text-left text-muted-color-emphasis">
      Status
    </label>
    <Select
      v-model="status"
      :options="allStatuses"
      :invalid="props.invalid"
      id="status"
      option-label="label"
      value="value"
    >
      <template #value="slotProps">
        {{ getStatusString(slotProps.value) }}
      </template>
      <template #option="slotProps">
        {{ getStatusString(slotProps.option) }}
      </template>
    </Select>
  </div>
</template>
<script lang="ts" setup>
import { useStatus } from '@/composables/useStatus';
import type { FindingStatus } from '@/services/shema-to-types';
import Select from 'primevue/select';
import type { Ref } from 'vue';

const status = defineModel('status') as Ref<FindingStatus>;
const props = defineProps<{ invalid: boolean }>();
const { allStatuses, getStatusString } = useStatus();
</script>
