import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// --- THIS IS THE FIX ---
// Import directly from 'tailwindcss', not '@tailwindcss/postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define postcss config right here
  css: {
    postcss: {
      plugins: [
        // Make sure tailwindcss() is called as a function
        // It will automatically find your 'tailwind.config.js'
        tailwindcss(), 
        autoprefixer(),
      ],
    },
  },
})
