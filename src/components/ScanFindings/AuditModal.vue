<template>
  <Dialog
    :header="`AUDIT ${props.selectedCheckBoxIds.length} FINDINGS`"
    v-model:visible="visible"
    @hide="resetModal"
    class="w-[500px]"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit" class="flex flex-col gap-4">
      <SelectStatus v-model:status="status" :invalid="!isStatusValid" />
      <SetComment :invalid="!isCommentValid" v-model:comment="comment" />
    </form>
    <div class="flex justify-end gap-2 mt-8">
      <Button severity="primary" @click="handleOk" :disabled="!isStatusValid || !isCommentValid">
        APPLY
      </Button>
      <Button severity="secondary" @click="visible = false"> CLOSE </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import FindingsService from '@/services/findings-service';
import { computed, ref, type Ref } from 'vue';
import type { FindingStatus } from '@/services/shema-to-types';
import { nextTick } from 'vue';
import { dispatchError, MAX_COMMENT_LENGTH } from '@/configuration/config';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import SelectStatus from './Form/SelectStatus.vue';
import SetComment from './Form/SetComment.vue';

const visible = defineModel('visible') as Ref<boolean>;

type Props = {
  selectedCheckBoxIds: number[];
};
const props = defineProps<Props>();

const emit = defineEmits(['update-audit']);

const comment = ref('');
const status = ref('NOT_ANALYZED' as FindingStatus | '');

const isStatusValid = computed(() => {
  return status.value !== '';
});
const isCommentValid = computed(() => {
  return comment.value !== '' && comment.value.length > MAX_COMMENT_LENGTH ? false : true;
});

function resetModal() {
  status.value = 'NOT_ANALYZED';
  comment.value = '';
}

function handleOk(event: Event) {
  event.preventDefault();
  handleSubmit();
}

function handleSubmit() {
  if (!isStatusValid.value || !isCommentValid.value) {
    return;
  }

  FindingsService.auditFindings(
    props.selectedCheckBoxIds,
    status.value as FindingStatus,
    comment.value,
  )
    .then(() => {
      emit('update-audit', status, comment);
    })
    .catch(dispatchError);

  // Hide the modal manually
  nextTick(() => {
    visible.value = false;
  });
}
</script>
