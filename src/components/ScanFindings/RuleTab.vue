<template>
  <div>
    <b-tab title="RULE" title-item-class="tab-pills" v-on:click="fetchRuleForRulePack">
      <SpinnerVue v-if="!loadedData" />

      <div class="pr-1" v-if="loadedData">
        <b-card-text v-if="rule?.description"
          ><span class="fw-bold">Description: </span>{{ rule.description }}</b-card-text
        >
        <b-card-text v-if="rule?.regex"
          ><span class="fw-bold">Regex: </span>{{ rule.regex }}</b-card-text
        >
        <b-card-text v-if="rule?.path"
          ><span class="fw-bold">Path: </span>{{ rule.path }}</b-card-text
        >
        <b-card-text v-if="rule?.comment"
          ><span class="fw-bold">Comment: </span>{{ rule.comment }}</b-card-text
        >
      </div>
    </b-tab>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import RulePackService from '@/services/rule-pack-service';
import SpinnerVue from '@/components/Common/SpinnerVue.vue';
import type { RuleRead } from '@/services/shema-to-types';
import { ref } from 'vue';

const loadedData = ref(false);

type Props = {
  ruleName: string;
  rulePack: string;
};
const props = defineProps<Props>();

const rule = ref(null as RuleRead | null);

function fetchRuleForRulePack() {
  loadedData.value = false;
  RulePackService.getRuleFromRulePack(props.rulePack, props.ruleName)
    .then((response) => {
      rule.value = response.data;
      loadedData.value = true;
      console.log(rule.value);
    })
    .catch((error) => {
      AxiosConfig.handleError(error);
    });
}
</script>
