import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
    glow: 'glow 12s ease-in-out infinite',
  },
  keyframes: {
    glow: {
      '0%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
      '50%': { transform: 'translateY(-20px) scale(1.3)', opacity: '0.9' },
      '100%': { transform: 'translateY(0) scale(1)', opacity: '0.6' },
    },
  },
  
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "retro",
      "dark",
    ],
  },
};

