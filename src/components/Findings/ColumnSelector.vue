<template>
  <Dialog v-model:visible="visible" modal header="Select columns" :class="{ dark: dark }">
    <Listbox
      v-model="tableColumns"
      checkmark
      :options="selectableColumns"
      multiple
      class="w-full"
      @change="updateColumns"
    />
    <div class="flex justify-end pt-4">
      <Button type="button" label="Close" severity="secondary" @click="visible = false"></Button>
    </div>
  </Dialog>
</template>
<script lang="ts" setup>
import { useAuthUserStore } from '@/store';
import ColumnUtils from '@/utils/column-utils';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Listbox from 'primevue/listbox';
import { onMounted, ref, type Ref } from 'vue';

const visible = defineModel('visible') as Ref<boolean>;
const selectableColumns = ref(ColumnUtils.selectableColumns());

const store = useAuthUserStore();
const { dark, tableColumns } = storeToRefs(store);

const emit = defineEmits(['update-columns']);

function updateColumns(): void {
  reset_if_empty();
  emit('update-columns');
}

function reset_if_empty() {
  if (tableColumns.value.length === 0) {
    tableColumns.value = ColumnUtils.defaultSelectableColumns();
  }
}

onMounted(reset_if_empty);
</script>
