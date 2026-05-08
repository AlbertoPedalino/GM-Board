import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: 'spa',
  plugins: [react()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      adapters: path.resolve(__dirname, '..', 'adapters'),
    },
  },
});
