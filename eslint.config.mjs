import withNuxt from './.nuxt/eslint.config.mjs'

import importX from 'eslint-plugin-import-x'
import unusedImports from 'eslint-plugin-unused-imports'

export default withNuxt({
  plugins: {
    'import-x': importX,
    'unused-imports': unusedImports
  },

  rules: {
    'no-console': 'warn',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'prefer-const': 'error',
    'no-var': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }
})
