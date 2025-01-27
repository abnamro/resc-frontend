import Config from '@/configuration/config';
import { ref } from 'vue';

export function usePaginator() {
  const totalRows = ref(0);
  const currentPage = ref(0);
  const perPage = ref(Number(`${Config.value('defaultPageSize')}`));

  return { totalRows, currentPage, perPage };
}
