import { computed, ref, type Ref } from 'vue';

export type FindingMeta = { file_path: string; rule_name: string; repository_name: string };

type Filter = {
  filename: string;
  repo: string;
  rule: string;
};

export function useFiltering<T>(findingList: Ref<(T & FindingMeta)[] | undefined>) {
  const filterString = ref('');

  function contains(haystack: string, needle: string): boolean {
    if (needle.startsWith('*')) {
      return haystack.endsWith(needle.slice(1));
    }
    if (needle.endsWith('*')) {
      return haystack.startsWith(needle.slice(0, needle.length - 1));
    }
    return haystack.includes(needle);
  }

  function filters(filter: Filter, finding: FindingMeta): boolean {
    let keep = true;
    if (filter.filename !== '' && !contains(finding.file_path, filter.filename)) {
      keep = false;
    }
    if (filter.repo !== '' && !contains(finding.repository_name, filter.repo)) {
      keep = false;
    }
    if (filter.rule !== '' && !contains(finding.rule_name, filter.rule)) {
      keep = false;
    }
    return keep;
  }

  function parseTokenString(token: string, filterForFinding: Filter) {
    if (token.startsWith('f:')) {
      filterForFinding.filename = token.slice(2);
    } else if (token.startsWith('r:')) {
      filterForFinding.rule = token.slice(2);
    } else if (token.startsWith('rp:')) {
      filterForFinding.repo = token.slice(3);
    } else {
      filterForFinding.filename = token;
    }
  }

  // Simple filter function
  // if start with * we check the ending of the file path.
  // if end with * we check the beginning of the file path.
  // if does not contain * we only check if the needle is in the string.
  function applyFilter(): (T & FindingMeta)[] | undefined {
    if (findingList.value === undefined) {
      return undefined;
    }
    if (
      filterString.value === '' ||
      filterString.value === undefined ||
      filterString.value === null
    ) {
      return findingList.value;
    }

    const filterForFinding: Filter = {
      filename: '',
      repo: '',
      rule: '',
    };

    const tokens = filterString.value.split(' ');
    for (let i = 0; i < tokens.length; i++) {
      parseTokenString(tokens[i], filterForFinding);
    }

    return findingList.value.filter((finding) => filters(filterForFinding, finding));
  }

  const filteredList = computed(applyFilter);

  return {
    filterString,
    filteredList,
  };
}
