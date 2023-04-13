/// <reference types="vitest" />
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import wasm from 'vite-plugin-wasm'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  cacheDir: '../../node_modules/.vite/vite',

  server: {
    port: 7501,
    host: true,
    https: true,
  },

  preview: {
    port: 7502,
    host: 'localhost',
  },

  plugins: [
    react(),
    viteTsConfigPaths({
      root: '../../',
    }),
    wasm(),
    basicSsl(),
  ],

  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  },

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [
  //    viteTsConfigPaths({
  //      root: '../../',
  //    }),
  //  ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
