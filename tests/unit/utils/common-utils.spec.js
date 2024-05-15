import { describe, expect, it } from 'vitest';
import CommonUtils, { shouldIgnoreKeystroke } from '@/utils/common-utils';
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
    ];

    const statusList = CommonUtils.parseStatusOptions(statusOptions);

    expect(statusList).toBeDefined();
    expect(statusList).not.toBeNull();
    expect(statusList.length).toBe(5);
    expect(statusList[0].label).toBe(`${Config.value('notAnalyzedStatusLabel')}`);
    expect(statusList[1].label).toBe(`${Config.value('notAccessibleStatusLabel')}`);
    expect(statusList[2].label).toBe(`${Config.value('clarificationRequiredStatusLabel')}`);
    expect(statusList[3].label).toBe(`${Config.value('truePostiveStatusLabel')}`);
    expect(statusList[4].label).toBe(`${Config.value('falsePositiveStatusLabel')}`);
  });
});

describe('function shouldIgnoreKeystroke', () => {
  it('should return false by default', () => {
    expect(shouldIgnoreKeystroke()).toBeFalsy();
  });

  it('should return true if an element INPUT element is selected', () => {
    // override document
    global.document = { activeElement: { nodeName: 'INPUT' } };
    expect(shouldIgnoreKeystroke()).toBeTruthy();
  });

  it('should return true if an element TEXTAREA element is selected', () => {
    // override document
    global.document = { activeElement: { nodeName: 'TEXTAREA' } };
    expect(shouldIgnoreKeystroke()).toBeTruthy();
  });

  it('should return true if an element SELECT element is selected', () => {
    // override document
    global.document = { activeElement: { nodeName: 'SELECT' } };
    expect(shouldIgnoreKeystroke()).toBeTruthy();
  });

  it('should return false if an element A element is selected', () => {
    // override document
    global.document = { activeElement: { nodeName: 'A' } };
    expect(shouldIgnoreKeystroke()).toBeFalsy();
  });
});
