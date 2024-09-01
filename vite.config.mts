/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import biomePlugin from 'vite-plugin-biome';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// eslint-disable-next-line no-restricted-syntax
export default defineConfig(({mode}) => {
  return ({
    clearScreen: false,
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      // @ts-ignore
      // mode === 'test' ? undefined : biomePlugin(),
      tsconfigPaths(),
      react(),
      dts({
        insertTypesEntry: true,
        outDir: 'lib',
      }),
    ],
    //todo(dawiidio): move build from tsc to vite
    build: {
      target: 'node22',
      lib: {
        entry: resolve(__dirname, 'src/index.tsx'),
        name: '@dawiidio/form',
        fileName: (format) => `index.${format}.js`
      },
      outDir: 'lib',
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: [
          {
            format: 'cjs',
            entryFileNames: 'index.cjs.js',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          },
          {
            format: 'es',
            entryFileNames: 'index.es.js',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        ]
      }
    },
    test: {
      exclude: ['examples/**/*', 'templates/**/*', 'test', 'node_modules', 'lib'],
      globals: true,
      reporters: 'default',
      environment: 'node',
      setupFiles: [],
      coverage: {
        reporter: ['text', 'json', 'html'],
      },
      alias: {
        '~': resolve(__dirname, 'src'),
      },
    },
  })
});
