import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jonkirkpatrick.github.io',
  integrations: [sitemap()],
  publicDir: './docs'
});
