<template>
  <Card
    class="rounded-sm overflow-hidden"
    :pt:body:class="'p-0 min-w-[200px]'"
    :pt:caption:class="'px-4 py-2 bg-teal-450/20'"
    :pt:title:class="'flex items-center justify-center'"
    :pt:content:class="'px-4 pb-2 flex items-center justify-center font-bold'"
  >
    <template #title>
      <p class="p-0 m-0 font-bold text-sm">{{ title }}</p>
      <template v-if="titleIconDefinition">
        <FontAwesomeIcon
          :id="titleIconTooltipId"
          class="ml-2 text-xs"
          :style="titleIconStyle"
          :icon="titleIconDefinition"
          v-tooltip.right="titleIconTooltip"
        />
      </template>
    </template>
    <template #content>
      <span class="text-lg leading-6" :style="contentStyle">
        {{ formatCardBodyContent }}
      </span>
      <FontAwesomeIcon
        v-if="contentIconDefinition"
        class="ml-2 text-xl"
        :style="contentStyle"
        :icon="contentIconDefinition"
      />
    </template>
  </Card>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Card from 'primevue/card';

export type CardIcon =
  | 'info-circle'
  | 'arrow-down'
  | 'arrow-up'
  | 'thumbs-down'
  | 'trophy'
  | 'medal'
  | 'award';

type Props = {
  cardTitle: string;
  cardBodyContent?: number | string;
  titleIcon?: CardIcon;
  titleIconColor?: string;
  titleIconTooltip?: string;
  contentColor?: string;
  contentIcon?: CardIcon;
  contentIconColor?: string;
};

const props = defineProps<Props>();

const title = ref(props.cardTitle);
const titleIconStyle = ref({
  color: props.titleIconColor,
});
const contentStyle = ref({
  color: props.contentIconColor,
});

const titleIconDefinition = ref(props.titleIcon ? ['fas', props.titleIcon] : null);
const contentIconDefinition = ref(props.contentIcon ? ['fas', props.contentIcon] : null);
const formatCardBodyContent = ref(
  props.cardBodyContent ? props.cardBodyContent.toLocaleString() : '0',
);
const titleIconTooltip = ref(props.titleIconTooltip);
// This converts a tooltip in a HTML compliant ID
const titleIconTooltipId = ref(props.titleIconTooltip?.replace(/ /g, '') ?? 'no');
</script>
