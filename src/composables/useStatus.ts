import type { FindingStatus } from '@/services/shema-to-types';

export function useStatus() {
  const allStatuses = [
    'NOT_ANALYZED',
    'NOT_ACCESSIBLE',
    'CLARIFICATION_REQUIRED',
    'FALSE_POSITIVE',
    'TRUE_POSITIVE',
    'OUTDATED',
  ] as FindingStatus[];

  function getStatusSeverity(status: FindingStatus): string {
    switch (status) {
      case 'NOT_ANALYZED':
        return 'secondary';
      case 'NOT_ACCESSIBLE':
        return 'info';
      case 'CLARIFICATION_REQUIRED':
        return 'warn';
      case 'TRUE_POSITIVE':
        return 'danger';
      case 'FALSE_POSITIVE':
        return 'success';
      case 'OUTDATED':
        return 'contrast';
      default:
        return 'danger';
    }
  }

  function getStatusString(status: FindingStatus): string {
    switch (status) {
      case 'NOT_ANALYZED':
        return 'Not Analyzed';
      case 'NOT_ACCESSIBLE':
        return 'Not Accessible';
      case 'CLARIFICATION_REQUIRED':
        return 'Clarification Required';
      case 'TRUE_POSITIVE':
        return 'True Positive';
      case 'FALSE_POSITIVE':
        return 'False Positive';
      case 'OUTDATED':
        return 'Outdated';
      default:
        return 'Undefined';
    }
  }

  return {
    allStatuses,
    getStatusSeverity,
    getStatusString,
  };
}
