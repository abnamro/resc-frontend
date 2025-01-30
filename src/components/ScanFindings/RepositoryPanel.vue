<template>
  <Panel :pt:header:class="'hidden'" class="w-full lg:w-2/3 xl:w-1/2 2xl:w-1/3 mb-4 pt-[1.125rem]">
    <table class="text-left">
      <tbody>
        <tr>
          <td class="font-bold pr-8 py-2">VCS Instance</td>
          <td>{{ props.vcsInstance.name }}</td>
        </tr>
        <tr>
          <td class="font-bold pr-8 py-2">Project</td>
          <td>{{ repositoryData.project_key }}</td>
        </tr>
        <tr>
          <td class="font-bold pr-8 py-2">Repository</td>
          <td>{{ repositoryData.repository_name }}</td>
        </tr>
        <tr>
          <td class="font-bold pr-8 py-2">Repository Id</td>
          <td>{{ repositoryData.repository_id }}</td>
        </tr>
        <tr>
          <td class="font-bold pr-8 py-2">Deleted at</td>
          <td class="flex items-center">
            <ToggleSwitch
              size="small"
              v-model="repoDeleted"
              inputId="onlyIfHasUntriagedFindings"
              :disabled="!loadedData"
              @change="handleDeletedChange"
            >
            </ToggleSwitch>
            <span class="ml-2 text-nowrap" v-if="repositoryData.deleted_at">{{
              repositoryData.deleted_at.substring(0, 10)
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </Panel>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RepositoryService from '@/services/repository-service';
import type { RepositoryRead, VCSInstanceRead } from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import ToggleSwitch from 'primevue/toggleswitch';
import { dispatchError } from '@/configuration/config';
import Panel from 'primevue/panel';

type Props = {
  repository: RepositoryRead;
  vcsInstance: VCSInstanceRead;
};

const props = defineProps<Props>();

const repositoryData = ref(props.repository);
const repoDeleted = ref(props.repository.deleted_at ? true : false);
const loadedData = ref(true);

const emit = defineEmits(['on-delete-at-change']);

function handleDeletedChange() {
  loadedData.value = false;
  RepositoryService.toggleDeletedAtForRepository(props.repository.id_)
    .then((response: AxiosResponse<RepositoryRead>) => {
      loadedData.value = true;
      repositoryData.value = response.data;
      repoDeleted.value = repositoryData.value.deleted_at ? true : false;
      emit('on-delete-at-change');
    })
    /* istanbul ignore next @preserve */
    .catch((error) => {
      dispatchError(error);
      repoDeleted.value = repositoryData.value.deleted_at ? true : false;
    });
}
</script>
