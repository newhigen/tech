/**
 * Prepend Astro's BASE_URL to internal paths.
 * External URLs (http/https/mailto) are returned unchanged.
 *
 * Examples (with base='/tech'):
 *   withBase('/blog/my-post') → '/tech/blog/my-post'
 *   withBase('/')             → '/tech/'
 *   withBase('https://...')   → 'https://...'
 */
export function withBase(path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto') || path.startsWith('//')) {
    return path
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // '/tech'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
