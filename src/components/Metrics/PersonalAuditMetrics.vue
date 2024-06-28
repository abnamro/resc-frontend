<template>
  <!-- Spinner -->
  <SpinnerVue v-if="!loadedData" />

  <!-- Audit Activity Over Time -->
  <div v-if="loadedData">
    <div class="mx-4 pt-4 text-start page-title">
      <h5 class="text-nowrap">Audit Activity Over Time</h5>
    </div>

    <div class="mx-4 pt-2">
      <BCardGroup class="col-md-12" deck>
        <CardVue
          cardTitle="Today"
          :cardBodyContent="todayAuditCount"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          titleIconTooltip="Total number of findings you triaged today"
        />
        <CardVue
          cardTitle="Current Week"
          :cardBodyContent="currentWeekAuditCount"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          titleIconTooltip="Total number of findings you triaged this week"
        />
        <CardVue
          :cardTitle="`${DateUtils.getCurrentMonth()}-${DateUtils.getCurrentYear()}`"
          :cardBodyContent="currentMonthAuditCount"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          titleIconTooltip="Total number of findings you triaged this month"
        />
        <CardVue
          :cardTitle="`Year-${DateUtils.getCurrentYear()}`"
          :cardBodyContent="currentYearAuditCount"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          titleIconTooltip="Total number of findings you triaged this year"
        />
        <CardVue
          cardTitle="All Time"
          :cardBodyContent="allTimeAuditCount"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          titleIconTooltip="Total number of findings you triaged till today"
        />
      </BCardGroup>
    </div>
  </div>

  <div v-if="loadedData">
    <div class="row mx-4 pt-1 card-deck">
      <!-- Audit Trend -->
      <div class="w-auto px-0">
        <div class="pt-5 page-title">
          <h5 class="text-nowrap text-start">Audit Trend</h5>
        </div>

        <BCardGroup deck>
          <CardVue
            cardTitle="Current Week"
            :cardBodyContent="currentWeekAuditTrendPercentageCount"
            :contentColor="currentWeekAuditTrendContentColor"
            :contentIcon="currentWeekAuditTrendIcon"
            :contentIconColor="currentWeekAuditTrendIconColor"
            titleIcon="info-circle"
            titleIconColor="#948C8C"
            titleIconTooltip="Your audit trend this week in comparison to last week"
          />
        </BCardGroup>
      </div>

      <!-- Audit Rank -->
      <div class="w-auto px-0">
        <div class="pt-5 page-title">
          <h5 class="text-nowrap text-start">Audit Rank</h5>
        </div>

        <BCardGroup deck>
          <CardVue
            cardTitle="Current Week"
            :cardBodyContent="weeklyRankLabel"
            :contentColor="weeklyRankContentColor"
            :contentIcon="weeklyRankIcon"
            :contentIconColor="weeklyRankIconColor"
            titleIcon="info-circle"
            titleIconColor="#948C8C"
            titleIconTooltip="Your rank based on number of findings you triaged in current week"
          />
        </BCardGroup>
      </div>
    </div>
  </div>

  <div v-if="loadedData">
    <div class="mx-4 pt-4 text-start page-title">
      <h5 class="pt-5 text-nowrap">Audit Statistics</h5>
    </div>

    <div class="mx-4 pt-2">
      <BCardGroup class="col-md-12" deck>
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('TRUE_POSITIVE')"
          :cardBodyContent="truePositive"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('TRUE_POSITIVE')} audited.`"
        />
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('FALSE_POSITIVE')"
          :cardBodyContent="falsePositive"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('FALSE_POSITIVE')} audited.`"
        />
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('NOT_ACCESSIBLE')"
          :cardBodyContent="notAccessible"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('NOT_ACCESSIBLE')} audited.`"
        />
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('NOT_ANALYZED')"
          :cardBodyContent="notAnalyzed"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('NOT_ANALYZED')} audited.`"
        />
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('CLARIFICATION_REQUIRED')"
          :cardBodyContent="clarificationRequired"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('CLARIFICATION_REQUIRED')} audited.`"
        />
        <CardVue
          :cardTitle="CommonUtils.formatStatusLabels('OUTDATED')"
          :cardBodyContent="outdated"
          titleIcon="info-circle"
          titleIconColor="#948C8C"
          :titleIconTooltip="`Number of ${CommonUtils.formatStatusLabels('OUTDATED')} audited.`"
        />
      </BCardGroup>
    </div>
  </div>
</template>
<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import CardVue, { type CardIcon } from '@/components/Common/CardVue.vue';
import DateUtils from '@/utils/date-utils';
import CommonUtils from '@/utils/common-utils';
import MetricsService from '@/services/metrics-service';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import { ref, type Ref } from 'vue';
import type { AxiosResponse } from 'axios';
import type { PersonalAuditMetrics, Swr } from '@/services/shema-to-types';
import { BCardGroup } from 'bootstrap-vue-next';

const loadedData = ref(false);

const lastWeekAuditCount = ref(0);

const todayAuditCount = ref(0);
const currentWeekAuditCount = ref(0);
const currentMonthAuditCount = ref(0);
const currentYearAuditCount = ref(0);
const allTimeAuditCount = ref(0);

const truePositive = ref(0);
const falsePositive = ref(0);
const notAccessible = ref(0);
const notAnalyzed = ref(0);
const clarificationRequired = ref(0);
const outdated = ref(0);

const currentWeekAuditTrendPercentageCount = ref('0%');
const currentWeekAuditTrendIcon = ref(undefined) as Ref<CardIcon | undefined>;
const currentWeekAuditTrendIconColor = ref(undefined) as Ref<string | undefined>;
const currentWeekAuditTrendContentColor = ref(undefined) as Ref<string | undefined>;

const weeklyRankValue = ref(0) as Ref<string | number>;
const weeklyRankLabel = ref(undefined) as Ref<string | undefined>;
const weeklyRankIcon = ref(undefined) as Ref<CardIcon | undefined>;
const weeklyRankIconColor = ref(undefined) as Ref<string | undefined>;
const weeklyRankContentColor = ref(undefined) as Ref<string | undefined>;

function isDecimal(num: number): boolean {
  return num % 1 !== 0;
}

function formatPercentageChange(percentage: number): string {
  return isDecimal(percentage) ? percentage.toFixed(2) : percentage.toLocaleString();
}

function formatWeeklyRankLabel(rank: number): string {
  return rank ? convertToRank(rank) : 'No Activity';
}

function calculateAuditTrendInPercentage(): string {
  let percentageChange: number = 0;
  if (!currentWeekAuditCount.value && !lastWeekAuditCount.value) {
    percentageChange = 0;
  } else if (!lastWeekAuditCount.value && currentWeekAuditCount.value) {
    percentageChange = 100;
  } else {
    percentageChange =
      ((currentWeekAuditCount.value - lastWeekAuditCount.value) / lastWeekAuditCount.value) * 100;
  }
  const percentageChangeString = formatPercentageChange(percentageChange);

  if (parseInt(percentageChangeString) < 0) {
    currentWeekAuditTrendIcon.value = 'arrow-down';
    currentWeekAuditTrendIconColor.value = 'red';
    currentWeekAuditTrendContentColor.value = 'red';
  } else if (parseInt(percentageChangeString) > 0) {
    currentWeekAuditTrendIcon.value = 'arrow-up';
    currentWeekAuditTrendIconColor.value = 'green';
    currentWeekAuditTrendContentColor.value = 'green';
  }
  return `${percentageChangeString}%`;
}

function setIconsForAuditRank(rank: number) {
  const mapRankAttr: { icon: CardIcon; color: string }[] = [
    {
      // 0
      icon: 'thumbs-down',
      color: 'red',
    },
    {
      // 1
      icon: 'trophy',
      color: '#FFC107',
    },
    {
      // 2
      icon: 'medal',
      color: '#B87333',
    },
    {
      // 3
      icon: 'award',
      color: '#00BFFF',
    },
  ];
  if (rank < mapRankAttr.length) {
    weeklyRankIcon.value = mapRankAttr[rank].icon;
    weeklyRankIconColor.value = mapRankAttr[rank].color;
    weeklyRankContentColor.value = mapRankAttr[rank].color;
  }
  if (rank === 0) {
    weeklyRankValue.value = 'No Activity';
  }
}

function convertToRank(rank: number) {
  return rank.toString() + getRankSuffix(rank);
}

function getRankSuffix(rank: number): string {
  if ([11, 12, 13].includes(rank)) {
    return 'th';
  }
  switch (rank % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

MetricsService.getPersonalAuditMetrics()
  .then((response: AxiosResponse<PersonalAuditMetrics>) => {
    todayAuditCount.value = response.data.today ?? 0;
    currentWeekAuditCount.value = response.data.current_week ?? 0;
    lastWeekAuditCount.value = response.data.last_week ?? 0;
    currentMonthAuditCount.value = response.data.current_month ?? 0;
    currentYearAuditCount.value = response.data.current_year ?? 0;
    allTimeAuditCount.value = response.data.forever ?? 0;
    weeklyRankValue.value = response.data.rank_current_week ?? 0;

    truePositive.value = response.data.forever_breakdown?.true_positive ?? 0;
    falsePositive.value = response.data.forever_breakdown?.false_positive ?? 0;
    notAccessible.value = response.data.forever_breakdown?.not_accessible ?? 0;
    notAnalyzed.value = response.data.forever_breakdown?.not_analyzed ?? 0;
    clarificationRequired.value = response.data.forever_breakdown?.clarification_required ?? 0;
    outdated.value = response.data.forever_breakdown?.outdated ?? 0;
    weeklyRankLabel.value = formatWeeklyRankLabel(response.data.rank_current_week ?? 0);

    currentWeekAuditTrendPercentageCount.value = calculateAuditTrendInPercentage();
    setIconsForAuditRank(weeklyRankValue.value);

    loadedData.value = true;
  })
  .catch((error: Swr) => {
    AxiosConfig.handleError(error);
  });
</script>
