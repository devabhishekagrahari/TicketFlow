// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  // *** THIS IS THE CRUCIAL BLOCK ***
  resolve: {
    alias: {
      // Maps the '@/...' path alias to the absolute path of the 'src' directory.
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ******************************

  build: {
    // You should also address the chunk size warning here later (see below)
    chunkSizeWarningLimit: 650, // Temporarily increase the warning limit to match your 649kB chunk
  }
});