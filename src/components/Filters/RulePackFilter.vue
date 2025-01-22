<template>
  <div class="flex flex-col justify-start">
    <label for="rulePack" class="font-bold text-lg text-left text-muted-color-emphasis">Rule Pack</label>
    <MultiSelect v-model:model-value="selectedRulePack" :options="props.rulePackOptions" display="chip"
      optionLabel="version" class="w-full" placeholder="Select RulePack" :show-toggle-all="false" id="rulePack"
      @update:model-value="onRulePackVersionFilterChange">
      <template #option="slotProps">
        <div class="flex items-center">
          <div :class="{
            'line-through text-muted-color': slotProps.option.outdated
          }">{{ slotProps.option.version }}</div>
          <Tag v-if="slotProps.option.active" class="text-xs px-2 py-0.5 ml-4 font-bold bg-emerald-600 text-surface-0"
            value="active" />
          <Tag severity="danger" v-if="slotProps.option.outdated" class="text-xs px-2 py-0.5 ml-4 font-bold "
            value="Outdated" />
        </div>
      </template>
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import { useAuthUserStore } from '@/store/index';
import { onUpdated, ref } from 'vue';
import type { RulePackRead } from '@/services/shema-to-types';
import MultiSelect from 'primevue/multiselect';
import Tag from 'primevue/tag';

type Props = {
  rulePackOptions?: RulePackRead[];
  rulePackSelected?: RulePackRead[]; // For testing.
  rulePackPreSelected?: RulePackRead[];
};

const props = withDefaults(defineProps<Props>(), {
  rulePackOptions: () => [],
  rulePackSelected: () => [],
  rulePackPreSelected: () => [],
});

const selectedRulePack = ref(props.rulePackSelected);
const initialized = ref(false);

function isRedirectedFromRuleMetricsPage() {
  const store = useAuthUserStore();
  const sourceRoute = store.sourceRoute;
  const destinationRoute = store.destinationRoute;
  return sourceRoute === '/metrics/rule-metrics' &&
    destinationRoute === '/rule-analysis' &&
    store.previousRouteState
    ? true
    : false;
}

const emit = defineEmits([
  'on-rule-pack-version-change',
  'set-rule-pack-versions-on-rule-pack-filter',
]);

function onRulePackVersionFilterChange() {
  if (selectedRulePack.value.length > 0) {
    emit('on-rule-pack-version-change', selectedRulePack.value);
  } else {
    emit('on-rule-pack-version-change', []);
  }
}

function update() {
  if (
    !initialized.value &&
    props.rulePackPreSelected.length > 0 &&
    selectedRulePack.value.length < 1
  ) {
    initialized.value = true;
    if (isRedirectedFromRuleMetricsPage()) {
      // Get selected rule pack versions from Rule metrics screen and set it on Rule analyis page
      for (const obj of props.rulePackPreSelected) {
        selectedRulePack.value.push(obj);
      }
    } else {
      // Select the latest version of rule pack version on Rule analysis page filter
      selectedRulePack.value = props.rulePackPreSelected;
    }
    emit('set-rule-pack-versions-on-rule-pack-filter', selectedRulePack.value);
  }
}
onUpdated(() => update());
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
