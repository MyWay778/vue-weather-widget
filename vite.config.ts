import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const packageVersion = process.env.npm_package_version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@UI': fileURLToPath(new URL('./src/components/UI', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: '',
    rollupOptions: {
      input: './src/main.ts',
      output: {
        entryFileNames: `weather-widget-v${packageVersion}.js`
      }
    }
  }
});
