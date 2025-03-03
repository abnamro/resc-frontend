import { dispatchMessage } from '@/configuration/config';
import type { FindingStatus } from '@/services/shema-to-types';
import type { Ref } from 'vue';

export function useAuditFunctions<T>(
  selection: Ref<number[]>,
  selectedIndex: Ref<number>,
  expanded: Ref<number>,
  itemList: Ref<undefined | (T & {commit_url: string})[]>,
  isAuditModalVisible: Ref<boolean>,
  getKey: (item: T) => number,
  sendUpdate: (ids: number[], status: FindingStatus) => void,
) {

  function toggleExpand(idx: number) {
    selectedIndex.value = idx;
    expanded.value = expanded.value === idx ? -1 : idx;
  }

  function toggleAllCheckboxes() {
    if (itemList.value === undefined) {
      return;
    }

    if (selection.value.length < itemList.value.length) {
      selection.value = itemList.value.map((f) => getKey(f));
    } else {
      selection.value = [];
    }
  }

  function getCurrentFindingSelected(): T & {commit_url: string} {
    if (itemList.value === undefined) {
      dispatchMessage('List is empty');
      throw new Error('oups!');
    }

    return itemList.value[selectedIndex.value];
  }

  function selectDown(): boolean {
    if (itemList.value === undefined) {
      return false;
    }

    selectedIndex.value = ((selectedIndex.value ?? -1) + 1) % itemList.value.length;
    expanded.value = expanded.value === -1 ? -1 : selectedIndex.value;

    return true;
  }

  function selectUp(): boolean {
    if (itemList.value === undefined) {
      return false;
    }

    selectedIndex.value = (selectedIndex.value + itemList.value.length - 1) % itemList.value.length;
    expanded.value = expanded.value === -1 ? -1 : selectedIndex.value;

    return true;
  }

  function openDetails() {
    expanded.value = selectedIndex.value;
  }

  function closeDetails() {
    expanded.value = -1;
  }

  function openCommitUrl() {
    const url = getCurrentFindingSelected()?.commit_url;
    if (url !== undefined && url !== null) {
      window.open(url, '_blank')?.focus();
    }
  }

  function toggleSelect() {
    const item = getCurrentFindingSelected();
    console.log(selection.value);
    if (selection.value.filter((idx) => idx === getKey(item)).length > 0) {
      selection.value = selection.value.filter((idx) => idx !== getKey(item));
    } else {
      selection.value.push(getKey(item));
    }
  }

  function markAsFalsePositive() {
    const item = getCurrentFindingSelected();
    sendUpdate([getKey(item)], 'FALSE_POSITIVE');
    selectDown();
  }

  function markAsTruePositive() {
    const item = getCurrentFindingSelected();
    sendUpdate([getKey(item)], 'TRUE_POSITIVE');
    selectDown();
  }

  function markAsGone() {
    const item = getCurrentFindingSelected();
    sendUpdate([getKey(item)], 'NOT_ACCESSIBLE');
    selectDown();
  }

  function markAllAsFalsePositive() {
    sendUpdate(selection.value, 'FALSE_POSITIVE');
  }

  function markAllAsTruePositive() {
    sendUpdate(selection.value, 'TRUE_POSITIVE');
  }

  function markAllAsGone() {
    sendUpdate(selection.value, 'NOT_ACCESSIBLE');
  }

  function auditThis() {
    if (selection.value.length > 0) {
      isAuditModalVisible.value = true;
      return;
    }

    openDetails();
  }

  return {
    toggleExpand,
    toggleAllCheckboxes,
    getCurrentFindingSelected,
    selectDown,
    selectUp,
    openDetails,
    closeDetails,
    openCommitUrl,
    toggleSelect,
    markAsFalsePositive,
    markAsTruePositive,
    markAsGone,
    markAllAsFalsePositive,
    markAllAsTruePositive,
    markAllAsGone,
    auditThis,
  };
}
