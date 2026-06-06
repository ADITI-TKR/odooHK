import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export default defineConfig({
  root: appRoot,
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:5000' },
  },
})
