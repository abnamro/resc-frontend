<template>
  <div>
    <BModal
      id="keybinding_modal"
      ref="keybinding_modal"
      size="md"
      button-size="sm"
      title="Keyboard shortcuts"
    >
      <BTable id="keybindings-table" :items="keybindings" :fields="fields" small>
        <!-- Select all checkboxes -->
        <template #cell(effect)="data">
          {{ data.item.effect }}
        </template>
        <template #cell(combination)="data">
          <template
            v-for="combinations in data.item.combination"
            v-bind:key="'_' + combinations[0].combination"
          >
            <span class="kb">
              <template v-for="combination in combinations" v-bind:key="combination">
                <BBadge variant="light"><span v-html="combination"></span></BBadge>
              </template>
            </span>
          </template>
        </template>
      </BTable>

      <template #footer="">
        <div class="w-100 text-end">
          <BButton variant="secondary" class="float-right" v-on:click="hide">CLOSE</BButton>
        </div>
      </template>
    </BModal>
  </div>
</template>

<script setup lang="ts">
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';
import { onKeyStroke } from '@vueuse/core';
import { BBadge, BButton, BModal, BTable } from 'bootstrap-vue-next';
import { ref } from 'vue';

const keybinding_modal = ref();

type KeyBinding = { combination: string[][]; effect: string };

const fields = ref([
  {
    key: 'effect',
    label: '',
    class: 'text-start position-sticky',
    thStyle: { borderTop: '0px' },
  },
  {
    key: 'combination',
    label: '',
    class: 'text-end position-sticky',
    thStyle: { borderTop: '0px' },
  },
]);
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
    effect: 'Open commit url.',
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
  }
] as KeyBinding[]);

function show() {
  keybinding_modal.value.show();
}

function hide(_value: MouseEvent) {
  keybinding_modal.value.hide();
}

defineExpose({ show, hide });

onKeyStroke('?', () => !shouldIgnoreKeystroke() && show(), { eventName: 'keydown' });
</script>

<style>
#keybindings-table .badge {
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.5);
  border: 1px solid #cccccc;
  box-sizing: border-box;
  min-width: 2rem;
  display: inline-block;
}

#keybindings-table .badge + .badge {
  margin-left: 0.5rem;
}

#keybindings-table .kb + .kb::before {
  content: 'or';
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>
