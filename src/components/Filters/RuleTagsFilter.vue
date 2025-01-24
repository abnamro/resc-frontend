<template>
  <div class="flex flex-col justify-start">
    <label for="tag" class="font-bold text-lg text-left text-muted-color-emphasis">Tags</label>
    <MultiSelect
      v-model:model-value="selectedRuleTags"
      :options="props.ruleTagsOptions"
      display="chip"
      class="w-full"
      placeholder="Select Tag"
      :show-toggle-all="false"
      id="tag"
      @update:model-value="onRuleTagFilterChange"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import { ref, watch } from 'vue';

type Props = {
  ruleTagsOptions: string[];
  ruleTagsSelected?: string[];
};

const props = withDefaults(defineProps<Props>(), { ruleTagsSelected: () => [] });
const selectedRuleTags = ref(props.ruleTagsSelected);

const emit = defineEmits(['on-rule-tags-change']);

function onRuleTagFilterChange() {
  if (selectedRuleTags.value.length > 0) {
    emit('on-rule-tags-change', selectedRuleTags.value);
  } else {
    emit('on-rule-tags-change', []);
  }
}

function resetRuleTagsFilterSelection() {
  selectedRuleTags.value = props.ruleTagsSelected;
}

// Double check if I work.
watch(
  () => props.ruleTagsSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (newValue, _second) => {
    selectedRuleTags.value = newValue;
  },
);

defineExpose({ resetRuleTagsFilterSelection });
</script>
