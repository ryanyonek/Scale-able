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
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/main.jsx",
        "src/vitest.setup.ts",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/__mocks__/**",
        "src/assets/**",
      ],
    },
  },
});

// Merge configurations
export default {
  ...config,
  ...tstConfig,
};
