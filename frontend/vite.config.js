import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://192.168.0.17:5010', // Proxy API requests to Flask
      '/download': 'http://192.168.0.17:5010'
    },
  },
});
