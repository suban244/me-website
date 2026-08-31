import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO(suban): set this to your real Cloudflare domain before the next deploy.
  // It is used for sitemap + RSS absolute URLs. base stays '/' now that
  // you're off the github.io/me-website path.
  site: 'https://example.com',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed', wrap: true },
  },
});
