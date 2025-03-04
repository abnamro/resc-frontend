import { describe, expect, it } from 'vitest';
import { useFiltering } from '@/composables/useFiltering';
import { ref } from 'vue';

describe('useFiltering tests', () => {
  it('update the status and comment of several findings (bulk update)', async () => {
    const findingList = ref([
      { file_path: 'path1', rule_name: 'rule1', repository_name: 'repo1' },
      { file_path: 'path2', rule_name: 'rule2', repository_name: 'repo2' },
    ]);
    const { filterString, filteredList } = useFiltering(findingList);

    expect(filterString.value).toBe('');
    expect(filteredList.value.length).toBe(2);
    filterString.value = 'path1';
    expect(filteredList.value.length).toBe(1);
    expect(filteredList.value[0].file_path).toBe('path1');
    filterString.value = 'f:';
    expect(filteredList.value.length).toBe(2);
    filterString.value = 'f:*2';
    expect(filteredList.value.length).toBe(1);
    expect(filteredList.value[0].file_path).toBe('path2');
    filterString.value = 'r:2';
    expect(filteredList.value.length).toBe(1);
    filterString.value = 'rp:2';
    expect(filteredList.value.length).toBe(1);
    filterString.value = 'rp:2*';
    expect(filteredList.value.length).toBe(0);

    findingList.value = undefined;
    expect(filteredList.value).toBe(undefined);
  });
});
