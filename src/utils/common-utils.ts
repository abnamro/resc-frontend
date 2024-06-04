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
    if (input === `${Config.value('notAccessibleStatusVal')}`) {
      return `${Config.value('notAccessibleStatusLabel')}`;
    }
    if (input === `${Config.value('clarificationRequiredStatusVal')}`) {
      return `${Config.value('clarificationRequiredStatusLabel')}`;
    }
    if (input === `${Config.value('outdatedStatusVal')}`) {
      return `${Config.value('outdatedStatusLabel')}`;
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

  stringify_date(val: undefined | Date | string): undefined | string {
    if (val === undefined) {
      return undefined;
    }

    let ret: string = '';

    if (typeof val === 'string') {
      ret = val;
    }

    if (val instanceof Date) {
      ret = val.toISOString();
    }

    // Only keep the date part, drop the time & TZ
    return ret.slice(0, 10);
  },
};

export function toRaw(
  input: string | null | number | undefined | string[] | number[],
): string | null | number | string[] | number[] {
  // We collapse undefined from any into null. undefined is not a valid Json type...
  return JSON.parse(JSON.stringify(input ?? null));
}

export default CommonUtils;
