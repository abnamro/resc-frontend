<template>
  <ProgressSpinner v-if="!loadedData"></ProgressSpinner>
  <template v-else>
    <form ref="form" @submit.stop.prevent="onSubmit" class="flex flex-col gap-4">
      <SelectStatus v-model:status="status" :invalid="!isStatusValid" />
      <SetComment :invalid="!isCommentValid" v-model:comment="comment" />
    </form>
    <div class="flex justify-end gap-2 mt-2">
      <Button severity="primary" @click="onSubmit" :disabled="!isStatusValid || !isCommentValid">
        APPLY
      </Button>
    </div>
  </template>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import FindingsService from '@/services/findings-service';
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
import { computed, ref } from 'vue';
import { MAX_COMMENT_LENGTH } from '@/configuration/config';
import ProgressSpinner from 'primevue/progressspinner';
import SelectStatus from '@/components/ScanFindings/Form/SelectStatus.vue';
import SetComment from '@/components/ScanFindings/Form/SetComment.vue';
import Button from 'primevue/button';

const loadedData = ref(true);

type Props = {
  finding: DetailedFindingRead;
};
const props = defineProps<Props>();
const status = ref(props.finding.status ?? ('NOT_ANALYZED' as FindingStatus | ''));
const comment = ref(props.finding.comment ?? '');

const isStatusValid = computed(() => status.value !== '');
const isCommentValid = computed(() =>
  comment.value !== '' && comment.value.length > MAX_COMMENT_LENGTH ? false : true,
);

function onSubmit(event: Event) {
  event.preventDefault();
  if (!isStatusValid.value || !isCommentValid.value) {
    return;
  }

  loadedData.value = false;
  FindingsService.auditFindings([props.finding.id_], status.value as FindingStatus, comment.value)
    .then(() => {
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}
</script>
