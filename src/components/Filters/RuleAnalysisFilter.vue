<template>
  <div>
    <div class="row">
      <!--Rule Filter -->
      <div class="col-md-4 ml-3">
        <RuleFilter
          :rulesOptions="optionsRules"
          :rulesSelected="selectedRule"
          @on-rule-change="onRuleChange"
        />
      </div>
      <!-- Status Filter -->
      <div class="col-md-4">
        <FindingStatusFilter @on-findings-status-change="onFindingsStatusChange" />
      </div>
      <div class="col-md-2 mt-1 ml-1 pt-1">
        <b-button variant="primary" class="mt-4 w-100" size="sm" @click="toggleAdvancedSearch">
          Advanced Search
        </b-button>
      </div>
    </div>

    <div class="ml-3 mt-2 mb-1">
      <BCollapse id="advance-search-collapse" v-model="advancedSearchVisible">
        <div class="row pt-1">
          <!-- VCS Filter -->
          <div class="col-md-3">
            <VcsProviderFilter @on-vcs-change="onVcsProviderChange" />
          </div>
          <!--Project Filter -->
          <div class="col-md-3">
            <ProjectFilter
              :projectOptions="props.projectOptions"
              @on-project-change="onProjectChange"
            />
          </div>
          <!--Repository Filter -->
          <div class="col-md-4">
            <RepositoryFilter
              :repositoryOptions="props.repositoryOptions"
              @on-repository-change="onRepositoryChange"
            />
          </div>
        </div>

        <div class="row pt-1">
          <!-- Start Date Filter -->
          <div class="col-md-2">
            <BFormGroup class="label-title text-start" label="From Date" label-for="start-date">
              <VueDatePicker
                id="start-date"
                placeholder="Enter Scan Start Date"
                :enable-time-picker="false"
                v-model="startDate"
                format="dd/MM/yyyy"
                @update:model-value="onStartDateChange"
                :max-date="todaysDate"
                auto-apply
                no-today
              ></VueDatePicker>
            </BFormGroup>
          </div>

          <!-- End Date Filter -->
          <div class="col-md-2">
            <BFormGroup class="label-title text-start" label="To Date" label-for="end-date">
              <VueDatePicker
                id="end-date"
                placeholder="Enter Scan End Date"
                :enable-time-picker="false"
                v-model="startDate"
                format="dd/MM/yyyy"
                @update:model-value="onEndDateChange"
                :min-date="minEndDate"
                :max-date="todaysDate"
                :disabled="endDateDisabled"
                auto-apply
                no-today
              >
              </VueDatePicker>
            </BFormGroup>
          </div>

          <div class="col-md-3">
            <RulePackFilter
              :rulePackPreSelected="props.rulePackPreSelected"
              :rulePackOptions="props.rulePackOptions"
              @on-rule-pack-version-change="onRulePackVersionChange"
              @set-rule-pack-versions-on-rule-pack-filter="setRulePackVersionsOnRulePackFilter"
            />
          </div>
          <!-- Rule Tags Filter -->
          <div class="col-md-3">
            <RuleTagsFilter
              :ruleTagsOptions="optionsRuleTags"
              :ruleTagsSelected="selectedRuleTags"
              @on-rule-tags-change="onRuleTagsChange"
            />
          </div>
        </div>

        <div class="row pt-3">
          <div class="col-md-4 text-start">
            <BFormCheckbox
              v-model="includeDeletedRepositories"
              name="check-button"
              switch
              @change="handleFilterChange"
            >
              <small class="text-nowrap"
                >Display findings for repositories marked as deleted.</small
              >
            </BFormCheckbox>
          </div>
        </div>
      </BCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { BCollapse, BFormCheckbox, BFormGroup } from 'bootstrap-vue-next';

type Props = {
  projectOptions?: string[];
  repositoryOptions?: string[];
  rulePackPreSelected?: RulePackRead[];
  rulePackOptions?: RulePackRead[];
};

const props = withDefaults(defineProps<Props>(), {
  projectOptions: () => [],
  repositoryOptions: () => [],
  rulePackPreSelected: () => [],
  rulePackOptions: () => [],
});

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
const optionsRuleTags = ref([] as string[]);
const startDate = ref(undefined) as Ref<Date | string | undefined>;
const endDate = ref(undefined) as Ref<Date | string | undefined>;

const selectedVcsProvider = ref([] as VCSProviders[]);
const selectedStatus = ref([] as FindingStatus[]);
const selectedProject = ref(undefined as string | undefined);
const selectedRepository = ref(undefined as string | undefined);
const selectedRule = ref([] as string[]);
const selectedRuleTags = ref([] as string[]);
const selectedRulePackVersions = ref([] as RulePackRead[]);
const advancedSearchVisible = ref(false);
const includeDeletedRepositories = ref(false);

const emit = defineEmits(['on-filter-change']);

const todaysDate = computed(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(today).toISOString();
});
const minEndDate = computed(() => {
  return startDate.value ?? '';
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

function onFindingsStatusChange(status: FindingStatus[]) {
  selectedStatus.value = status;
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

function onRulePackVersionChange(rulePackVersionsChanged: RulePackRead[]) {
  selectedRulePackVersions.value = rulePackVersionsChanged;
  fetchAllDetectedRules();
  fetchRuleTags();
  handleFilterChange();
}

function setRulePackVersionsOnRulePackFilter(rulePackVersionsChanged: RulePackRead[]) {
  selectedRulePackVersions.value = rulePackVersionsChanged;
  fetchAllDetectedRules();
  fetchRuleTags();
}

function handleFilterChange() {
  // Refresh table data in Rule Analysis page
  const rulePackVersionsValues = [];
  if (selectedRulePackVersions.value) {
    for (const obj of selectedRulePackVersions.value) {
      rulePackVersionsValues.push(obj.version);
    }
  }
  const filterObj: RuleAnalysisFilter = {
    startDate: CommonUtils.stringify_date(startDate.value),
    endDate: CommonUtils.stringify_date(endDate.value),
    vcsProvider: selectedVcsProvider.value,
    status: selectedStatus.value,
    project: selectedProject.value,
    repository: selectedRepository.value,
    rule: selectedRule.value,
    rulePackVersions: rulePackVersionsValues,
    ruleTags: selectedRuleTags.value,
    includeDeletedRepositories: includeDeletedRepositories.value,
  };
  emit('on-filter-change', filterObj);
}

function fetchAllDetectedRules() {
  const rulePackVersionsFetched: string[] = [];
  if (selectedRulePackVersions.value.length === 0) {
    for (const obj of selectedRulePackVersions.value) {
      rulePackVersionsFetched.push(obj.version);
    }
  }
  RuleService.getAllDetectedRules(
    selectedStatus.value,
    selectedVcsProvider.value,
    selectedProject.value,
    selectedRepository.value,
    CommonUtils.stringify_date(startDate.value),
    CommonUtils.stringify_date(endDate.value),
    rulePackVersionsFetched,
    includeDeletedRepositories.value,
  )
    .then((response) => {
      optionsRules.value = response.data;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function fetchRuleTags() {
  const rulePackVersionsFetched: string[] = [];
  if (selectedRulePackVersions.value) {
    for (const obj of selectedRulePackVersions.value) {
      rulePackVersionsFetched.push(obj.version);
    }
  }
  RulePackService.getRuleTagsByRulePackVersions(rulePackVersionsFetched)
    .then((response) => {
      optionsRuleTags.value = response.data;
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}

function applyRuleFilterInRuleAnalysisPage() {
  const store = useAuthUserStore();
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
      status: selectedStatus.value,
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
