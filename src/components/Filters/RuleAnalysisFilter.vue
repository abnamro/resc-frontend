<template>
  <div class="grid grid-cols-10 gap-2">
    <!--Rule Filter -->
    <div class="col-span-4">
      <RuleFilter
        :rulesOptions="optionsRules"
        :rulesSelected="selectedRule"
        @on-rule-change="onRuleChange"
      />
    </div>
    <!-- Status Filter -->
    <div class="col-span-4">
      <FindingStatusFilter @on-findings-status-change="onFindingsStatusChange" />
    </div>
    <div class="col-span-2 mt-1 ml-1 flex flex-col justify-end">
      <Button
        class=""
        severity="warn"
        @click="toggleAdvancedSearch"
        >Advanced Search</Button
      >
    </div>
  </div>

  <Collapse :when="advancedSearchVisible">
    <div class="grid grid-cols-12 gap-x-2 gap-y-4 mt-4">
      <!-- VCS Filter -->
      <div class="col-span-4">
        <VcsProviderFilter @on-vcs-change="onVcsProviderChange" />
      </div>
      <!--Project Filter -->
      <div class="col-span-4">
        <ProjectFilter
          :projectOptions="props.projectOptions"
          @on-project-change="onProjectChange"
        />
      </div>
      <!--Repository Filter -->
      <div class="col-span-4">
        <RepositoryFilter
          :repositoryOptions="props.repositoryOptions"
          @on-repository-change="onRepositoryChange"
        />
      </div>

      <!-- Start Date Filter -->
      <div class="col-span-2">
        <div class="flex flex-col justify-start">
          <label for="start-date" class="font-bold text-lg text-left text-muted-color-emphasis"
            >From Date</label
          >
          <DatePicker
            v-model="startDate"
            placeholder="Enter Scan Start Date"
            date-format="dd/mm/yyyy"
            :max-date="todaysDate"
            @update:model-value="onStartDateChange"
          />
        </div>
      </div>

      <!-- End Date Filter -->
      <div class="col-span-2">
        <div class="flex flex-col justify-start">
          <label for="end-date" class="font-bold text-lg text-left text-muted-color-emphasis"
            >To Date</label
          >
          <DatePicker
            v-model="startDate"
            placeholder="Enter Scan End Date"
            date-format="dd/mm/yyyy"
            :min-date="minEndDate"
            :max-date="todaysDate"
            :disabled="endDateDisabled"
            @update:model-value="onEndDateChange"
          />
        </div>
      </div>

      <div class="col-span-4">
        <RulePackFilter
          :rulePackSelected="rulePackSelected"
          :rulePackOptions="props.rulePackOptions"
          @on-rule-pack-version-change="onRulePackVersionChange"
        />
      </div>
      <!-- Rule Tags Filter -->
      <div class="col-span-4">
        <RuleTagsFilter
          :ruleTagsOptions="optionsRuleTags"
          :ruleTagsSelected="selectedRuleTags"
          @on-rule-tags-change="onRuleTagsChange"
        />
      </div>

      <div class="col-span-12 text-left flex items-center">
        <ToggleSwitch
          size="small"
          v-model="includeDeletedRepositories"
          inputId="includeDeletedRepositories"
          @change="handleFilterChange"
        >
        </ToggleSwitch>
        <label for="includeDeletedRepositories" class="ml-2"
          >Display findings for repositories marked as deleted.</label
        >
      </div>
    </div>
  </Collapse>
</template>

<script setup lang="ts">
import FindingStatusFilter from '@/components/Filters/FindingStatusFilter.vue';
import ProjectFilter from '@/components/Filters/ProjectFilter.vue';
import RepositoryFilter from '@/components/Filters/RepositoryFilter.vue';
import RuleFilter from '@/components/Filters/RuleFilter.vue';
import RulePackService from '@/services/rule-pack-service';
import RuleService from '@/services/rule-service';
import CommonUtils from '@/utils/common-utils';
import { useAuthUserStore, type PreviousRouteState } from '@/store/index';
import VcsProviderFilter from '@/components/Filters/VcsProviderFilter.vue';
import RulePackFilter from '@/components/Filters/RulePackFilter.vue';
import RuleTagsFilter from '@/components/Filters/RuleTagsFilter.vue';
import { computed, ref } from 'vue';
import type { FindingStatus, RulePackRead, VCSProviders } from '@/services/shema-to-types';
import type { Ref } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import DatePicker from 'primevue/datepicker';
import { storeToRefs } from 'pinia';
import { Collapse } from 'vue-collapsed';
import Button from 'primevue/button';
import ToggleSwitch from 'primevue/toggleswitch';
import { dispatchError } from '@/configuration/config';

type Props = {
  projectOptions: string[];
  repositoryOptions: string[];
  rulePackOptions: RulePackRead[];
  ruleTagOptions: string[];
};

const props = defineProps<Props>();

const rulePackSelected = defineModel('rulePackFilter') as Ref<string[]>;

export type RuleAnalysisFilter = {
  startDate: string | undefined;
  endDate: string | undefined;
  vcsProvider: VCSProviders[];
  status: FindingStatus[];
  project: string | undefined;
  repository: string | undefined;
  rule: string[];
  ruleTags: string[];
  rulePackVersions: string[];
  includeDeletedRepositories: boolean;
};

