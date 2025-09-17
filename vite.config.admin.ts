import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env variables with VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'admin-panel',           // Entry folder for admin panel
    plugins: [react()],
    define: {
      // Use VITE_ prefixed env variables in frontend
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'admin-panel'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, 'dist/admin'), // Absolute path for safety
      emptyOutDir: true                             // Clear previous build
    },
    base: '/admin/',
    server: {
      port: 5174,
      open: true,
    },
  };
});
