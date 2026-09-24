import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { progressFile } from "./scripts/progress-file";

export default defineConfig({
  plugins: [
    react(),
    // Прогресс в файле проекта: переживает перезапуск, смену порта и браузера. Файл в .gitignore.
    progressFile(fileURLToPath(new URL("./.local/progress.json", import.meta.url))),
  ],
  // Постоянный порт: у localStorage адрес вместе с портом, при смене порта браузерное хранилище другое.
  server: { port: 5180, strictPort: true },
  preview: { port: 5181, strictPort: true },
  build: {
    // Компилятор TypeScript — один большой чанк (~3.5 МБ), грузится лениво.
    chunkSizeWarningLimit: 5000,
  },
});