const optionsRules = ref([] as string[]);
const optionsRuleTags = ref(props.ruleTagOptions);
const startDate = ref(undefined) as Ref<Date | undefined>;
const endDate = ref(undefined) as Ref<Date | undefined>;

const store = useAuthUserStore();
const { selectedStatus } = storeToRefs(store);

const selectedVcsProvider = ref([] as VCSProviders[]);
const selectedProject = ref(undefined as string | undefined);
const selectedRepository = ref(undefined as string | undefined);
const selectedRule = ref([] as string[]);
const selectedRuleTags = ref([] as string[]);
const advancedSearchVisible = ref(false);
const includeDeletedRepositories = ref(false);

const emit = defineEmits(['on-filter-change']);

const todaysDate = computed(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(today);
});
const minEndDate = computed(() => {
  return startDate.value;
});
const endDateDisabled = computed(() => {
  return startDate.value ? false : true;
});

function onStartDateChange() {
  fetchAllDetectedRules();
  handleFilterChange();
}

function onEndDateChange() {
  fetchAllDetectedRules();
  handleFilterChange();
}

function onVcsProviderChange(vcsProvider: VCSProviders[]) {
  selectedVcsProvider.value = vcsProvider;
  fetchAllDetectedRules();
  handleFilterChange();
}

function onProjectChange(project: string | undefined) {
  selectedProject.value = project;
  fetchAllDetectedRules();
  handleFilterChange();
}

function onRepositoryChange(repository: string | undefined) {
  selectedRepository.value = repository;
  fetchAllDetectedRules();
  handleFilterChange();
}

function onFindingsStatusChange() {
  fetchAllDetectedRules();
  handleFilterChange();
}

function onRuleChange(rule: string[]) {
  selectedRule.value = rule;
  handleFilterChange();
}

function onRuleTagsChange(ruleTagsChange: string[]) {
  selectedRuleTags.value = ruleTagsChange;
  handleFilterChange();
}

function onRulePackVersionChange(rulePackVersionsChanged: string[]) {
  rulePackSelected.value = rulePackVersionsChanged;
  fetchAllDetectedRules();
  fetchRuleTags();
  handleFilterChange();
}

function handleFilterChange() {
  // Refresh table data in Rule Analysis page
  const filterObj: RuleAnalysisFilter = {
    startDate: CommonUtils.stringify_date(startDate.value),
    endDate: CommonUtils.stringify_date(endDate.value),
    vcsProvider: selectedVcsProvider.value,
    status: selectedStatus.value.map((s) => s.value),
    project: selectedProject.value,
    repository: selectedRepository.value,
    rule: selectedRule.value,
    rulePackVersions: rulePackSelected.value,
    ruleTags: selectedRuleTags.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };
  emit('on-filter-change', filterObj);
}

function fetchAllDetectedRules() {
  RuleService.getAllDetectedRules(
    selectedStatus.value.map((s) => s.value),
    selectedVcsProvider.value,
    selectedProject.value,
    selectedRepository.value,
    CommonUtils.stringify_date(startDate.value),
    CommonUtils.stringify_date(endDate.value),
    rulePackSelected.value,
    includeDeletedRepositories.value,
  )
    .then((response) => {
      optionsRules.value = response.data;
    })
    .catch(dispatchError);
}

function fetchRuleTags() {
  RulePackService.getRuleTagsByRulePackVersions(rulePackSelected.value)
    .then((response) => {
      optionsRuleTags.value = response.data;
    })
    .catch(dispatchError);
}

function applyRuleFilterInRuleAnalysisPage() {
  const selectedRules = [];
  const selectedVersions = [];
  const storePreviousRouteState = store.previousRouteState as PreviousRouteState;
  if (storePreviousRouteState) {
    selectedRules.push(storePreviousRouteState.ruleName);
    if (storePreviousRouteState.rulePackVersions) {
      for (const obj of storePreviousRouteState.rulePackVersions) {
        selectedVersions.push(obj.version);
      }
    }
    if (storePreviousRouteState.ruleTags) {
      selectedRuleTags.value = storePreviousRouteState.ruleTags;
    }
  }
  const sourceRoute = store.sourceRoute;
  const destinationRoute = store.destinationRoute;

  if (
    selectedRules.length > 0 &&
    sourceRoute === '/metrics/rule-metrics' &&
    destinationRoute === '/rule-analysis'
  ) {
    const filterObj: RuleAnalysisFilter = {
      startDate: CommonUtils.stringify_date(startDate.value),
      endDate: CommonUtils.stringify_date(endDate.value),
      vcsProvider: selectedVcsProvider.value,
      status: selectedStatus.value.map((s) => s.value),
      project: selectedProject.value,
      repository: selectedRepository.value,
      rule: selectedRules,
      ruleTags: selectedRuleTags.value,
      rulePackVersions: selectedVersions,
      includeDeletedRepositories: includeDeletedRepositories.value,
    };

    //Populate rule analysis list based on rule filter
    emit('on-filter-change', filterObj);

    //Set rule fiter dropdown selected value
    selectedRule.value = selectedRules;
  } else {
    selectedRule.value = [];
  }
}

function toggleAdvancedSearch() {
  advancedSearchVisible.value = !advancedSearchVisible.value;
}

onKeyStroke('/', () => !shouldIgnoreKeystroke() && toggleAdvancedSearch(), {
  eventName: 'keydown',
});

applyRuleFilterInRuleAnalysisPage();
</script>
