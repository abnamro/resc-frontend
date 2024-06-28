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
            <span class="badge bg-secondary">{{ repository_data.project_key }}</span>
          </td>
        </tr>
        <tr>
          <th>Repository</th>
          <td>
            <span class="badge bg-secondary">{{ repository_data.repository_name }}</span>
          </td>
        </tr>
        <tr>
          <th>Deleted at</th>
          <td>
            <BFormCheckbox
              v-model="repo_deleted"
              name="check-button"
              switch
              :disabled="!loadedData"
              @change="handleDeletedChange"
            >
              <small class="text-nowrap" v-if="repository_data.deleted_at">{{
                repository_data.deleted_at.substring(0, 10)
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

const repository_data = ref(props.repository);
const repo_deleted = ref(props.repository.deleted_at ? true : false);
const loadedData = ref(true);

const emit = defineEmits(['on-delete-at-change']);

function handleDeletedChange() {
  loadedData.value = false;
  RepositoryService.toggleDeletedAtForRepository(props.repository.id_)
    .then((response: AxiosResponse<RepositoryRead>) => {
      loadedData.value = true;
      repository_data.value = response.data;
      repo_deleted.value = repository_data.value.deleted_at ? true : false;
      emit('on-delete-at-change');
    })
    /* istanbul ignore next @preserve */
    .catch((error) => {
      AxiosConfig.handleError(error);
      repo_deleted.value = repository_data.value.deleted_at ? true : false;
    });
}
</script>
