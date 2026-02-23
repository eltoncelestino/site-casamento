import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracota: "#C65D3B",
        laranja: "#F28C28",
        creme: "#FDF6F0",
      },
    },
  },
  plugins: [],
};

export default config;