/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chinese-blue': '#151517ff',
        'ceil': '#9792CB',
        'blue': '#9bd3ee',
        'pearly-purple': '#AA74A0',
        'dessert-sand': '#E2C99E',
        'antique-ruby': '#852736',
        'pastel-sky': '#CFE8FF',
        'pastel-blue': '#D7E3FC',
        'pastel-amber': '#FFE6B3',
        'pastel-pink': '#FFD6E0',
        'pastel-violet': '#E4D3F5',
        'pastel-green': '#D3F4E3',
        'pastel-lavender': '#EADCF8',
        'pastel-peach': '#FFE0C2',
        'cream': '#f6f2ee',
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
