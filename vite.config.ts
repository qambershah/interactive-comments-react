// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/interactive-comments-react/', // 👈 make sure this matches your repo name!
});
