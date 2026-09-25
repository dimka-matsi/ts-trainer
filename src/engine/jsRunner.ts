/**
 * Запуск JavaScript для уроков: вывод `console.log` для заданий «что выведет» и проверки функций для заданий
 * «напиши код». Работает одинаково в Node (verify) и в воркере браузера. Код выполняется в строгом режиме,
 * как в ES-модуле: `this` на верхнем уровне функций — `undefined`.
 */

/** Значение так, как его показывает консоль, в упрощённом и одинаковом для всех браузеров виде. */
export function show(v: unknown, nested = false): string {
  if (typeof v === "string") return nested ? JSON.stringify(v) : v;
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "bigint") return `${v}n`;
  if (v === undefined || v === null || typeof v === "boolean") return String(v);
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return `[Function: ${v.name || "anonymous"}]`;
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (Array.isArray(v)) return `[${v.map((x) => show(x, true)).join(", ")}]`;
  if (v instanceof Map) return `Map(${v.size}) {${[...v].map(([k, x]) => `${show(k, true)} => ${show(x, true)}`).join(", ")}}`;
  if (v instanceof Set) return `Set(${v.size}) {${[...v].map((x) => show(x, true)).join(", ")}}`;
  if (v instanceof Promise) return "Promise {…}";
  const entries = Object.entries(v as object);
  if (!entries.length) return "{}";
  return `{ ${entries.map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${show(x, true)}`).join(", ")} }`;
}

/** Код обращается к странице (DOM, окно, хранилища), к сети или к другим модулям — в воркере и в Node его не выполнить честно. */
export const needsPage = (code: string) =>
  /\b(document|window|localStorage|sessionStorage|indexedDB|navigator|requestAnimationFrame|IntersectionObserver|ResizeObserver|MutationObserver|HTMLElement|Event|Worker)\b|addEventListener|\bfetch\(/.test(code) ||
  /^\s*(import|export)\b|\bimport\(|\brequire\(/m.test(code);

/** Строка вывода для необработанной ошибки: только имя. Тексты сообщений у движков разные. */
const errorLine = (e: unknown) => (e instanceof Error ? `Uncaught ${e.name}` : `Uncaught ${show(e)}`);

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

/**
 * Выполняет код и возвращает строки вывода. Ждёт, пока выполнятся все микрозадачи и таймеры,
 * но не дольше `limitMs`. Необработанные ошибки попадают в вывод строкой `Uncaught ИмяОшибки`.
 */
export async function runOutput(code: string, limitMs = 3000): Promise<string[]> {
  const lines: string[] = [];
  const log = (...args: unknown[]) => { lines.push(args.map((a) => show(a)).join(" ")); };
  const fakeConsole = { log, info: log, warn: log, error: log, debug: log };
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const guard = (fn: () => void) => { try { fn(); } catch (e) { lines.push(errorLine(e)); } };
  const fakeSetTimeout = (fn: (...a: unknown[]) => void, ms = 0, ...args: unknown[]) => {
    const id = setTimeout(() => { timers.delete(id); guard(() => fn(...args)); }, ms);
    timers.add(id);
    return id;
  };
  const fakeClearTimeout = (id: ReturnType<typeof setTimeout>) => { clearTimeout(id); timers.delete(id); };
  const fakeSetInterval = (fn: (...a: unknown[]) => void, ms = 0, ...args: unknown[]) => {
    const id = setInterval(() => guard(() => fn(...args)), ms);
    timers.add(id);
    return id;
  };
  const fakeClearInterval = (id: ReturnType<typeof setInterval>) => { clearInterval(id); timers.delete(id); };
  const fakeQueueMicrotask = (fn: () => void) => queueMicrotask(() => guard(fn));

  try {
    const run = new Function("console", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "queueMicrotask", `"use strict";\n${code}`);
    run(fakeConsole, fakeSetTimeout, fakeClearTimeout, fakeSetInterval, fakeClearInterval, fakeQueueMicrotask);
  } catch (e) {
    lines.push(errorLine(e));
  }
  const start = Date.now();
  while (Date.now() - start < limitMs) {
    await tick();
    if (!timers.size) {
      await tick();
      if (!timers.size) break;
    }
  }
  for (const id of timers) { clearTimeout(id); clearInterval(id); }
  return lines;
}

export interface TestResult {
  expr: string;
  want: string;
  got: string;
  pass: boolean;
}

/** JSON-представление результата для сравнения; `undefined` и ошибки — отдельными строками. */
const asJson = (v: unknown) => (v === undefined ? "undefined" : JSON.stringify(v) ?? String(v));

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Проверки функции: для каждой пары [выражение, ожидаемый JSON] код выполняется заново, выражение вычисляется
 * (можно `await` и `sleep(мс)`), результат сравнивается через JSON. Каждая проверка ограничена `limitMs`.
 */
export async function runTests(code: string, tests: [expr: string, want: string][], limitMs = 2000): Promise<TestResult[]> {
  const out: TestResult[] = [];
  for (const [expr, want] of tests) {
    let got: string;
    try {
      // Код ученика — во вложенной функции: так его объявления могут перекрыть `sleep`, а не столкнуться с ним.
      const run = new Function("sleep", `"use strict";\nreturn (() => {\n${code}\n;return (async () => (${expr}))();\n})();`) as (sleep: (ms: number) => Promise<void>) => Promise<unknown>;
      const value = await Promise.race([
        run(sleep),
        new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), limitMs)),
      ]);
      got = asJson(value);
    } catch (e) {
      got = e instanceof Error && e.message === "TIMEOUT" ? "превышено время" : `ошибка ${e instanceof Error ? e.name : show(e)}`;
    }
    out.push({ expr, want, got, pass: got === want });
  }
  return out;
}
