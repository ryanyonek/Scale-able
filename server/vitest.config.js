import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "routes/**/*.js",
        "services/**/*.js",
      ],
      exclude: [
        "**/*.test.js",
        "**/tests/**",
      ],
    },
  },
});
