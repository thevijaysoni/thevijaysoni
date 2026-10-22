import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Custom middleware to handle clean URL routing for multi-page setup in Dev Server
const devServerSpaRewrites = () => ({
  name: 'dev-server-spa-rewrites',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const host = req.headers.host || 'localhost';
      const url = new URL(req.url, `http://${host}`);
      if (url.pathname === '/labs/kalachakra' || url.pathname === '/labs/kalachakra/') {
        req.url = '/labs/kalachakra/index.html' + url.search;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), devServerSpaRewrites()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kalachakra: resolve(__dirname, 'labs/kalachakra/index.html')
      }
    }
  }
});
