import { defineConfig } from '@modern-js/app-tools';
import { devMode } from '@/utils/config';

// https://modernjs.dev/docs/apis/config/overview
export default defineConfig({
  output: {
    polyfill: 'entry',
    enableModernMode: true,
  },
});
