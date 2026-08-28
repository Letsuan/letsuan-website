import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://letsuan.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
});
