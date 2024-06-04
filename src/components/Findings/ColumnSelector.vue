<template>
  <div>
    <b-modal
      id="column_modal"
      ref="column_modal"
      size="sm"
      button-size="sm"
      title="Select columns"
      :cancelDisabled="true"
      @show="loadModal"
    >
      <template v-for="column in selectableColumns" v-bind:key="column">
        <b-form-checkbox
          class="checkbox"
          v-model="selectedColumn"
          :value="column"
          @change="updateColumns"
          >{{ ColumnUtils.formatColumnLabel(column) }}</b-form-checkbox
        >
      </template>
      <template #footer="">
        <div class="w-100 text-end">
          <b-button variant="secondary" class="float-right" v-on:click="hide">CLOSE</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script lang="ts" setup>
import { useAuthUserStore } from '@/store';
import ColumnUtils, { type TableColumn } from '@/utils/column-utils';
import { ref } from 'vue';

const column_modal = ref();
const selectableColumns = ref(ColumnUtils.selectableColumns());

const store = useAuthUserStore();
const emit = defineEmits(['update-columns']);

const selectedColumn = ref([] as string[]);

function updateColumns(): void {
  reset_if_empty();
  store.update_table_column(selectedColumn.value as TableColumn[]);
  emit('update-columns', selectedColumn.value);
}

function loadModal() {
  selectedColumn.value = store.tableColumns;
  reset_if_empty();
}

function reset_if_empty() {
  if (selectedColumn.value.length === 0) {
    selectedColumn.value = ColumnUtils.defaultSelectableColumns();
  }
}

function show() {
  column_modal.value.show();
}

function hide() {
  column_modal.value.hide();
}

defineExpose({ show, hide });
</script>
