<template>
  <div class="grid grid-cols-12 gap-x-2 gap-y-4">
    <!-- Scan Date Filter -->
    <div class="col-span-3">
      <div class="flex flex-col justify-start">
        <label for="scanDate" class="font-bold text-lg text-left text-muted-color-emphasis"
          >Scan Date</label
        >
        <Select
          v-model:model-value="selectedScan"
          :options="scanDateList"
          display="chip"
          class="w-full"
          :option-label="'scanDate'"
          placeholder="Select VCS Provider"
          :show-toggle-all="false"
          id="scanDate"
          @update:model-value="handleScanDateFilterChange"
        >
          <template #option="slotProps">
            {{ slotProps.option.scanDate }}: {{ slotProps.option.scanType }}
          </template>
        </Select>
      </div>
    </div>

    <!-- Rule Filter -->
    <div class="col-span-3">
      <RuleFilter
        ref="ruleFilterChildComponent"
        :rulesOptions="ruleList"
        @on-rule-change="handleRuleFilterChange"
      />
    </div>

    <!-- Status Filter -->
    <div class="col-span-3">
      <FindingStatusFilter @on-findings-status-change="handleFilterChange" />
    </div>

    <!-- Rule Tags Filter -->
    <div class="col-span-3">
      <RuleTagsFilter
        ref="ruleTagsFilterChildComponent"
        :ruleTagsOptions="ruleTagsList"
        :ruleTagsSelected="selectedRuleTags"
        @on-rule-tags-change="handleRuleTagsFilterChange"
      />
    </div>

    <!-- Include previous scan findings -->
    <div class="col-span-12 text-left flex items-center">
      <ToggleSwitch
        size="small"
        v-model="includePreviousScans"
        inputId="includePreviousScans"
        @change="togglePreviousScans"
        v-on:click="handleToggleButtonClick"
      >
      </ToggleSwitch>
      <label for="includePreviousScans" class="ml-2">Include previous scan findings.</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import Config, { dispatchError } from '@/configuration/config';
import DateUtils from '@/utils/date-utils';
import FindingStatusFilter from '@/components/Filters/FindingStatusFilter.vue';
import RuleFilter from '@/components/Filters/RuleFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import RuleTagsFilter from '@/components/Filters/RuleTagsFilter.vue';
import ScanFindingsService from '@/services/scan-findings-service';
import { onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RepositoryRead, ScanRead } from '@/services/shema-to-types';
import { onKeyStroke } from '@vueuse/core';
import Select from 'primevue/select';
import ToggleSwitch from 'primevue/toggleswitch';

const ruleFilterChildComponent = ref();
const ruleTagsFilterChildComponent = ref();

type Props = {
  repository: RepositoryRead;
  includePreviousScans?: boolean;
};

type ScanJson = {
  scanId: number;
  scanDate: string;
  scanType: 'Incremental' | 'Base';
  rulePackVersion: string;
};

const props = withDefaults(defineProps<Props>(), {
  includePreviousScans: () => false,
});

const previousScans = ref([] as ScanRead[]);
const scanList = ref([] as ScanRead[]);
const scanDateList = ref([] as ScanJson[]);
const ruleList = ref([] as string[]);
const ruleTagsList = ref([] as string[]);
const selectedScan = ref(null) as Ref<null | ScanJson>;
const selectedRule = ref([] as string[]);
const selectedRuleTags = ref([] as string[]);
const includePreviousScans = ref(props.includePreviousScans);
const skipRecords = ref(Number(`${Config.value('skipRecords')}`));
const limitRecords = ref(Number(`${Config.value('limitRecords')}`));

const router = useRouter();
const route = useRoute();

const emit = defineEmits(['previous-scans-checked', 'include-previous-scans', 'on-filter-change']);

function getPreviousScans() {
  if (selectedScan.value === null) {
    return;
  }

  for (const scan of scanList.value) {
    if (selectedScan.value.scanId >= scan.id_) {
      previousScans.value.push(scan);
      if (scan.scan_type === 'BASE') {
        break;
      }
    }
  }
}

function handleToggleButtonClick() {
  refreshRuleTagsOnToggleOfPreviousScansButton();
}

function togglePreviousScans() {
  if (includePreviousScans.value) {
    previousScans.value = [];
    getPreviousScans();
    emit('previous-scans-checked', true);
    emit('include-previous-scans', selectedRule.value, selectedRuleTags.value, previousScans.value);
  } else {
    previousScans.value = [];
    emit('previous-scans-checked', false);
    handleFilterChange();
  }

  // Refresh rules in filter based on scan ids
  refreshRuleFilter();
}

