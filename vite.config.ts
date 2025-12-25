// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: ["swamp.lavrentious.ru", "localhost"],
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  define: {
    global: "window",
  },
});
