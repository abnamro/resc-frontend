<template>
  <DataTable :value="data" class="w-1/4" size="small">
    <Column field="field" body-class="font-bold border-none" header-class="border-none"></Column>
    <Column field="value" body-class=" border-none" header-class="border-none">
      <template #body="slotProps">
        <div v-if="slotProps.data.field === 'Deleted at'" class="flex gap-2 items-center">
          <ToggleSwitch
            size="small"
            v-model="repoDeleted"
            inputId="onlyIfHasUntriagedFindings"
            :disabled="!loadedData"
            @change="handleDeletedChange"
          >
          </ToggleSwitch>
          <small class="text-nowrap" v-if="repositoryData.deleted_at">{{
            repositoryData.deleted_at.substring(0, 10)
          }}</small>
        </div>
        <template v-else>
          {{ slotProps.data.value }}
        </template>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AxiosConfig from '@/configuration/axios-config';
import RepositoryService from '@/services/repository-service';
import type { RepositoryRead, VCSInstanceRead } from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import ToggleSwitch from 'primevue/toggleswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

type Props = {
  repository: RepositoryRead;
  vcs_instance: VCSInstanceRead;
};

const props = defineProps<Props>();

const repositoryData = ref(props.repository);
const repoDeleted = ref(props.repository.deleted_at ? true : false);
const loadedData = ref(true);

const data = computed(() => [
  {
    field: 'VCS Instance',
    value: props.vcs_instance.name,
  },
  {
    field: 'Project',
    value: repositoryData.value.project_key,
  },
  {
    field: 'VCS Instance',
    value: repositoryData.value.repository_name,
  },
  {
    field: 'Deleted at',
    value: repositoryData.value.repository_name,
  },
]);

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
      AxiosConfig.handleError(error);
      repoDeleted.value = repositoryData.value.deleted_at ? true : false;
    });
}
</script>
