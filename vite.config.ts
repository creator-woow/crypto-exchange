import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "${path.resolve(__dirname, './src/app/styles/mixins')}";
        `
      }
    }
  },
  resolve: {
    alias: {
      pages: path.resolve(__dirname, './src/pages'),
      shared: path.resolve(__dirname, "./src/shared"),
      features: path.resolve(__dirname, "./src/features"),
      entity: path.resolve(__dirname, "./src/entity"),
      widgets: path.resolve(__dirname, './src/widgets'),
    }
  }
})
