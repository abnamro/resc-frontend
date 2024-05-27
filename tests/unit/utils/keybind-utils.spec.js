import { describe, expect, it } from 'vitest';
import { shouldIgnoreKeystroke } from '@/utils/keybind-utils';

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
