import Config from '@/configuration/config';
import type { FindingStatus, VCSProviders, RulePackRead } from '@/services/shema-to-types';

export type StatusOptionType = {
  id: number;
  label: string;
  value: FindingStatus;
};

const CommonUtils = {
  formatVcsProvider(vcsProvider: VCSProviders): string {
    let vcsProviderLabel = '';
    switch (vcsProvider) {
      case `${Config.value('azureDevOpsVal')}`:
        vcsProviderLabel = `${Config.value('azureDevOpsLabel')}`;
        break;
      case `${Config.value('bitbucketVal')}`:
        vcsProviderLabel = `${Config.value('bitbucketLabel')}`;
        break;
      case `${Config.value('githubPublicVal')}`:
        vcsProviderLabel = `${Config.value('githubPublicLabel')}`;
        break;
    }
    return vcsProviderLabel;
  },

  parseStatusOptions(statusOptions: FindingStatus[]): StatusOptionType[] {
    const statusList = [] as StatusOptionType[];
    statusOptions.forEach(function (status, index) {
      const statusJson: StatusOptionType = {
        id: index,
        label: CommonUtils.formatStatusLabels(status),
        value: status,
      };
      statusList.push(statusJson);
    });
    return statusList;
  },

  formatStatusLabels(input: FindingStatus): string {
    if (input === `${Config.value('underReviewStatusVal')}`) {
      return `${Config.value('underReviewStatusLabel')}`;
    }
    if (input === `${Config.value('clarificationRequiredStatusVal')}`) {
      return `${Config.value('clarificationRequiredStatusLabel')}`;
    }
    if (input === `${Config.value('truePostiveStatusVal')}`) {
      return `${Config.value('truePostiveStatusLabel')}`;
    }
    if (input === `${Config.value('falsePositiveStatusVal')}`) {
      return `${Config.value('falsePositiveStatusLabel')}`;
    }
    return `${Config.value('notAnalyzedStatusLabel')}`;
  },

  parseVersion(version: string): number {
    const parts = version.split('.');
    return 10000 * parseInt(parts[0]) + 100 * parseInt(parts[1] ?? '0') + parseInt(parts[2] ?? '0');
  },

  compareVersions(version_a: string, version_b: string): 0 | 1 | -1 {
    const version_a_int = CommonUtils.parseVersion(version_a);
    const version_b_int = CommonUtils.parseVersion(version_b);
    if (version_a_int < version_b_int) {
      return -1;
    }

    if (version_a_int > version_b_int) {
      return 1;
    }

    return 0;
  },

  compareRulePackRead(rulepack_a: RulePackRead, rulepack_b: RulePackRead): 0 | 1 | -1 {
    return CommonUtils.compareVersions(rulepack_a.version, rulepack_b.version);
  },
};

export function toRaw(
  input: string | null | number | undefined | string[] | number[],
): string | null | number | string[] | number[] {
  // We collapse undefined from any into null. undefined is not a valid Json type...
  return JSON.parse(JSON.stringify(input ?? null));
}

/**
 * When looking at keybindings, all strokes are usually captured.
 * We want to avoid doing action when one the following is selected:
 * - textarea
 * - input
 * - select
 *
 * Any key bindings hit while those are focused would break the
 * normal behaviour and produce unexpected results.
 *
 * @returns boolean true if we should ignore the current stroke.
 */
export function shouldIgnoreKeystroke(): boolean {
  const skipped = ['TEXTAREA', 'INPUT', 'SELECT'];
  if (document.activeElement !== null && skipped.includes(document.activeElement.nodeName)) {
    return true;
  }
  return false;
}

export function disableScrollingWithArrowsAndCtrlA(): void {
  window.addEventListener(
    'keydown',
    function (e) {
      if (shouldIgnoreKeystroke()) {
        return;
      }

      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
        e.preventDefault();
      }
      if (e.code == 'KeyA' && e.ctrlKey) {
        e.preventDefault();
      }
    },
    false,
  );
}

export default CommonUtils;
