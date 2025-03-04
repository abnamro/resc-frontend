<template>
  <div class="flex">
    <div class="w-1/3 text-left">
      <Button
        class="mr-3"
        severity="primary"
        v-on:click="isAuditModalVisible = true"
        :disabled="props.auditButtonDisabled"
        >AUDIT</Button
      >
      <Button
        v-if="props.hasColumnSelector"
        class=""
        severity="primary"
        v-on:click="isColumnSelectorVisible = true"
        >Columns</Button
      >
    </div>
    <div class="w-2/3 text-left">
      <InputText
        class="opacity-0 hover:opacity-100 focus:opacity-100 valid:opacity-100 w-1/2 transition-all duration-200 ease-in-out"
        id="filterFiles"
        placeholder="f:filename r:rulename rp:repository"
        v-model="filterString"
        :required="true"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import type { Ref } from 'vue';

const props = defineProps<{
  hasColumnSelector: boolean;
  auditButtonDisabled: boolean;
}>();
const isAuditModalVisible = defineModel('isAuditModalVisible') as Ref<boolean>;
const isColumnSelectorVisible = defineModel('isColumnSelectorVisible') as Ref<boolean>;
const filterString = defineModel('filterString') as Ref<string>;
</script>
