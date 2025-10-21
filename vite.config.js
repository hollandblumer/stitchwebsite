// vite.config.js
import react from "@vitejs/plugin-react";

const config = {
  plugins: [react()],
  base: "/stitchwebsite/", // must match the repo name
};

export default config;
