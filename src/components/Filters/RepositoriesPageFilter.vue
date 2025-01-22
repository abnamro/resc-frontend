<template>
  <div>
    <div class="grid grid-cols-10 gap-x-2 gap-y-4">
      <!--VCS Filter -->
      <div class="col-span-3">
        <VcsProviderFilter @on-vcs-change="onVcsProviderChange" />
      </div>

      <!--Project Filter -->
      <div class="col-span-3">
        <ProjectFilter
          :projectOptions="props.projectOptions"
          @on-project-change="onProjectChange"
        />
      </div>

      <!--Repository Search Filter -->
      <div class="col-span-3">
        <RepositoryFilter
          :repositoryOptions="props.repositoryOptions"
          @on-repository-change="onRepositoryChange"
        />
      </div>

    <!-- Include zero finding repos -->
      <div class="col-span-3 text-left flex items-center">
        <ToggleSwitch
          size="small"
          v-model="includeZeroFindingRepos"
          inputId="includeZeroFindingRepos"
          @change="handleFilterChange"
        >
        </ToggleSwitch>
        <label for="includeZeroFindingRepos" class=" ml-2">Display repositories with 0 findings.</label>
      </div>
      <div class="col-span-3 text-left flex items-center">
        <ToggleSwitch
          size="small"
          v-model="includeDeletedRepositories"
          inputId="includeDeletedRepositories"
          @change="handleFilterChange"
        >
        </ToggleSwitch>
        <label for="includeDeletedRepositories" class=" ml-2">Display repositories marked as deleted.</label>
      </div>
      <div class="col-span-3 text-left flex items-center">
        <ToggleSwitch
          size="small"
          v-model="onlyIfHasUntriagedFindings"
          inputId="onlyIfHasUntriagedFindings"
          @change="handleFilterChange"
        >
        </ToggleSwitch>
        <label for="onlyIfHasUntriagedFindings" class=" ml-2">Display only repositories with untriaged findings.</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectFilter from '@/components/Filters/ProjectFilter.vue';
import RepositoryFilter from '@/components/Filters/RepositoryFilter.vue';
import VcsProviderFilter from '@/components/Filters/VcsProviderFilter.vue';
import type { VCSProviders } from '@/services/shema-to-types';
import ToggleSwitch from 'primevue/toggleswitch';
import { ref } from 'vue';

type Props = {
  projectOptions: string[];
  projectSelected?: string;
  repositoryOptions: string[];
  repositorySelected?: string;
  vcsProviderSelected?: VCSProviders[];
};

const props = withDefaults(defineProps<Props>(), {
  vcsProviderSelected: () => [],
});

const selectedVcsProvider = ref(props.vcsProviderSelected);
const selectedProject = ref(props.projectSelected);
const selectedRepository = ref(props.repositorySelected);
const includeZeroFindingRepos = ref(false);
const includeDeletedRepositories = ref(false);
const onlyIfHasUntriagedFindings = ref(false);

const emit = defineEmits(['on-filter-change']);

function onProjectChange(project: string | undefined) {
  selectedProject.value = project;
  handleFilterChange();
}
function onRepositoryChange(repository: string | undefined) {
  selectedRepository.value = repository;
  handleFilterChange();
}
function onVcsProviderChange(vcsProvider: VCSProviders[]) {
  selectedVcsProvider.value = vcsProvider;
  handleFilterChange();
}

function handleFilterChange() {
  // Refresh table data in Repositories page
  emit(
    'on-filter-change',
    selectedVcsProvider.value,
    selectedProject.value,
    selectedRepository.value,
    includeZeroFindingRepos.value,
    includeDeletedRepositories.value,
    onlyIfHasUntriagedFindings.value,
  );
}
</script>
