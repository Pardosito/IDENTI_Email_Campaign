import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 1. Global ignores (like .eslintignore)
  { ignores: ['node_modules', 'dist', 'public'] },

  // 2. Base Configuration for all files
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
  },

  // 3. Recommended Configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // 4. Custom Rules
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Warns instead of errors on 'any'
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // Useful for backend logging
    },
  },

  // 5. Prettier Config (Must be last to override other rules)
  eslintConfigPrettier,
];
