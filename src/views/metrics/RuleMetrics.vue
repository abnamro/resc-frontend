<template>
  <div class="p-4">
    <h1 class="text-left text-3xl mb-10">RULE METRICS</h1>

    <Panel :pt:header:class="'hidden'" class="pt-[1.125rem]">
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
    </Panel>

    <Panel :pt:header:class="'hidden'" class="mt-8 pt-[1.125rem] rounded-b-none">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-teal-500/20 text-lg">
            <th
              class="pl-2"
              :class="{
                'cursor-pointer hover:text-primary-emphasis': true,
                'text-primary-emphasis-alt': sortBy === 'rule_name',
              }"
              @click="toggleSort('rule_name')"
            >
              Rule <SorterBtn :is="sortBy === 'rule_name'" :by="sortOrder" />
            </th>
            <th
              :class="{
                'cursor-pointer hover:text-primary-emphasis': true,
                'text-primary-emphasis-alt': sortBy === 'true_positive_rate',
              }"
              @click="toggleSort('true_positive_rate')"
            >
              True Positive Rate <SorterBtn :is="sortBy === 'true_positive_rate'" :by="sortOrder" />
            </th>
            <th>True Positive</th>
            <th>False Positive</th>
            <th>Clarification Required</th>
            <th>Not Accessible</th>
            <th>Not Analyzed</th>
            <th>Outdated</th>
            <th
              :class="{
                'cursor-pointer hover:text-primary-emphasis': true,
                'text-primary-emphasis-alt': sortBy === 'finding_count',
              }"
              @click="toggleSort('finding_count')"
            >
              Total Count <SorterBtn :is="sortBy === 'finding_count'" :by="sortOrder" />
            </th>
            <th class="w-36 md:w-48 xl:w-72">Findings (%)</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="ruleList === undefined">
            <tr>
              <td colspan="10" class="text-center p-4">
                <i class="pi pi-spin pi-spinner mr-2"></i> Loading data...
              </td>
            </tr>
          </template>
          <tr
            v-else
            v-for="(data, idx) in ruleOrderedList"
            :key="`${data.rule_name}`"
            class="hover:bg-teal-450/5"
            @click="goToRuleAnalysisPage(idx)"
          >
            <td class="pl-2">{{ data.rule_name }}</td>
            <td class="py-1">{{ data.true_positive_rate }}</td>
            <td class="py-1">{{ data.tpCount }}</td>
            <td class="py-1">{{ data.fpCount }}</td>
            <td class="py-1">{{ data.crCount }}</td>
            <td class="py-1">{{ data.urCount }}</td>
            <td class="py-1">{{ data.naCount }}</td>
            <td class="py-1">{{ data.odCount }}</td>
            <td class="py-1">{{ data.finding_count }}</td>
            <td>
              <HealthBar
                :truePositive="data.tpCount"
                :falsePositive="data.fpCount"
                :notAnalyzed="data.naCount"
                :notAccessible="data.urCount"
                :clarificationRequired="data.crCount"
                :outdated="data.odCount"
                :totalCount="data.finding_count ?? 0"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>

    <Panel header="Totals" v-if="ruleList !== undefined" class="rounded-t-none">
      <div class="flex flex-col">
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
    </Panel>
  </div>
</template>

<script setup lang="ts">
import HealthBar from '@/components/Common/HealthBar.vue';
import RulePackFilter from '@/components/Filters/RulePackFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import RuleService from '@/services/rule-service';
import RuleTagsFilter from '@/components/Filters/RuleTagsFilter.vue';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import { computed, ref } from 'vue';
import type {
  FindingStatus,
  PaginationType,
  RuleFindingCountModel,
  RulePackRead,
} from '@/services/shema-to-types';
import { useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import CommonUtils from '@/utils/common-utils';
import ToggleSwitch from 'primevue/toggleswitch';
import FindingStatusBadge from '@/components/Common/FindingStatusBadge.vue';
import { dispatchError } from '@/configuration/config';
import Panel from 'primevue/panel';
import SorterBtn from '@/components/Common/SorterBtn.vue';
import { useSorting } from '@/composables/useSorting';

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
const ruleList = ref<undefined | RuleFindingCountModelAugmented[]>(undefined);
const ruleTagsList = ref<string[]>([]);
const sortBy = ref<'rule_name' | 'true_positive_rate' | 'finding_count' | undefined>(undefined);
const sortOrder = ref<1 | -1>(1);

const { alphaNumSort } = useSorting(sortBy, sortOrder);
const ruleOrderedList = computed(() => {
  if (ruleList.value === undefined) {
    return undefined;
  }
  if (sortBy.value === undefined) {
    return ruleList.value;
  }

  // @ts-expect-error complaining because object != reccord string.
  return ruleList.value.toSorted(alphaNumSort);
});

const truePositiveTotalCount = ref(0);
const falsePositiveTotalCount = ref(0);
const clarificationRequiredTotalCount = ref(0);
const notAccessibleTotalCount = ref(0);
const notAnalyzedTotalCount = ref(0);
const outdatedTotalCount = ref(0);
const totalFindingsCountForAllRules = ref(0);
const truePositiveRateList = ref<number[]>([]);
const avgTruePosiitveRate = ref('0');
const allRulePackVersions = ref<RulePackRead[]>([]);
const selectedRuleTags = ref<string[]>([]);
const selectedVersionsList = ref<RulePackRead[]>([]);
const selectedVersions = ref<string[]>([]);
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
    .catch(dispatchError);
}

function fetchRulesWithFindingStatusCount() {
  ruleList.value = undefined;
  RuleService.getRulesWithFindingStatusCount(
    selectedVersions.value,
    selectedRuleTags.value,
    includeDeletedRepositories.value,
  )
    .then((response: AxiosResponse<RuleFindingCountModel[]>) => {
      getTotalCountRowValuesForRuleMetricsTable(response.data);
    })
    .catch(dispatchError);
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
    ruleList.value!.push(ruleFindingCountAugmented);

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
  if (ruleList.value && ruleList.value.length > 0 && truePositiveRateList.value.length > 0) {
    const sumOfTruePositveRates = truePositiveRateList.value.reduce((a, b) => a + b, 0);
    avgTruePosiitveRate.value = `${Math.round(sumOfTruePositveRates / ruleList.value.length)}`;
  }
}

function goToRuleAnalysisPage(idx: number) {
  if (ruleOrderedList.value === undefined) {
    return;
  }

  const record = ruleOrderedList.value[idx];
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
  .catch(dispatchError);

function toggleSort(field: 'rule_name' | 'true_positive_rate' | 'finding_count') {
  if (sortBy.value === field) {
    sortOrder.value = -sortOrder.value as 1 | -1;
  } else {
    sortBy.value = field;
    sortOrder.value = 1;
  }
}
</script>
