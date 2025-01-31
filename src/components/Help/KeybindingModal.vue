<template>
  <Dialog
    id="keybindings-table"
    v-model:visible="visible"
    modal
    header="Keyboard shortcuts"
    :class="{ dark: dark }"
  >
    <table>
      <tr v-for="data in keybindings" :key="data.effect" class="text-muted-color-emphasis">
        <td>{{ data.effect }}</td>
        <td class="py-1 text-right">
          <span
            class="kb"
            v-for="(combinations, idx) in data.combination"
            v-bind:key="data.effect + idx"
          >
            <template v-for="combination in combinations" v-bind:key="combination">
              <Chip
                class="rounded px-1 py-0.5 shadow-[1px_1px_1px_rgba(0,0,0,0.15)] border border-gray-870 dark:border-gray-620 text-xs font-bold min-w-8 text-center"
              >
                <span v-html="combination" class="w-full"></span>
              </Chip>
            </template>
          </span>
        </td>
      </tr>
    </table>
    <div class="flex justify-end pt-4">
      <Button type="button" label="Close" severity="secondary" @click="visible = false"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { onKeyStroke } from '@vueuse/core';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Chip from 'primevue/chip';
import { ref, type Ref } from 'vue';
import { useAuthUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const store = useAuthUserStore();
const { dark } = storeToRefs(store);

const visible = defineModel('visible') as Ref<boolean>;

type KeyBinding = { combination: string[][]; effect: string };

const keybindings = ref([
  {
    effect: 'Toggle sidebar.',
    combination: [['`'], ['§'], ['@']],
  },
  {
    effect: 'Highlight next finding.',
    combination: [['j'], ['&darr;']],
  },
  {
    effect: 'Highlight previous finding.',
    combination: [['k'], ['&uarr;']],
  },
  {
    effect: 'Close details.',
    combination: [['h'], ['&larr;']],
  },
  {
    effect: 'Open details.',
    combination: [['l'], ['&rarr;']],
  },
  {
    effect: 'Toggle selection.',
    combination: [['&UnderBracket;']],
  },
  {
    effect: 'Open commit url/Open repository.',
    combination: [['o']],
  },
  {
    effect: 'Audit as False positive.',
    combination: [['f']],
  },
  {
    effect: 'Audit as True positive.',
    combination: [['t']],
  },
  {
    effect: 'Audit as Not Accessible (Gone).',
    combination: [['g']],
  },
  {
    effect: 'Open Audit on selection.',
    combination: [['a']],
  },
  {
    effect: 'Audit selection as False positive.',
    combination: [['&uArr; shift', 'f']],
  },
  {
    effect: 'Audit selection as True positive.',
    combination: [['&uArr; shift', 't']],
  },
  {
    effect: 'Toggle select all.',
    combination: [['Ctrl', 'a']],
  },
  {
    effect: 'Refresh the table.',
    combination: [['r']],
  },
] as KeyBinding[]);

onKeyStroke('?', () => !shouldIgnoreKeystroke() && (visible.value = true), {
  eventName: 'keydown',
});
</script>

<style>
#keybindings-table .p-chip + .p-chip {
  margin-left: 0.5rem;
}

#keybindings-table .kb + .kb::before {
  content: 'or';
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
