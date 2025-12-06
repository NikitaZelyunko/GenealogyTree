import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

const stylisticConfig = stylistic.configs.customize({
  semi: true,
  arrowParens: true,
  braceStyle: '1tbs',
});

const lineMaxLength = 120;
stylisticConfig.rules['@stylistic/max-len'] = [
  'error',
  { code: lineMaxLength },
];

const ignoreVueCssIssues = {
  files: ['**/*.vue'],
  rules: {
    '@stylistic/max-len': [
      'error',
      { code: lineMaxLength, ignorePattern: '@apply ' },
    ],
  },
};

export default defineConfig([
  globalIgnores(['node_modules/*', '.output/*', '.nuxt/*']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue}'],
    languageOptions: { globals: globals.browser }, // TODO понять зачем нужен это globals
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
  ignoreVueCssIssues,
]);
