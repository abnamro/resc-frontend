import { describe, expect, it } from 'vitest';
import CommonUtils from '@/utils/common-utils';
import Config from '@/configuration/config';

describe('function formatVcsProvider', () => {
  it('format VCS provider label', async () => {
    expect(CommonUtils.formatVcsProvider(`${Config.value('azureDevOpsVal')}`)).toBe(
      `${Config.value('azureDevOpsLabel')}`,
    );

    expect(CommonUtils.formatVcsProvider(`${Config.value('bitbucketVal')}`)).toBe(
      `${Config.value('bitbucketLabel')}`,
    );

    expect(CommonUtils.formatVcsProvider(`${Config.value('githubPublicVal')}`)).toBe(
      `${Config.value('githubPublicLabel')}`,
    );
  });
});

describe('function parseStatusOptions', () => {
  it('should parse status options', async () => {
    let statusOptions = [
      `${Config.value('notAnalyzedStatusVal')}`,
      `${Config.value('notAccessibleStatusVal')}`,
      `${Config.value('clarificationRequiredStatusVal')}`,
      `${Config.value('truePostiveStatusVal')}`,
      `${Config.value('falsePositiveStatusVal')}`,
      `${Config.value('outdatedStatusVal')}`,
    ];

    const statusList = CommonUtils.parseStatusOptions(statusOptions);

    expect(statusList).toBeDefined();
    expect(statusList).not.toBeNull();
    expect(statusList.length).toBe(6);
    expect(statusList[0].label).toBe(`${Config.value('notAnalyzedStatusLabel')}`);
    expect(statusList[1].label).toBe(`${Config.value('notAccessibleStatusLabel')}`);
    expect(statusList[2].label).toBe(`${Config.value('clarificationRequiredStatusLabel')}`);
    expect(statusList[3].label).toBe(`${Config.value('truePostiveStatusLabel')}`);
    expect(statusList[4].label).toBe(`${Config.value('falsePositiveStatusLabel')}`);
    expect(statusList[5].label).toBe(`${Config.value('outdatedStatusLabel')}`);
  });
});

describe('function stringify_date', () => {
  it('check the values', () => {
    expect(CommonUtils.stringify_date(undefined)).toBe(undefined);
    expect(CommonUtils.stringify_date('')).toBe('');
    expect(CommonUtils.stringify_date('01234567899876543210')).toBe('0123456789');
    expect(CommonUtils.stringify_date(new Date('2023-05-05T05:05:30'))).toBe('2023-05-05');
  });
});
