/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-glow': 'hsl(var(--primary-glow))',
        accent: 'hsl(var(--accent))',
        'accent-bright': 'hsl(var(--accent-bright))',
        muted: 'hsl(var(--muted))',
        card: 'hsl(var(--card))',
        'card-dark': 'hsl(var(--card-dark))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))'
      },
      borderColor: theme => ({
        // map `border-border` -> hsl(var(--border))
        border: 'hsl(var(--border))',
        DEFAULT: theme('colors.border')
      })
    },
  },
  plugins: [],
}
