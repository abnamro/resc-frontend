import { useAuthUserStore } from '@/store';
import type { SimpleTableField } from '@/utils/column-utils';
import ColumnUtils from '@/utils/column-utils';
import { ref } from 'vue';

export function useColumnFiltering(isRuleFinding: boolean) {
  const fields = ref([] as SimpleTableField[]);
  const store = useAuthUserStore();

  function setTableFields() {
    // @ts-ignore ignore TS2589
    fields.value = ColumnUtils.getColumns(store.tableColumns, isRuleFinding);
  }

  return {
    fields,
    setTableFields,
  };
}
