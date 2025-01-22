<template>
  <div>
    <BFormGroup class="label-title text-start" label="Status" label-for="status-filter">
      <Multiselect
        v-model="selectedStatus"
        :options="optionsStatus"
        :multiple="true"
        :show-labels="true"
        :close-on-select="true"
        :clear-on-select="false"
        :searchable="true"
        :preserve-search="true"
        :select-label="'Select'"
        :deselect-label="'Remove'"
        placeholder="Select Status"
        label="label"
        track-by="id"
        :preselect-first="false"
        @update:modelValue="onStatusFilterChange"
      >
        <template v-slot:noResult><span>No status found</span></template>
      </Multiselect>
    </BFormGroup>
  </div>
</template>
<script setup lang="ts">
import CommonUtils, { type StatusOptionType } from '@/utils/common-utils';
import Multiselect from 'vue-multiselect';
import { ref, watch } from 'vue';
import { useAuthUserStore } from '@/store';
import { BFormGroup } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';

type Props = {
  statusOptions?: StatusOptionType[];
};

const props = withDefaults(defineProps<Props>(), {
  statusOptions: () => [],
});

const store = useAuthUserStore();
const { selectedStatus } = storeToRefs(store);

const optionsStatus = ref(props.statusOptions);

const emit = defineEmits(['on-findings-status-change']);

function onStatusFilterChange(newValue: StatusOptionType[]) {
  selectedStatus.value = newValue;
  emit('on-findings-status-change');
}

optionsStatus.value = CommonUtils.parseStatusOptions(store.get_finding_status_list);

watch(
  () => props.statusOptions,
  (newStatusOption) => (optionsStatus.value = newStatusOption),
);
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
