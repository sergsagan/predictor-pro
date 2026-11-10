import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

const configDir = import.meta.dirname

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(configDir, 'app'),
      '@db': resolve(configDir, 'db'),
      '@server': resolve(configDir, 'server'),
      '@test': resolve(configDir, 'server/test')
    }
  },

  test: {
    globals: true
  }
})
