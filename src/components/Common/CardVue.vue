<template>
  <!-- <div> -->
    <Card
      :pt:body:class="'p-0 min-w-[200px]'"
      :pt:caption:class="'px-4 py-2 bg-emerald-200/50 rounded-t-xl'"
      :pt:title:class="'flex items-center justify-center'"
      :pt:content:class="'px-4 pb-2 flex items-center justify-center font-bold'">
      <template #title>
        <p class="p-0 m-0 font-bold text-sm">{{ title }}</p>
        <template v-if="titleIconDefinition">
            <FontAwesomeIcon
              :id="titleIconTooltipId"
              class="ml-2"
              :style="titleIconStyle"
              :icon="titleIconDefinition"
              v-tooltip.right="titleIconTooltip"
            />
        </template>
      </template>
      <template #content>
          <h5 class="mb-0" :style="contentStyle">
            {{ formatCardBodyContent }}
          </h5>
          <FontAwesomeIcon
            v-if="contentIconDefinition"
            class="ml-2"
            :style="contentIconStyle"
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
  fontSize: '12px',
});
const contentIconStyle = ref({
  color: props.contentIconColor,
  fontSize: '20px',
});
const contentStyle = ref({
  color: props.contentIconColor,
  fontSize: '17px',
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
