/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0D1117",
        card: "#161B22",
        border: "#30363D",
        primary: "#58A6FF",
        success: "#3FB950",
        warning: "#D29922",
        error: "#F85149",
        muted: "#8B949E",
        heading: "#E6EDF3",
        body: "#C9D1D9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
