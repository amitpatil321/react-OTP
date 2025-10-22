/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
// import eslint from "vite-plugin-eslint"
import eslintPlugin from "@nabla/vite-plugin-eslint"

// https://vite.dev/config/
// Simple vitest config for unit tests only
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    include: ["src/__tests__/**.{test,spec}.{js,ts,jsx,tsx}"],
    css: true
  }
})
