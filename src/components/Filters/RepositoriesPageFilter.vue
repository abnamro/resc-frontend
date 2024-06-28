<template>
  <div>
    <div class="row">
      <!--VCS Filter -->
      <div class="col-md-3">
        <VcsProviderFilter @on-vcs-change="onVcsProviderChange" />
      </div>

      <!--Project Filter -->
      <div class="col-md-4">
        <ProjectFilter
          :projectOptions="props.projectOptions"
          @on-project-change="onProjectChange"
        />
      </div>

      <!--Repository Search Filter -->
      <div class="col-md-4">
        <RepositoryFilter
          :repositoryOptions="props.repositoryOptions"
          @on-repository-change="onRepositoryChange"
        />
      </div>
    </div>

    <!-- Include zero finding repos -->
    <div class="row pt-3">
      <div class="col-md-3 text-start">
        <BFormCheckbox
          v-model="includeZeroFindingRepos"
          name="check-button"
          switch
          @change="handleFilterChange"
        >
          <small class="text-nowrap">Display repositories with 0 findings.</small>
        </BFormCheckbox>
      </div>
      <div class="col-md-4 text-start">
        <BFormCheckbox
          v-model="includeDeletedRepositories"
          name="check-button"
          switch
          @change="handleFilterChange"
        >
          <small class="text-nowrap">Display repositories marked as deleted.</small>
        </BFormCheckbox>
      </div>
      <div class="col-md-4 text-start">
        <BFormCheckbox
          v-model="onlyIfHasUntriagedFindings"
          name="check-button"
          switch
          @change="handleFilterChange"
        >
          <small class="text-nowrap">Display only repositories with untriaged findings.</small>
        </BFormCheckbox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectFilter from '@/components/Filters/ProjectFilter.vue';
import RepositoryFilter from '@/components/Filters/RepositoryFilter.vue';
import VcsProviderFilter from '@/components/Filters/VcsProviderFilter.vue';
import type { VCSProviders } from '@/services/shema-to-types';
import { BFormCheckbox } from 'bootstrap-vue-next';
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
