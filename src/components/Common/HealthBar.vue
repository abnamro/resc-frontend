<template>
  <div>
    <BProgress class="mt-2" :max="props.totalCount" height="0.8rem" show-value>
      <BProgressBar
        v-b-popover.hover.bottom="getPopOverContent('True Positive', props.truePositive)"
        :value="props.truePositive"
        variant="danger"
      >
        <div>
          <small>
            <strong>{{ showFindingsInPercentage(props.truePositive) }}</strong></small
          >
        </div>
      </BProgressBar>
      <BProgressBar
        v-b-popover.hover.bottom="getPopOverContent('False Positive', props.falsePositive)"
        :value="props.falsePositive"
        variant="success"
      >
        <div>
          <small
            ><strong>{{ showFindingsInPercentage(props.falsePositive) }}</strong></small
          >
        </div>
      </BProgressBar>
      <BProgressBar
        v-b-popover.hover.bottom="
          getPopOverContent('Clarification Required', props.clarificationRequired)
        "
        :value="props.clarificationRequired"
        variant="warning"
      >
        <div>
          <small
            ><strong>{{ showFindingsInPercentage(props.clarificationRequired) }}</strong></small
          >
        </div>
      </BProgressBar>
      <BProgressBar
        v-b-popover.hover.bottom="getPopOverContent('Not Accessible', props.notAccessible)"
        :value="props.notAccessible"
        variant="info"
      >
        <div>
          <small
            ><strong>{{ showFindingsInPercentage(props.notAccessible) }}</strong></small
          >
        </div>
      </BProgressBar>
      <!-- @vue-ignore -->
      <BProgressBar
        v-b-popover.hover.bottom="getPopOverContent('Not Analyzed', props.notAnalyzed)"
        :value="props.notAnalyzed"
        variant="not-analyzed"
      >
        <div>
          <small
            ><strong>{{ showFindingsInPercentage(props.notAnalyzed) }}</strong></small
          >
        </div>
      </BProgressBar>
      <BProgressBar
        v-b-popover.hover.bottom="getPopOverContent('Outdated', props.outdated)"
        :value="props.outdated"
        variant="dark"
      >
        <div>
          <small
            ><strong>{{ showFindingsInPercentage(props.outdated) }}</strong></small
          >
        </div>
      </BProgressBar>
    </BProgress>
  </div>
</template>
<script setup lang="ts">
import { BProgress, BProgressBar } from 'bootstrap-vue-next';
type Props = {
  truePositive: number;
  falsePositive: number;
  notAnalyzed: number;
  notAccessible: number;
  clarificationRequired: number;
  outdated: number;
  totalCount: number;
};
const props = defineProps<Props>();

const percent = 100;
function showFindingsInPercentage(count: number) {
  return String(Math.round((count / props.totalCount) * percent));
}

function getPopOverContent(title: string, count: number) {
  const percentage = showFindingsInPercentage(count);
  return `${title}<hr>count: ${count}, percentage: ${percentage}%`;
}
</script>
