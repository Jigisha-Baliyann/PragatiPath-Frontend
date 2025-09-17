import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'user-panel',           // Entry folder for user panel
    plugins: [react()],
    define: {
      // Use VITE_ prefixed env variable
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'user-panel'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, 'dist/user'), // Absolute path ensures correct build
      emptyOutDir: true                           // Clear old builds
    },
    base: '/user/',
    server: {
      port: 5173,
      open: true,
    },
  };
});
