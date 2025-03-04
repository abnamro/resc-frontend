import { describe, expect, it } from 'vitest';
import { useFormatter } from '@/composables/useFormatter';

describe('useFormatter tests', () => {
  it('userFormat', () => {
    const { userFormat } = useFormatter();
    expect(userFormat('harry.potter@hogward.uk')).toBe('harry.potter');
    expect(userFormat('voldemort')).toBe('voldemort');
  });
});
