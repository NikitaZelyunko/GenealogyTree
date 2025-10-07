import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-08-13',
  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {
      compilerOptions: {
        strict: true,
        allowJs: false,
      },
    },
  },

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

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },
});
