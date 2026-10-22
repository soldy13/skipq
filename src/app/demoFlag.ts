/** `?demo=0` (before or inside the hash) hides the Demo pill for clean screenshots. Read once per page load. */
export function readDemoHidden(location: Pick<Location, 'search' | 'hash'> = window.location): boolean {
  const hashQuery = location.hash.includes('?') ? location.hash.slice(location.hash.indexOf('?')) : '';
  return [location.search, hashQuery].some((q) => new URLSearchParams(q).get('demo') === '0');
}

export const DEMO_HIDDEN = typeof window !== 'undefined' && readDemoHidden();
