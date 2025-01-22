<template>
  <div class="flex flex-col justify-start">
    <label for="repositories" class="font-bold text-lg text-left text-muted-color-emphasis"
      >Repositories</label
    >
    <MultiSelect
      v-model:model-value="selectedRepository"
      :options="props.repositoryOptions"
      display="chip"
      class="w-full"
      placeholder="Select Repositories"
      :show-toggle-all="false"
      :filter="true"
      :virtualScrollerOptions="{ itemSize: 44 }"
      id="repositories"
      @update:model-value="onRepositoryFilterChange"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import { ref } from 'vue';

type Props = {
  repositoryOptions: string[];
  repositorySelected?: string;
};

const props = defineProps<Props>();

const selectedRepository = ref(props.repositorySelected);

const emit = defineEmits(['on-repository-change']);

function onRepositoryFilterChange() {
  emit('on-repository-change', selectedRepository.value ?? undefined);
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
