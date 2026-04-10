import { defineConfig as testConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration
const config = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

// Vitest configuration
const tstConfig = testConfig({
  test: {
    css: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
    reporters: ["verbose"],
  },
});

// Merge configurations
export default {
  ...config,
  ...tstConfig,
};
