import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    test: {
    globals: true,          // permet d’utiliser describe/test sans importer
    environment: "jsdom",   // simule un navigateur
    setupFiles: "./tests/setup.js", // fichier global pour setup
  },
})


