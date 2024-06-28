<template>
  <div>
    <BTab title="AUDIT" title-item-class="tab-pills">
      <SpinnerVue v-if="!loadedData" />
      <BForm class="pl-1 pr-4" @submit="onSubmit" @reset="onReset" v-if="loadedData" novalidate>
        <BFormGroup
          label="Status"
          label-for="status-select"
          label-class="mr-sm-2 fw-bold small"
          invalid-feedback="Status is required"
          :state="isStatusValid"
        >
          <BFormSelect
            id="status-select"
            class="mb-2 mr-sm-2 mb-sm-0"
            size="sm"
            v-model="status"
            required
          >
            <option v-for="status in statusList" :value="status.value" :key="status.id">
              {{ status.label }}
            </option>
          </BFormSelect>
        </BFormGroup>
        <BFormGroup
          label="Comment"
          label-for="comment-textarea"
          label-class="mr-sm-2 fw-bold small"
          invalid-feedback="Maximum 255 characters are allowed"
          :state="isCommentValid"
        >
          <BFormTextarea
            id="comment-textarea"
            placeholder="Enter Comment"
            size="sm"
            rows="3"
            trim
            v-model="comment"
            :state="isCommentValid"
          ></BFormTextarea>
        </BFormGroup>

        <BButton type="submit" variant="primary" :disabled="!isStatusValid || !isCommentValid">
          Save
        </BButton>
      </BForm>
    </BTab>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import CommonUtils, { type StatusOptionType } from '@/utils/common-utils';
import FindingsService from '@/services/findings-service';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import type { DetailedFindingRead, FindingStatus } from '@/services/shema-to-types';
import { computed, ref } from 'vue';
import { useAuthUserStore } from '@/store';
import { BButton, BForm, BFormGroup, BFormSelect, BFormTextarea, BTab } from 'bootstrap-vue-next';

const loadedData = ref(false);

type Props = {
  finding: DetailedFindingRead;
};
const props = defineProps<Props>();

const finding = ref(props.finding);

const status = ref(props.finding.status ?? ('NOT_ANALYZED' as FindingStatus | ''));
const comment = ref(props.finding.comment ?? '');
const statusList = ref([] as StatusOptionType[]);
const selectedFindingIds = ref([] as number[]);

const isStatusValid = computed(() => {
  return status.value !== '';
});
const isCommentValid = computed(() => {
  return comment.value !== '' && comment.value.length > 255 ? false : true;
});

function onSubmit(event: Event) {
  event.preventDefault();
  if (!isStatusValid.value || !isCommentValid.value) {
    return;
  }

  loadedData.value = false;
  selectedFindingIds.value = [];
  if (finding.value.id_) {
    selectedFindingIds.value.push(finding.value.id_);
  }

  finding.value.status = status.value as FindingStatus;
  finding.value.comment = comment.value;

  FindingsService.auditFindings(
    selectedFindingIds.value,
    status.value as FindingStatus,
    comment.value,
  )
    .then(() => {
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function onReset(event: Event) {
  event.preventDefault();
}

const store = useAuthUserStore();
statusList.value = CommonUtils.parseStatusOptions(store.get_finding_status_list);
loadedData.value = true;
</script>
