import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // For path aliases

export default defineConfig({
  plugins: [react()], // Enables React support
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Maps '@' to ./src
    },
  },
  define: {
    // Optional: Safely pass environment variables to your app
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
  },
});