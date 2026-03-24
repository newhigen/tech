import { siteConfig } from '@/config';

/**
 * Check if a specific optional content type is enabled
 */
export function isOptionalContentTypeEnabled(type: 'projects' | 'docs'): boolean {
  return siteConfig.optionalContentTypes[type];
}

/**
 * Prepend Astro's BASE_URL to internal paths.
 * External URLs (http/https) are returned unchanged.
 * e.g. withBase('/posts/') → '/tech/posts/'
 */
export function withBase(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/tech'
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
