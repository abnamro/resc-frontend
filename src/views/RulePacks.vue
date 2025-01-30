<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULEPACKS</h1>

    <!-- Import button to upload rulepack -->
    <div class="flex justify-start">
      <Button severity="warn" v-on:click="isRulePackUploadOpen = true"> IMPORT </Button>
    </div>
    <!-- RulePackUpload Modal -->
    <RulePackUploadModal
      v-model:visible="isRulePackUploadOpen"
      @on-file-upload-suceess="onRulePackUploadSuccess"
    />

    <Panel :pt:header:class="'hidden'" class="mt-2 pt-[1.125rem]">
      <table class="w-full">
        <thead>
          <tr class="bg-teal-500/20 text-lg">
            <th>Version</th>
            <th>Active</th>
            <th>Outdate</th>
            <th>Created</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="rulePackList === undefined">
            <tr>
              <td colspan="5" class="text-center p-4">
                <i class="pi pi-spin pi-spinner mr-2"></i> Loading data...
              </td>
            </tr>
          </template>
          <tr
            v-else
            v-for="data in rulePackList"
            class="hover:bg-teal-450/5"
            :key="`${data.version}`"
          >
            <td class="py-1" :class="{ 'font-bold': data.active }">{{ data.version }}</td>
            <td class="py-1">
              <FontAwesomeIcon
                :icon="['fas', 'circle-check']"
                :class="{
                  'dark:text-green-570 text-green-750': data.active,
                  'opacity-50 pointer-events-none': !data.active,
                }"
              />
            </td>
            <td class="py-1">
              <FontAwesomeIcon
                :icon="['fas', 'circle-check']"
                v-on:click="openMarkAsOutdated(data)"
                :class="{
                  'text-red-620 dark:text-red-400': data.outdated,
                  'opacity-50': true,
                  'cursor-not-allowed pointer-events-none': data.active,
                  'cursor-pointer': !data.active,
                }"
              />
            </td>
            <td class="py-1">
              {{ DateUtils.formatDate(data.created) }}
            </td>
            <td class="py-1">
              <FontAwesomeIcon
                icon="download"
                class="dark:text-blue-350 text-blue-660 cursor-pointer"
                @click="downloadRulePack(data.version)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <Paginator
        v-model:first="currentPage"
        v-model:rows="perPage"
        :totalRecords="totalRows"
        :rowsPerPageOptions="PAGE_SIZES"
        @update:first="handlePageClick"
        @update:rows="handlePageSizeChange"
      />
    </Panel>
  </div>
  <Dialog
    v-model:visible="isConfirmOpen"
    header="Mark findings as outdated?"
    :class="{ dark: dark }"
  >
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
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import { usePaginator } from '@/composables/usePaginator';
import { useAuthUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import Panel from 'primevue/panel';

const isRulePackUploadOpen = ref(false);
const store = useAuthUserStore();
const { dark } = storeToRefs(store);

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
