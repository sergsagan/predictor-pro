// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@nuxt/eslint'
  ],

  alias: {
    '@server': resolve(__dirname, 'server'),
    '@db': resolve(__dirname, 'db'),
    '@features': resolve(__dirname, 'app/features'),
    '@test': resolve(__dirname, 'server/test')
  }
})
