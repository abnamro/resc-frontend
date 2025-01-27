<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULEPACKS</h1>

    <!-- Import button to upload rulepack -->
    <div class="flex justify-start">
      <Button
        class="mt-2 mb-2 bg-yellow-520 border-none text-surface-950"
        v-on:click="showRulePackUploadModal()"
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
      :loading="!loadedData"
      dataKey="_id"
      :highlight-on-select="true"
      selection-mode="single"
      class="mt-2"
    >
      <Column field="version" header="Version" headerClass="bg-teal-500/20"> </Column>
      <Column headerClass="bg-teal-500/20" bodyClass="text-center">
        <template #header>
          <span class="font-bold text-center w-full">Active</span>
        </template>
        <template #body="slotProps">
          <FontAwesomeIcon
            v-if="slotProps.data.active"
            :icon="['fas', 'circle-check']"
            :style="{ color: 'green' }"
          />
          <FontAwesomeIcon
            v-if="!slotProps.data.active"
            :icon="['fas', 'circle-check']"
            class="disabled-button"
          />
        </template>
      </Column>
      <Column headerClass="bg-teal-500/20" bodyClass="text-center">
        <template #header>
          <span class="font-bold text-center w-full">Outdated</span>
        </template>
        <template #body="slotProps">
          <FontAwesomeIcon
            v-if="slotProps.data.outdated"
            :icon="['fas', 'circle-check']"
            :style="{ color: '#d2042d', cursor: 'pointer' }"
            v-on:click="openMarkAsOutdated(slotProps.data)"
            :class="slotProps.data.active ? 'disabled-button' : ''"
          />
          <FontAwesomeIcon
            v-if="!slotProps.data.outdated"
            :icon="['fas', 'circle-check']"
            :style="{ color: 'rgba(0,0,0,0.5)', cursor: 'pointer' }"
            @click="openMarkAsOutdated(slotProps.data)"
            :class="slotProps.data.active ? 'disabled-button' : ''"
          />
        </template>
      </Column>
      <Column field="created" header="Created" headerClass="bg-teal-500/20">
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
            class="download-button"
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
      @update:first="handlePageChange"
      @update:rows="handlePageSizeChange"
    />
  </div>
  <Dialog v-model:visible="isConfirmOpen" header="Mark findings as outdated?">
    <div>
      This will mark all findings from rule pack {{ rulePackSelected?.version }} and older as
      outdated.
    </div>
    <div class="flex gap-2 justify-end">
      <Button class="mt-3 float-end" severity="danger" block @click="markAsOutdated"
        >Confirm</Button
      >
      <Button class="mt-3 float-end me-2" severity="secondary" block @click="cancelAction"
        >Cancel</Button
      >
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import Config, { PAGE_SIZES } from '@/configuration/config';
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

const loadedData = ref(false);
const isRulePackUploadOpen = ref(false);

const rulePackList = ref([] as RulePackRead[]);
const totalRows = ref(0);
const currentPage = ref(0);
const perPage = ref(Number(`${Config.value('defaultPageSize')}`));

const isConfirmOpen = ref(false);
const rulePackSelected = ref(null as RulePackRead | null);

function handlePageSizeChange() {
  currentPage.value = 0;
  fetchPaginatedRulePacks();
}
function handlePageChange(val: number) {
  currentPage.value = val;
  fetchPaginatedRulePacks();
}

function showRulePackUploadModal() {
  isRulePackUploadOpen.value = true;
}
function onRulePackUploadSuccess() {
  fetchPaginatedRulePacks();
}

function fetchPaginatedRulePacks() {
  loadedData.value = false;
  RulePackService.getRulePackVersions(perPage.value, currentPage.value)
    .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
      rulePackList.value = response.data.data.sort(CommonUtils.compareRulePackRead).reverse();
      totalRows.value = response.data.total;
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
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
  loadedData.value = false;
  const title = `RESC-SECRETS-RULE_v${rulePackVersion}.TOML`;
  RulePackService.downloadRulePack(rulePackVersion)
    .then((response) => {
      forceFileDownload(response, title);
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
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
    .catch((error) => {
      AxiosConfig.handleError(error);
    });

  rulePackSelected.value = null;
}

onMounted(fetchPaginatedRulePacks);
</script>
