import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const packageVersion = process.env.npm_package_version;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  if (!env.VITE_WEATHER_SERVICE_API_KEY) {
    throw new Error('Define Weather Service Api key in .env file!');
  }

  return {
    plugins: [
      vue({
        features: {
          customElement: true
        },
        template: {
          compilerOptions: {
            isCustomElement: tag => tag === 'App'
          }
        }
      }),
      cssInjectedByJsPlugin()
    ],
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
  };
});
