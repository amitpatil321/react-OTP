import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
