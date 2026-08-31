import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Custom domain, fronted by Cloudflare -> GitHub Pages.
  // Used for sitemap + RSS absolute URLs and <link rel=canonical>.
  site: 'https://subanshrestha.com.np',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
