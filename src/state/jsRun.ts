import type { TestResult } from "../engine/jsRunner";

/**
 * Выполняет код ученика в отдельном воркере. Если ответа нет за `limitMs` (например, бесконечный цикл),
 * воркер останавливается и возвращается `null`.
 */
function inWorker<T>(message: unknown, limitMs: number): Promise<T | null> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("../engine/jsWorker.ts", import.meta.url), { type: "module" });
    const timer = setTimeout(() => { worker.terminate(); resolve(null); }, limitMs);
    worker.onmessage = (e: MessageEvent<T>) => { clearTimeout(timer); worker.terminate(); resolve(e.data); };
    worker.onerror = () => { clearTimeout(timer); worker.terminate(); resolve(null); };
    worker.postMessage(message);
  });
}

/** Строки вывода `console.log` или `null`, если код не завершился вовремя. */
export const runOutputInWorker = (code: string) => inWorker<string[]>({ kind: "output", code }, 5000);

/** Результаты проверок или `null`, если код не завершился вовремя. */
export const runTestsInWorker = (code: string, tests: [string, string][]) =>
  inWorker<TestResult[]>({ kind: "tests", code, tests }, 3000 + tests.length * 2500);
