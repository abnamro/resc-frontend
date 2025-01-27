import { computed, ref, type Ref } from 'vue';

export function useFiltering(findingList: Ref<{ file_path: string }[] | undefined>) {
  const filterString = ref('');

  // Simple filter function
  // if start with * we check the ending of the file path.
  // if end with * we check the beginning of the file path.
  // if does not contain * we only check if the needle is in the string.
  function applyFilter() {
    if (findingList.value === undefined) {
      return [];
    }
    if (
      filterString.value === '' ||
      filterString.value === undefined ||
      filterString.value === null
    ) {
      return findingList.value;
    }

    const token = filterString.value;

    if (token.startsWith('*')) {
      return findingList.value.filter((finding) => finding.file_path.endsWith(token.substring(1)));
    }

    if (token.endsWith('*')) {
      return findingList.value.filter((finding) =>
        finding.file_path.startsWith(token.substring(0, token.length - 1)),
      );
    }

    return findingList.value.filter((finding) => finding.file_path.includes(token));
  }

  const filteredList = computed(applyFilter);

  return {
    filterString,
    filteredList,
  };
}
