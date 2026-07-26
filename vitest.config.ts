import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'app'),
      '@db': resolve(__dirname, 'db'),
      '@server': resolve(__dirname, 'server'),
      '@test': resolve(__dirname, 'server/test')
    }
  },

  test: {
    globals: true
  }
})
