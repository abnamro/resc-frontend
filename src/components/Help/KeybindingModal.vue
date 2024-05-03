<template>
  <div>
    <b-modal
      id="keybinding_modal"
      ref="keybinding_modal"
      size="md"
      button-size="sm"
      title="Keyboard shortcuts"
    >
      <b-table id="keybindings-table" :items="keybindings" :fields="fields" small>
        <!-- Select all checkboxes -->
        <template #cell(effect)="data">
          {{ data.item.effect }}
        </template>
        <template #cell(combination)="data">
          <b-badge
            v-for="combination in data.item.combination"
            v-bind:key="combination"
            variant="light"
            ><span v-html="combination"></span
          ></b-badge>
        </template>
      </b-table>

      <template #footer="">
        <div class="w-100 text-end">
          <b-button variant="secondary" class="float-right" v-on:click="hide">CLOSE</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keybinding_modal = ref();

type KeyBinding = { combination: string[]; effect: string };

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
    effect: 'Highlight next finding.',
    combination: ['&darr;'],
  },
  {
    effect: 'Highlight previous finding.',
    combination: ['&uarr;'],
  },
  {
    effect: 'Close details.',
    combination: ['&larr;'],
  },
  {
    effect: 'Open details.',
    combination: ['&rarr;'],
  },
  {
    effect: 'Toggle selection.',
    combination: ['&UnderBracket;'],
  },
  {
    effect: 'Open commit url.',
    combination: ['o'],
  },
  {
    effect: 'Audit as False positive.',
    combination: ['f'],
  },
  {
    effect: 'Audit as True positive.',
    combination: ['t'],
  },
  {
    effect: 'Open Audit on selection.',
    combination: ['a'],
  },
  {
    effect: 'Audit selection as False positive.',
    combination: ['&uArr; shift', 'f'],
  },
  {
    effect: 'Audit selection as True positive.',
    combination: ['&uArr; shift', 't'],
  },
  {
    effect: 'Toggle select all.',
    combination: ['Ctrl', 'a'],
  },
] as KeyBinding[]);

function show() {
  keybinding_modal.value.show();
}

function hide(_value: MouseEvent) {
  keybinding_modal.value.hide();
}

defineExpose({ show, hide });
</script>

<style>
#keybindings-table .badge {
  margin-left: 0.5rem;
  box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.5);
  border: 1px solid #cccccc;
  box-sizing: border-box;
}
</style>
