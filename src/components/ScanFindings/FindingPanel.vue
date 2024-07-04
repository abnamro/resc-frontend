<template>
  <div class="row text-start me-0 mr-0">
    <!-- Finding info -->
    <div class="col-md-5">
      <BCardText
        ><span class="fw-bold">Commit ID: </span
        ><a class="custom-link" v-bind:href="findingRef.commit_url ?? ''" target="_blank">{{
          findingRef.commit_id
        }}</a></BCardText
      >
      <BCardText><span class="fw-bold">File Path: </span>{{ findingRef.file_path }}</BCardText>
      <BCardText><span class="fw-bold">Line Number: </span>{{ findingRef.line_number }}</BCardText>
      <BCardText
        ><span class="fw-bold">Position: </span>{{ findingRef.column_start }} -
        {{ findingRef.column_end }}</BCardText
      >
      <BCardText><span class="fw-bold">Author: </span>{{ findingRef.author }}</BCardText>
      <BCardText><span class="fw-bold">Email: </span>{{ findingRef.email }}</BCardText>
      <BCardText
        ><span class="fw-bold">Commit Time: </span>{{ findingRef.commit_timestamp }}</BCardText
      >
      <BCardText
        ><span class="fw-bold elipsis">Commit Message: </span
        >{{ findingRef.commit_message }}</BCardText
      >
      <BCardText><span class="fw-bold">Rulepack: </span>{{ findingRef.rule_pack }}</BCardText>
    </div>

    <!-- Audit and History Tabs -->
    <div class="col-md-7">
      <BCard no-body class="text-start card-color">
        <BTabs pills card>
          <AuditTab :finding="findingRef"></AuditTab>
          <HistoryTab :finding="findingRef"></HistoryTab>
          <RuleTab :ruleName="findingRef.rule_name" :rulePack="findingRef.rule_pack"></RuleTab>
        </BTabs>
      </BCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuditTab from '@/components/ScanFindings/AuditTab.vue';
import HistoryTab from '@/components/ScanFindings/HistoryTab.vue';
import RuleTab from '@/components/ScanFindings/RuleTab.vue';
import type { AugmentedDetailedFindingRead } from '@/services/shema-to-types';
import { BCard, BCardText, BTabs } from 'bootstrap-vue-next';
import { ref } from 'vue';

type Props = {
  finding: AugmentedDetailedFindingRead;
};

const props = defineProps<Props>();
const findingRef = ref(props.finding);
</script>
<style scoped>
.custom-link {
  color: #005e5d;
}
a:hover {
  color: #005e5d;
}
.elipsis {
  text-overflow: ellipsis;
}
</style>
