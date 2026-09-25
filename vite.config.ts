import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        // Kutubxonalarni alohida keshlanadigan bo‘laklarga ajratamiz
        codeSplitting: {
          groups: [
            { name: 'katex', test: /node_modules[\\/]katex/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
})
