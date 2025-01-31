<template>
  <div class="flex flex-col justify-start">
    <label for="rules" class="font-bold text-lg text-left text-muted-color-emphasis">Rules</label>
    <MultiSelect
      v-model:model-value="selectedRules"
      :options="props.rulesOptions"
      display="chip"
      class="w-full"
      placeholder="Select Rules"
      :show-toggle-all="false"
      :filter="true"
      id="rules"
      @update:model-value="onRuleFilterChange"
      :pt:option:class="'text-gray-840 dark:text-gray-130'"
      :pt:overlay:class="'bg-gray-0 dark:bg-gray-870 dark:border-gray-780'"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import { ref, watch } from 'vue';

type Props = {
  rulesOptions: string[];
  rulesSelected?: string[];
};

const props = withDefaults(defineProps<Props>(), { rulesSelected: () => [] });

const selectedRules = ref(props.rulesSelected);
const emit = defineEmits(['on-rule-change']);

function onRuleFilterChange() {
  if (selectedRules.value.length > 0) {
    emit('on-rule-change', selectedRules.value);
  } else {
    emit('on-rule-change', []);
  }
}

function resetRuleFilterSelection() {
  selectedRules.value = props.rulesSelected;
}

// Double check if I work.
watch(
  () => props.rulesSelected,
  (newValue, _second) => {
    selectedRules.value = newValue;
  },
);

// We probably need to expose this.
defineExpose({ resetRuleFilterSelection });
</script>
