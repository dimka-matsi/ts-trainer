/**
 * Vite-плагин: хранит прогресс в файле проекта, чтобы он переживал перезапуск сервера,
 * смену порта и смену браузера. Работает в `npm run dev` и `npm run preview`.
 *   GET /__progress — содержимое файла (204, если файла ещё нет)
 *   PUT /__progress — записать JSON. Если в файле копия с более новым updatedAt, ответ 409 и эта копия:
 *                     старая вкладка не затрёт прогресс, сохранённый позже.
 * В статической сборке без сервера запросы падают, и приложение остаётся на localStorage.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { dirname } from "node:path";
import type { Plugin } from "vite";

const MAX_BYTES = 1_000_000;

/** Время последнего изменения прогресса; у битых данных — 0. */
const stamp = (x: unknown) =>
  typeof x === "object" && x !== null && typeof (x as { updatedAt?: unknown }).updatedAt === "number" ? (x as { updatedAt: number }).updatedAt : 0;

export function progressFile(file: string): Plugin {
  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.method === "GET") {
        const text = await readFile(file, "utf8").catch(() => null);
        if (text == null) { res.statusCode = 204; res.end(); return; }
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(text);
        return;
      }
      if (req.method === "PUT") {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (body.length > MAX_BYTES) { res.statusCode = 413; res.end(); return; }
        }
        const data: unknown = JSON.parse(body);
        if (typeof data !== "object" || data === null || Array.isArray(data)) { res.statusCode = 400; res.end(); return; }
        const current = await readFile(file, "utf8").catch(() => null);
        if (current != null && stamp(JSON.parse(current)) > stamp(data)) {
          res.statusCode = 409;
          res.setHeader("Content-Type", "application/json");
          res.end(current);
          return;
        }
        await mkdir(dirname(file), { recursive: true });
        // Запись через временный файл: при сбое посередине старый прогресс не испортится.
        const tmp = `${file}.tmp`;
        await writeFile(tmp, JSON.stringify(data, null, 2));
        await rename(tmp, file);
        res.statusCode = 204;
        res.end();
        return;
      }
      res.statusCode = 405;
      res.end();
    } catch {
      res.statusCode = 400;
      res.end();
    }
  };

  return {
    name: "progress-file",
    configureServer(server) {
      server.middlewares.use("/__progress", (req, res) => void handle(req, res));
    },
    configurePreviewServer(server) {
      server.middlewares.use("/__progress", (req, res) => void handle(req, res));
    },
  };
}
