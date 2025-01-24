<template>
  <div class="flex text-start">
    <!-- Finding info -->
    <div class="w-1/3 flex flex-col gap-1">
      <div>
        <span class="font-bold">Commit ID: </span
        ><a
          class="cursor-pointer text-primary-emphasis underline hover:text-primary-emphasis-alt"
          :href="props.finding.commit_url ?? ''"
          target="_blank"
          >{{ props.finding.commit_id.slice(0, 16) }}</a
        >
      </div>
      <div><span class="font-bold">File Path: </span>{{ props.finding.file_path }}</div>
      <div><span class="font-bold">Line Number: </span>{{ props.finding.line_number }}</div>
      <div>
        <span class="font-bold">Position: </span>{{ props.finding.column_start }} -
        {{ props.finding.column_end }}
      </div>
      <div><span class="font-bold">Author: </span>{{ props.finding.author }}</div>
      <div><span class="font-bold">Email: </span>{{ props.finding.email }}</div>
      <div><span class="font-bold">Commit Time: </span>{{ props.finding.commit_timestamp }}</div>
      <div>
        <span class="font-bold text-ellipsis">Commit Message: </span
        >{{ props.finding.commit_message }}
      </div>
      <div><span class="font-bold">Rulepack: </span>{{ props.finding.rule_pack }}</div>
    </div>
    <!-- Audit and History Tabs -->
    <Tabs value="0" class="w-2/3">
      <TabList>
        <Tab value="0">Audit</Tab>
        <Tab value="1">History</Tab>
        <Tab value="2">Rule</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <AuditTab :finding="props.finding" />
        </TabPanel>
        <TabPanel value="1">
          <HistoryTab :finding="props.finding"></HistoryTab>
        </TabPanel>
        <TabPanel value="2">
          <RuleTab
            :ruleName="props.finding.rule_name"
            :rulePack="props.finding.rule_pack"
          ></RuleTab>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import AuditTab from '@/components/ScanFindings/Tabs/AuditTab.vue';
import HistoryTab from '@/components/ScanFindings/Tabs/HistoryTab.vue';
import RuleTab from '@/components/ScanFindings/Tabs/RuleTab.vue';
import type { AugmentedDetailedFindingRead } from '@/services/shema-to-types';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

type Props = {
  finding: AugmentedDetailedFindingRead;
};
const props = defineProps<Props>();
</script>
