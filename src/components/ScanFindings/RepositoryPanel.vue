<template>
  <div class="row">
    <table class="table table-sm table-borderless" aria-hidden="true">
      <tbody>
        <tr>
          <th>VCS Instance</th>
          <td>
            <span class="badge bg-secondary">{{ props.vcs_instance.name }}</span>
          </td>
        </tr>
        <tr>
          <th>Project</th>
          <td>
            <span class="badge bg-secondary">{{ repositoryData.project_key }}</span>
          </td>
        </tr>
        <tr>
          <th>Repository</th>
          <td>
            <span class="badge bg-secondary">{{ repositoryData.repository_name }}</span>
          </td>
        </tr>
        <tr>
          <th>Deleted at</th>
          <td>
            <BFormCheckbox
              v-model="repoDeleted"
              name="check-button"
              switch
              :disabled="!loadedData"
              @change="handleDeletedChange"
            >
              <small class="text-nowrap" v-if="repositoryData.deleted_at">{{
                repositoryData.deleted_at.substring(0, 10)
              }}</small>
            </BFormCheckbox>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AxiosConfig from '@/configuration/axios-config';
import RepositoryService from '@/services/repository-service';
import type { RepositoryRead, VCSInstanceRead } from '@/services/shema-to-types';
import type { AxiosResponse } from 'axios';
import { BFormCheckbox } from 'bootstrap-vue-next';

type Props = {
  repository: RepositoryRead;
  vcs_instance: VCSInstanceRead;
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
      AxiosConfig.handleError(error);
      repoDeleted.value = repositoryData.value.deleted_at ? true : false;
    });
}
</script>
