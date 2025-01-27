import Config from '@/configuration/config';
import { ref } from 'vue';

export function usePaginator(callback: () => void) {
  const totalRows = ref(0);
  const currentPage = ref(0);
  const perPage = ref(Number(`${Config.value('defaultPageSize')}`));

  function handlePageClick(page: number) {
    currentPage.value = page;
    callback();
  }

  function handlePageSizeChange(pageSize: number) {
    perPage.value = pageSize;
    currentPage.value = 0;
    callback();
  }

  return { totalRows, currentPage, perPage, handlePageClick, handlePageSizeChange };
}
