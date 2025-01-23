<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULE METRICS</h1>

    <div class="flex gap-4 mb-2">
      <div class="w-1/4">
        <RulePackFilter
          :rulePackPreSelected="selectedVersionsList"
          :rulePackOptions="allRulePackVersions"
          @on-rule-pack-version-change="onRulePackVersionChange"
        />
      </div>
      <div class="w-1/4">
        <RuleTagsFilter
          ref="ruleTagsFilterChildComponent"
          :ruleTagsOptions="ruleTagsList"
          :ruleTagsSelected="selectedRuleTags"
          @on-rule-tags-change="onRuleTagsFilterChange"
        />
      </div>
    </div>
    <div class="text-left flex items-center">
      <ToggleSwitch
        size="small"
        v-model="includeDeletedRepositories"
        inputId="includeDeletedRepositories"
        @change="fetchRulesWithFindingStatusCount"
      >
      </ToggleSwitch>
      <label for="includeDeletedRepositories" class="ml-2"
        >Include data from repositories marked as deleted.</label
      >
    </div>

    <DataTable
      :value="ruleList"
      size="small"
      :loading="!loadedData"
      dataKey="_id"
      :highlight-on-select="true"
      selection-mode="single"
      :virtual-scroller-options="{ itemSize: 36 }"
      @row-click="goToRuleAnalysisPage"
      class="mt-8"
    >
      <Column field="rule_name" header="Rule" sortable header-class="bg-teal-500/20"></Column>
      <Column
        field="true_positive_rate"
        header="True Positive Rate"
        sortable
        header-class="bg-teal-500/20"
      >
      </Column>
      <!-- True Positive Count Column -->
      <Column field="tpCount" header="True Positive" header-class="bg-teal-500/20"></Column>
      <!-- False Positive Count Column -->
      <Column field="fpCount" header="False Positive" header-class="bg-teal-500/20"></Column>
      <!-- Clarification Required Count Column -->
      <Column
        field="crCount"
        header="Clarification Required"
        header-class="bg-teal-500/20"
      ></Column>
      <!-- Not Accessible Count Column -->
      <Column field="urCount" header="Not Accessible" header-class="bg-teal-500/20"></Column>
      <!-- Not Accessible Count Column -->
      <Column field="naCount" header="Not Analyzed" header-class="bg-teal-500/20"></Column>
      <!-- Outdated Count Column -->
      <Column field="odCount" header="Outdated" header-class="bg-teal-500/20"></Column>

      <Column field="finding_count" header="Total Count" sortable header-class="bg-teal-500/20">
      </Column>

      <Column header="Findings (%)" header-class="bg-teal-500/20" body-class="w-96">
        <template #body="slotProps">
          <HealthBar
            :truePositive="slotProps.data.tpCount"
            :falsePositive="slotProps.data.fpCount"
            :notAnalyzed="slotProps.data.naCount"
            :notAccessible="slotProps.data.urCount"
            :clarificationRequired="slotProps.data.crCount"
            :outdated="slotProps.data.odCount"
            :totalCount="slotProps.data.finding_count ?? 0"
          />
        </template>
      </Column>
      <template #footer>
        <div v-if="loadedData" class="flex flex-col">
          <h5 class="text-left font-bold text-lg mt-8">Totals</h5>
          <div class="text-left">
            <FindingStatusBadge status="TRUE_POSITIVE" /> :
            <span class="ml-4">{{ truePositiveTotalCount }}</span>
          </div>
          <div class="text-left">
            <FindingStatusBadge status="FALSE_POSITIVE" /> :
            <span class="ml-4">{{ falsePositiveTotalCount }}</span>
          </div>
          <div class="text-left">
            <FindingStatusBadge status="CLARIFICATION_REQUIRED" /> :
            <span class="ml-4">{{ clarificationRequiredTotalCount }}</span>
          </div>
          <div class="text-left">
            <FindingStatusBadge status="NOT_ACCESSIBLE" /> :
            <span class="ml-4">{{ notAccessibleTotalCount }}</span>
          </div>
          <div class="text-left">
            <FindingStatusBadge status="NOT_ANALYZED" /> :
            <span class="ml-4">{{ notAnalyzedTotalCount }}</span>
          </div>
          <div class="text-left">
            <FindingStatusBadge status="OUTDATED" /> :
            <span class="ml-4">{{ outdatedTotalCount }}</span>
          </div>
          <div class="text-left">
            Total number of Findings: <span class="ml-4">{{ totalFindingsCountForAllRules }}</span>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import HealthBar from '@/components/Common/HealthBar.vue';
