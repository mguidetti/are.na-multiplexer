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
      },
      fontSize: {
        'xs-relative': '0.75em',
        'sm-relative': '0.875em',
        'base-relative': '1em'
      },
      dropShadow: {
        panel: '0 10px 10px rgba(0, 0, 0, 0.9)'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
