<template>
  <ProgressSpinner v-if="!loadedData" />
  <div class="flex flex-col gap-2" v-else-if="rule">
    <div v-if="rule?.description">
      <span class="font-bold">Description: </span>{{ rule.description }}
    </div>
    <div v-if="rule?.regex"><span class="font-bold">Regex: </span>{{ rule.regex }}</div>
    <div v-if="rule?.path"><span class="font-bold">Path: </span>{{ rule.path }}</div>
    <div v-if="rule?.comment"><span class="font-bold">Comment: </span>{{ rule.comment }}</div>
  </div>
  <div v-else>Rule not found.</div>
</template>

<script setup lang="ts">
import RulePackService from '@/services/rule-pack-service';
import type { RuleRead } from '@/services/shema-to-types';
import { onMounted, ref } from 'vue';
import ProgressSpinner from 'primevue/progressspinner';
import { dispatchError } from '@/configuration/config';

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
    .catch(dispatchError);
}

onMounted(fetchRuleForRulePack);
</script>