import RulePackFilter from '@/components/Filters/RulePackFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import RuleService from '@/services/rule-service';
import RuleTagsFilter from '@/components/Filters/RuleTagsFilter.vue';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import { ref } from 'vue';
import type {
  FindingStatus,
  PaginationType,
  RuleFindingCountModel,
  RulePackRead,
  Swr,
} from '@/services/shema-to-types';
import { useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import CommonUtils from '@/utils/common-utils';
import ToggleSwitch from 'primevue/toggleswitch';
import type { DataTableRowClickEvent } from 'primevue/datatable';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import FindingStatusBadge from '../Common/FindingStatusBadge.vue';

const loadedData = ref(false);

type Stats = {
  tpCount: number;
  fpCount: number;
  naCount: number;
  urCount: number;
  crCount: number;
  odCount: number;
  true_positive_rate: string;
};

function getTruePositiveRate(stat: Stats): number {
  let truePositiveRate = Math.round((stat.tpCount / (stat.tpCount + stat.fpCount)) * 100);
  return truePositiveRate || 0;
}

type RuleFindingCountModelAugmented = RuleFindingCountModel & Stats;

const router = useRouter();
const ruleList = ref([] as RuleFindingCountModelAugmented[]);
const ruleTagsList = ref([] as string[]);
const truePositiveTotalCount = ref(0);
const falsePositiveTotalCount = ref(0);
const clarificationRequiredTotalCount = ref(0);
const notAccessibleTotalCount = ref(0);
const notAnalyzedTotalCount = ref(0);
const outdatedTotalCount = ref(0);
const totalFindingsCountForAllRules = ref(0);
const truePositiveRateList = ref([] as number[]);
const avgTruePosiitveRate = ref('0');
const allRulePackVersions = ref([] as RulePackRead[]);
const selectedRuleTags = ref([] as string[]);
const selectedVersionsList = ref([] as RulePackRead[]);
const selectedVersions = ref([] as string[]);
const includeDeletedRepositories = ref(false);

function onRuleTagsFilterChange(ruleTags: string[]) {
  selectedRuleTags.value = ruleTags;
  fetchRulesWithFindingStatusCount();
}

function fetchRuleTags() {
  RulePackService.getRuleTagsByRulePackVersions(selectedVersions.value)
    .then((response) => {
      selectedRuleTags.value = [];
      ruleTagsList.value = response.data;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchRulesWithFindingStatusCount() {
  loadedData.value = false;
  RuleService.getRulesWithFindingStatusCount(
    selectedVersions.value,
    selectedRuleTags.value,
    includeDeletedRepositories.value,
  )
    .then((response: AxiosResponse<RuleFindingCountModel[]>) => {
      getTotalCountRowValuesForRuleMetricsTable(response.data);
      loadedData.value = true;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function getTotalCountRowValuesForRuleMetricsTable(ruleListCounts: RuleFindingCountModel[]) {
  totalFindingsCountForAllRules.value = 0;
  truePositiveTotalCount.value = 0;
  falsePositiveTotalCount.value = 0;
  clarificationRequiredTotalCount.value = 0;
  outdatedTotalCount.value = 0;
  notAccessibleTotalCount.value = 0;
  notAnalyzedTotalCount.value = 0;
  notAnalyzedTotalCount.value = 0;
  truePositiveRateList.value = [];
  ruleList.value = [];

  ruleListCounts.forEach((rule: RuleFindingCountModel) => {
    const ruleFindingCountAugmented = getRuleFindingCountAugmented(rule);
    ruleList.value.push(ruleFindingCountAugmented);

    const truePositiveRate = getTruePositiveRate(ruleFindingCountAugmented);
    truePositiveRateList.value.push(truePositiveRate);

    totalFindingsCountForAllRules.value += ruleFindingCountAugmented.finding_count ?? 0;
    truePositiveTotalCount.value += ruleFindingCountAugmented.tpCount;
    falsePositiveTotalCount.value += ruleFindingCountAugmented.fpCount;
    clarificationRequiredTotalCount.value += ruleFindingCountAugmented.crCount;
    outdatedTotalCount.value += ruleFindingCountAugmented.odCount;
    notAccessibleTotalCount.value += ruleFindingCountAugmented.urCount;
    notAnalyzedTotalCount.value += ruleFindingCountAugmented.naCount;
  });

  calculateAverageTruePositiveRatePercentage();
}

function getRuleFindingCountAugmented(rule: RuleFindingCountModel): RuleFindingCountModelAugmented {
  let counts: { [key in FindingStatus]: number } = {
    TRUE_POSITIVE: 0,
    FALSE_POSITIVE: 0,
    CLARIFICATION_REQUIRED: 0,
    OUTDATED: 0,
    NOT_ACCESSIBLE: 0,
    NOT_ANALYZED: 0,
  };
  rule.finding_statuses_count?.forEach((findingStatus) => {
    counts[findingStatus.status] = findingStatus.count ?? 0;
  });

  const ruleFindingCountAugmented: RuleFindingCountModelAugmented = {
    rule_name: rule.rule_name,
    finding_count: rule.finding_count,
    finding_statuses_count: rule.finding_statuses_count,
    true_positive_rate: `${Math.round((counts['TRUE_POSITIVE'] / (counts['TRUE_POSITIVE'] + counts['FALSE_POSITIVE'] || 1)) * 100)}%`,
    tpCount: counts['TRUE_POSITIVE'],
    fpCount: counts['FALSE_POSITIVE'],
    naCount: counts['NOT_ANALYZED'],
    urCount: counts['NOT_ACCESSIBLE'],
    crCount: counts['CLARIFICATION_REQUIRED'],
    odCount: counts['OUTDATED'],
  };

  return ruleFindingCountAugmented;
}

function calculateAverageTruePositiveRatePercentage() {
  if (ruleList.value.length > 0 && truePositiveRateList.value.length > 0) {
    const sumOfTruePositveRates = truePositiveRateList.value.reduce((a, b) => a + b, 0);
    avgTruePosiitveRate.value = `${Math.round(sumOfTruePositveRates / ruleList.value.length)}`;
  }
}

function goToRuleAnalysisPage(event: DataTableRowClickEvent) {
  const record = event.data as RuleFindingCountModelAugmented;
  const store = useAuthUserStore();
  const updateState: PreviousRouteState = {
    ruleName: record.rule_name,
    rulePackVersions: selectedVersionsList.value,
    ruleTags: selectedRuleTags.value,
  };
  store.update_previous_route_state(updateState);
  router.push({ name: 'RuleAnalysis' });
}

function onRulePackVersionChange(rulePackVersions: RulePackRead[]) {
  selectedVersions.value = [];
  selectedVersionsList.value = [];
  if (rulePackVersions) {
    for (const obj of rulePackVersions) {
      selectedVersionsList.value.push(obj);
      selectedVersions.value.push(obj.version);
    }
    // Referesh rule tags dropdown options and reset selected value
    selectedRuleTags.value = [];
    fetchRuleTags();
  }
  fetchRulesWithFindingStatusCount();
}

RulePackService.getRulePackVersions(10000, 0)
  .then((response: AxiosResponse<PaginationType<RulePackRead>>) => {
    selectedVersions.value = [];
    allRulePackVersions.value = [];
    for (const index of response.data.data.keys()) {
      const data: RulePackRead = response.data.data[index];
      if (data.active) {
        selectedVersions.value.push(data.version);
        selectedVersionsList.value.push(data);
      }
      allRulePackVersions.value.push(data);
    }
    allRulePackVersions.value.sort(CommonUtils.compareRulePackRead).reverse();
    fetchRuleTags();
    fetchRulesWithFindingStatusCount();
  })
  .catch((error: Swr) => {
    AxiosConfig.handleError(error);
  });
</script>
