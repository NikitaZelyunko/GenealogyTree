import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

const stylisticConfig = stylistic.configs.customize({
  semi: true,
  arrowParens: true,
  braceStyle: '1tbs',
});

stylisticConfig.rules['@stylistic/max-len'] = ['error', { code: 120 }];

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['app/pages/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  {
    files: ['app/layouts/**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  stylisticConfig,
]);
