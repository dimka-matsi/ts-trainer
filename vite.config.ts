import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Компилятор TypeScript — один большой чанк (~3.5 МБ), грузится лениво.
    chunkSizeWarningLimit: 5000,
  },
});
