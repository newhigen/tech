// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeMermaid from 'rehype-mermaid';
import rehypeBlogHide from './src/plugins/rehype-blog-hide.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://newhigen.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeBlogHide, rehypeMermaid],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
});