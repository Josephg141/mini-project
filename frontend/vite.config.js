// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or vue/svelte, etc.

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // make sure this matches firebase.json
  }
})
