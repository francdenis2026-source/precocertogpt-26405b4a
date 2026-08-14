import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        dorinha: resolve(projectRoot, "autora/dorinha-barroso/index.html"),
        dorinhaShort: resolve(projectRoot, "dorinha-barroso/index.html"),
      },
    },
  },
  test: {
    // Os testes ponta a ponta rodam no Playwright, não no Vitest.
    exclude: ["**/node_modules/**", "**/dist/**", "src/tests/e2e/**"],
  },
});
