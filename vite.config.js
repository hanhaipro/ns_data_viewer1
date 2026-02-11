import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ns_data_viewer1',
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_URL,
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: true,
  },
});
