import { describe, expect, it } from 'vitest';
import { readDemoHidden } from './demoFlag';

describe('?demo=0', () => {
  it('hides the demo pill from the query string', () => {
    expect(readDemoHidden({ search: '?demo=0', hash: '#/' })).toBe(true);
  });

  it('hides it from a query inside the hash route', () => {
    expect(readDemoHidden({ search: '', hash: '#/board?demo=0' })).toBe(true);
  });

  it('shows it otherwise', () => {
    expect(readDemoHidden({ search: '', hash: '#/' })).toBe(false);
    expect(readDemoHidden({ search: '?demo=1', hash: '' })).toBe(false);
  });
});