function handleScanDateFilterChange() {
  // On scan date reset the Rule tags filter selection
  selectedRuleTags.value = [];
  ruleTagsFilterChildComponent.value.resetRuleTagsFilterSelection();

  // On scan date reset the Rule filter selection
  selectedRule.value = [];
  ruleFilterChildComponent.value.resetRuleFilterSelection();
  fetchRules();
}
function handleRuleFilterChange(rule: string[]) {
  selectedRule.value = rule;
  handleFilterChange();
}
function handleRuleTagsFilterChange(ruleTags: string[]) {
  selectedRuleTags.value = ruleTags;
  handleFilterChange();
}

function handleFilterChange() {
  if (selectedScan.value === null) {
    return;
  }

  // Refresh findings
  if (!includePreviousScans.value) {
    emit('on-filter-change', selectedScan.value.scanId, selectedRule.value, selectedRuleTags.value);
  } else {
    togglePreviousScans();
  }
}

function getPreviousScanIds() {
  const previousScanIds: number[] = [];
  for (const scan of previousScans.value) {
    previousScanIds.push(scan.id_);
  }
  const scanIds = includePreviousScans.value
    ? previousScanIds
    : selectedScan.value !== null
      ? [selectedScan.value.scanId]
      : [];
  return scanIds;
}

function getSelectedRulePacks() {
  const rulePacksForPreviousScanIds = [];
  for (const scan of previousScans.value) {
    rulePacksForPreviousScanIds.push(scan.rule_pack);
  }
  const rulePacks = includePreviousScans.value
    ? rulePacksForPreviousScanIds
    : selectedScan.value !== null
      ? [selectedScan.value.rulePackVersion]
      : [];
  return rulePacks;
}
function refreshRuleFilter() {
  const scanIds = getPreviousScanIds();
  if (scanIds.length > 0) {
    ScanFindingsService.getRulesByScanIds(scanIds)
      .then((response) => {
        selectedRule.value = [];
        ruleList.value = response.data;
      })
      .catch(dispatchError);
  }
}

function fetchRules() {
  if (selectedScan.value === null) {
    return;
  }

  const scanIds = getPreviousScanIds();
  if (selectedScan.value.scanId && scanIds.length > 0) {
    ScanFindingsService.getRulesByScanIds(scanIds)
      .then((response) => {
        selectedRule.value = [];
        ruleList.value = response.data;

        // Fetch Rule Tags
        fetchRuleTags();
      })
      .catch(dispatchError);
  }
}

function fetchRuleTags() {
  const rulePackVersions = getSelectedRulePacks();
  RulePackService.getRuleTagsByRulePackVersions(rulePackVersions)
    .then((response) => {
      selectedRuleTags.value = [];
      ruleTagsList.value = response.data;

      // Refresh findings
      handleFilterChange();

      // if scanId gets changed, update it in route parameter
      if (Number(route.params.scanId) !== Number(selectedScan?.value?.scanId)) {
        router.replace({
          name: 'ScanFindings',
          params: { scanId: selectedScan?.value?.scanId },
        });
      }
    })
    .catch(dispatchError);
}
function refreshRuleTagsOnToggleOfPreviousScansButton() {
  const rulePackVersions = getSelectedRulePacks();
  RulePackService.getRuleTagsByRulePackVersions(rulePackVersions)
    .then((response) => {
      ruleTagsList.value = response.data;
      selectedRuleTags.value = [];
      ruleTagsFilterChildComponent.value.resetRuleTagsFilterSelection();
    })
    .catch(dispatchError);
}

function fetchScanDates() {
  ScanFindingsService.getScansByRepositoryId(
    props.repository.id_,
    skipRecords.value,
    limitRecords.value,
  )
    .then((res) => {
      const response: ScanRead[] = res.data.data;
      response.sort(function (a, b) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      scanDateList.value = [];
      scanList.value = response;

      for (const scan of scanList.value) {
        const scanJson: ScanJson = {
          scanId: scan.id_,
          scanDate: DateUtils.formatDate(scan.timestamp),
          scanType: scan.scan_type === 'INCREMENTAL' ? 'Incremental' : 'Base',
          rulePackVersion: scan.rule_pack,
        };

        // Set scan date value in select option when user clicks a record from Repositories page
        if (Number(route.params.scanId as string) === scan.id_) {
          selectedScan.value = scanJson;
        }
        scanDateList.value.push(scanJson);
      }

      //Sort scan dates
      scanDateList.value.sort(DateUtils.sortListByDate);

      //Rules depend upon scan/scan date selected
      fetchRules();
    })
    .catch(dispatchError);
}

onMounted(fetchScanDates);

/* istanbul ignore next @preserve */
onKeyStroke('p', () => {
  includePreviousScans.value = !includePreviousScans.value;
  togglePreviousScans();
  handleToggleButtonClick();
});
</script>
