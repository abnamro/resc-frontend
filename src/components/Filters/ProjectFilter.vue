<template>
  <div class="flex flex-col justify-start">
    <label for="projects" class="font-bold text-lg text-left text-muted-color-emphasis"
      >Projects</label
    >
    <MultiSelect
      v-model:model-value="selectedProject"
      :options="props.projectOptions"
      display="chip"
      class="w-full"
      placeholder="Select Project"
      :show-toggle-all="false"
      :filter="true"
      :virtualScrollerOptions="{ itemSize: 44 }"
      id="projects"
      @update:model-value="onProjectFilterChange"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import { ref } from 'vue';

type Props = {
  projectOptions: string[];
  projectSelected?: string;
};

const props = defineProps<Props>();

const selectedProject = ref(props.projectSelected);

const emit = defineEmits(['on-project-change']);

function onProjectFilterChange() {
  emit('on-project-change', selectedProject.value ?? undefined);
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
