import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // ensure only one copy of react & react-dom is ever used
    dedupe: ["react", "react-dom"]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  },
  server: { host: true, port: 5174, strictPort: true },
  preview: { host: true, port: 5174, strictPort: true }
});
