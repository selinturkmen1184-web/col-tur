import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [react(), sites()],
});
