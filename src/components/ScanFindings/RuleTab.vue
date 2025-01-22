<template>
  <div>
    <BTab title="RULE" title-item-class="tab-pills" v-on:click="fetchRuleForRulePack">
      <ProgressSpinner v-if="!loadedData" />

      <div class="pr-1" v-if="loadedData && rule">
        <BCardText v-if="rule?.description"
          ><span class="fw-bold">Description: </span>{{ rule.description }}</BCardText
        >
        <BCardText v-if="rule?.regex"
          ><span class="fw-bold">Regex: </span>{{ rule.regex }}</BCardText
        >
        <BCardText v-if="rule?.path"><span class="fw-bold">Path: </span>{{ rule.path }}</BCardText>
        <BCardText v-if="rule?.comment"
          ><span class="fw-bold">Comment: </span>{{ rule.comment }}</BCardText
        >
      </div>
      <div class="pr-1" v-if="loadedData && !rule">Rule not found.</div>
    </BTab>
  </div>
</template>

<script setup lang="ts">
import AxiosConfig from '@/configuration/axios-config';
import RulePackService from '@/services/rule-pack-service';
import type { RuleRead } from '@/services/shema-to-types';
import { ref } from 'vue';
import { BCardText, BTab } from 'bootstrap-vue-next';
import ProgressSpinner from 'primevue/progressspinner';

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
    })
    .catch((error) => {
      loadedData.value = true;
      AxiosConfig.handleError(error);
    });
}
</script>
