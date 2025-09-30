import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // listen on 0.0.0.0 (also serves localhost)
    port: 5173,
    strictPort: true     // fail if 5173 is taken (so we know)
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true
  }
});
