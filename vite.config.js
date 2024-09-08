import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
    base: '/home', // or your desired base path
  server: {
    port: 5173, // Set the port to 5173
    proxy: {
      '/api': {
        target: 'http://127.0.0.1', // Ensure your API requests are proxied to the PHP server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
