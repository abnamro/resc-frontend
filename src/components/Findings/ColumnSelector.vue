<template>
  <div>
    <BModal
      id="column_modal"
      ref="column_modal"
      size="sm"
      button-size="sm"
      title="Select columns"
      :cancelDisabled="true"
      @show="loadModal"
    >
      <template v-for="column in selectableColumns" v-bind:key="column">
        <BFormCheckbox
          class="checkbox"
          v-model="selectedColumn"
          :value="column"
          @change="updateColumns"
          >{{ ColumnUtils.formatColumnLabel(column) }}</BFormCheckbox
        >
      </template>
      <template #footer="">
        <div class="w-100 text-end">
          <BButton variant="secondary" class="float-right" v-on:click="hide">CLOSE</BButton>
        </div>
      </template>
    </BModal>
  </div>
</template>
<script lang="ts" setup>
import { useAuthUserStore } from '@/store';
import ColumnUtils, { type TableColumn } from '@/utils/column-utils';
import { BButton, BFormCheckbox, BModal } from 'bootstrap-vue-next';
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
