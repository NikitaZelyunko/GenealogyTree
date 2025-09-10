import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-08-13',
  experimental: {
    // typedPages: true, // unplugin-vue-router
  },
  imports: {
    scan: false,
    autoImport: false,
  },
  components: {
    dirs: [],
  },
});
