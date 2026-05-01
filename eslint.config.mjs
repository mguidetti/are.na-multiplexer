import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default tseslint.config(
  {
    ignores: ['.next/', 'node_modules/', 'playwright-report/', 'test-results/', 'next-env.d.ts']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends('next/core-web-vitals'),
  {
    settings: {
      next: {
        rootDir: '.'
      }
    },
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/indent': 'off'
    }
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['tests/**'],
    rules: {
      'react-hooks/rules-of-hooks': 'off'
    }
  }
)
