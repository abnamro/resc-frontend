<template>
  <Dialog header="Import Rulepack" v-model:visible="visible" @hide="resetModal" class="w-[500px]">
    <div class="flex justify-center" v-if="!loadedData">
      <ProgressSpinner />
    </div>
    <form v-else @submit.stop.prevent="submitForm" class=" ">
      <div class="flex gap-4 mb-3 items-center">
        <InputText
          type="text"
          v-model="version"
          placeholder="version"
          @keyup="validateVersion"
          required
        />
        <div class="w-full text-sm">
          <a href="https://semver.org/" target="_blank" rel="noopener">semver</a>
          Example: 1.0.0
        </div>
      </div>
      <FileUpload mode="basic" name="file" @select="handleFile" />
    </form>
    <div class="flex justify-end gap-2 mt-8">
      <Button severity="primary" @click="handleOk" :disabled="!file || !versionState">
        UPLOAD
      </Button>
      <Button severity="secondary" @click="hide"> CLOSE </Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import { toast } from 'vue3-toastify';
import RulePackService from '@/services/rule-pack-service';
import { nextTick, ref, type Ref } from 'vue';
import { OK } from '@/configuration/axios-config';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload';

const loadedData = ref(true);
const visible = defineModel('visible') as Ref<boolean>;

const RulePackUploadModal = ref();

const file = ref(undefined) as Ref<File | undefined>;
const version = ref('');
const versionState = ref(null) as Ref<boolean | null>;
const emit = defineEmits(['on-file-upload-suceess']);

function hide(): void {
  version.value = '';
  file.value = undefined;
  versionState.value = null;
  visible.value = false;
}

function resetModal(): void {
  version.value = '';
  file.value = undefined;
  versionState.value = null;
}

function validateVersion(): boolean {
  versionState.value = false;
  const versionRegex = /^\d+(?:\.\d+){2}$/;
  if (versionRegex.test(version.value)) {
    versionState.value = true;
    return true;
  }
  return false;
}

function handleFile(event: FileUploadSelectEvent) {
  file.value = event.files[0];
}

function handleOk(event: Event) {
  event.preventDefault();
  submitForm();
}

function submitForm() {
  loadedData.value = false;
  RulePackService.uploadRulePack(version.value, file.value as File)
    .then((response) => {
      emit('on-file-upload-suceess');
      if (response && response.status === OK) {
        toast.success('Rulepack uploaded successfully');
      }
      loadedData.value = true;
      // Hide the modal manually
      nextTick(() => {
        RulePackUploadModal.value.hide();
      });
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
      loadedData.value = false;
    });
}
</script>
