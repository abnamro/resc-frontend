<template>
  <div class="flex flex-col justify-start">
    <label for="status" class="font-bold text-lg text-left text-muted-color-emphasis">Status</label>
    <MultiSelect
      v-model:model-value="selectedStatus"
      :options="optionsStatus"
      display="chip"
      optionLabel="label"
      class="w-full"
      placeholder="Select Status"
      :show-toggle-all="false"
      id="status"
      @update:model-value="onStatusFilterChange"
      :pt:option:class="'text-gray-840 dark:text-gray-130'"
      :pt:overlay:class="'bg-gray-0 dark:bg-gray-870 dark:border-gray-780'"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import CommonUtils, { type StatusOptionType } from '@/utils/common-utils';
import MultiSelect from 'primevue/multiselect';
import { onMounted, ref, watch } from 'vue';
import { useAuthUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useStatus } from '@/composables/useStatus';

type Props = {
  statusOptions?: StatusOptionType[];
};

const { allStatuses } = useStatus();
const props = withDefaults(defineProps<Props>(), {
  statusOptions: () => [],
});

const store = useAuthUserStore();
const { selectedStatus } = storeToRefs(store);

const optionsStatus = ref(props.statusOptions);

const emit = defineEmits(['on-findings-status-change']);

function onStatusFilterChange() {
  emit('on-findings-status-change');
}

onMounted(() => {
  optionsStatus.value = CommonUtils.parseStatusOptions(allStatuses);
});

watch(
  () => props.statusOptions,
  (newStatusOption) => (optionsStatus.value = newStatusOption),
);
</script>
