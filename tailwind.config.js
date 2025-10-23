/** @type {import('tailwindcss').Config} */
// Use 'export default' for Vite projects
export default {
  content: [
    './index.html', // For your main HTML file
    './src/App.jsx', // For your main App file
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Font family from the CSS file
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Colors from your React code
      colors: {
        background: '#111111',
        foreground: '#F5F5F5',
        primary: '#BFFF00',
        'primary-foreground': '#111111',
        card: '#1C1C1C',
        'card-foreground': '#F5F5F5',
        muted: '#333333',
        'muted-foreground': '#a3a3a3',
        popover: '#1C1C1C',
        'popover-foreground': '#F5F5F5',
        border: '#333333',
        input: '#333333',
        ring: '#BFFF00',
      },
    },
  },
  plugins: [],
}

