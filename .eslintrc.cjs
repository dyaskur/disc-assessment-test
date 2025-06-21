const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  root: true,
  plugins: ['svelte3', '@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3'
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  settings: {
    'svelte3/preprocess': sveltePreprocess(),
    'svelte3/typescript': () => require('typescript')
  },
  env: {
    browser: true,
    node: true,
    es2020: true
  }
};
