import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.subanshrestha.com.np',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/til/'),
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
