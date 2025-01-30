<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULEPACKS</h1>

    <!-- Import button to upload rulepack -->
    <div class="flex justify-start">
      <Button
        severity="warn"
        v-on:click="isRulePackUploadOpen = true"
      >
        IMPORT
      </Button>
    </div>
    <!-- RulePackUpload Modal -->
    <RulePackUploadModal
      v-model:visible="isRulePackUploadOpen"
      @on-file-upload-suceess="onRulePackUploadSuccess"
    />

    <DataTable
      :value="rulePackList"
      size="small"
      :loading="rulePackList === undefined"
      dataKey="_id"
      :highlight-on-select="true"
      selection-mode="single"
      class="mt-2"
    >
      <Column field="version" header="Version"> </Column>
      <Column bodyClass="text-center">
        <template #header>
          <span class="font-bold text-center w-full">Active</span>
        </template>
        <template #body="slotProps">
          <FontAwesomeIcon
            v-if="slotProps.data.active"
            :icon="['fas', 'circle-check']"
            :class="'dark:text-green-570 text-green-750'"
          />
          <FontAwesomeIcon
            v-if="!slotProps.data.active"
            :icon="['fas', 'circle-check']"
            class="opacity-50 pointer-events-none"
          />
        </template>
      </Column>
      <Column bodyClass="text-center">
        <template #header>
          <span class="font-bold text-center w-full">Outdated</span>
        </template>
        <template #body="slotProps">
          <FontAwesomeIcon
            v-if="slotProps.data.outdated"
            :icon="['fas', 'circle-check']"
            v-on:click="openMarkAsOutdated(slotProps.data)"
            :class="{
              'text-red-620 dark:text-red-400': true,
              'opacity-50 pointer-events-none cursor-not-allowed': slotProps.data.active,
              'cursor-pointer': !slotProps.data.active
            }"
          />
          <FontAwesomeIcon
            v-if="!slotProps.data.outdated"
            :icon="['fas', 'circle-check']"
            :style="{ opacity: 'rgba(0,0,0,0.5)' }"
            @click="openMarkAsOutdated(slotProps.data)"
            :class="slotProps.data.active ? 'opacity-50 pointer-events-none' : 'cursor-pointer'"
          />
        </template>
      </Column>
      <Column field="created" header="Created">
        <template #body="slotProps">
          {{ DateUtils.formatDate(slotProps.data.created) }}
        </template>
      </Column>
      <Column
        header="Download"
        headerClass="bg-teal-500/20 text-center flex justify-center"
        bodyClass="text-center"
      >
        <template #body="slotProps">
          <FontAwesomeIcon
            icon="download"
            class="dark:text-blue-350 text-blue-660 cursor-pointer"
            @click="downloadRulePack(slotProps.data.version)"
          />
        </template>
      </Column>
    </DataTable>

    <Paginator
      v-model:first="currentPage"
      v-model:rows="perPage"
      :totalRecords="totalRows"
      :rowsPerPageOptions="PAGE_SIZES"
      @update:first="handlePageClick"
      @update:rows="handlePageSizeChange"
    />
  </div>
  <Dialog v-model:visible="isConfirmOpen" header="Mark findings as outdated?">
    <div>
      This will mark all findings from rule pack {{ rulePackSelected?.version }} and older as
      outdated.
    </div>
    <div class="flex gap-2 justify-end pt-3 pr-2">
      <Button severity="danger" block @click="markAsOutdated">Confirm</Button>
      <Button severity="secondary" block @click="cancelAction">Cancel</Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { dispatchError, PAGE_SIZES } from '@/configuration/config';
import DateUtils from '@/utils/date-utils';
import CommonUtils from '@/utils/common-utils';
import RulePackUploadModal from '@/components/RulePack/RulePackUploadModal.vue';
import RulePackService from '@/services/rule-pack-service';
import { onMounted, ref } from 'vue';
import type { AxiosResponse } from 'axios';
import type { PaginationType, RulePackRead } from '@/services/shema-to-types';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import { usePaginator } from '@/composables/usePaginator';

const isRulePackUploadOpen = ref(false);

const rulePackList = ref<RulePackRead[] | undefined>(undefined);

const { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange } =
  usePaginator(fetchPaginatedRulePacks);

const isConfirmOpen = ref(false);
const rulePackSelected = ref(null as RulePackRead | null);

function onRulePackUploadSuccess() {
  fetchPaginatedRulePacks();
}

function fetchPaginatedRulePacks() {
  rulePackList.value = undefined;
  RulePackService.getRulePackVersions(perPage.value, currentPage.value)
    .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
      rulePackList.value = response.data.data.sort(CommonUtils.compareRulePackRead).reverse();
      totalRows.value = response.data.total;
    })
    .catch(dispatchError);
}

function forceFileDownload(response: AxiosResponse<unknown>, title: string) {
  const url = window.URL.createObjectURL(new Blob([response.data] as BlobPart[]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', title);
  document.body.appendChild(link);
  link.click();
}

function downloadRulePack(rulePackVersion: string) {
  const title = `RESC-SECRETS-RULE_v${rulePackVersion}.TOML`;
  RulePackService.downloadRulePack(rulePackVersion)
    .then((response) => {
      forceFileDownload(response, title);
    })
    .catch(dispatchError);
}

function openMarkAsOutdated(rulePack: RulePackRead): void {
  rulePackSelected.value = rulePack;
  if (rulePackSelected.value.active === true) {
    rulePackSelected.value = null;
    return;
  }

  isConfirmOpen.value = true;
}

function cancelAction() {
  rulePackSelected.value = null;
  isConfirmOpen.value = false;
}

function markAsOutdated() {
  isConfirmOpen.value = false;
  if (rulePackSelected.value === null) {
    return;
  }

  RulePackService.markAsOutdated(rulePackSelected.value.version)
    .then((_response) => {})
    .catch(dispatchError);

  rulePackSelected.value = null;
}

onMounted(fetchPaginatedRulePacks);
</script>
