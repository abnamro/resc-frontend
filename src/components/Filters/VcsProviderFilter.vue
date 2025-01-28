<template>
  <div class="flex flex-col justify-start">
    <label for="vcs" class="font-bold text-lg text-left text-muted-color-emphasis"
      >VCS Providers</label
    >
    <MultiSelect
      v-model:model-value="selectedVcsProviders"
      :options="optionsVcsProviders"
      display="chip"
      class="w-full"
      option-label="label"
      placeholder="Select VCS Provider"
      :show-toggle-all="false"
      id="vcs"
      @update:model-value="onVcsFilterChange"
    >
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import CommonUtils from '@/utils/common-utils';
import RepositoryService from '@/services/repository-service';
import { ref } from 'vue';
import type { VCSProviders } from '@/services/shema-to-types';
import MultiSelect from 'primevue/multiselect';
import { dispatchError } from '@/configuration/config';

type VcsProvider = {
  id: number;
  value: string;
  label: string;
};

type Props = {
  vcsProvidersOptions?: VcsProvider[];
  vcsProvidersSelected?: VcsProvider[];
};

const props = withDefaults(defineProps<Props>(), {
  vcsProvidersOptions: () => [],
  vcsProvidersSelected: () => [],
});

const optionsVcsProviders = ref(props.vcsProvidersOptions);
const selectedVcsProviders = ref(props.vcsProvidersSelected);

const emit = defineEmits(['on-vcs-change']);

function onVcsFilterChange() {
  if (selectedVcsProviders.value.length > 0) {
    const vcsProviderValues = [];
    for (const vcs of selectedVcsProviders.value) {
      vcsProviderValues.push(vcs.value);
    }
    emit('on-vcs-change', vcsProviderValues);
  } else {
    emit('on-vcs-change', []);
  }
}

RepositoryService.getVCSProviders()
  .then((response) => {
    optionsVcsProviders.value = [];
    for (const index of response.data.keys()) {
      const vcsJson: VcsProvider = {
        id: index,
        value: response.data[index],
        label: CommonUtils.formatVcsProvider(response.data[index] as VCSProviders),
      };
      optionsVcsProviders.value.push(vcsJson);
    }
  })
  .catch(dispatchError);
</script>
