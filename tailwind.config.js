module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-color) / <alpha-value>)',
        background: 'rgb(var(--background-color) / <alpha-value>)',
        'private-channel': 'rgb(var(--private-channel-color) / <alpha-value>)',
        'public-channel': 'rgb(var(--public-channel-color) / <alpha-value>)'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
