import type { CodeTask, ForbidPreset, ForbidRule } from "../content/types";
import type { Diagnostic, Engine } from "./engine";

const PRESETS: Record<ForbidPreset, { re: string; msg: string }> = {
  any: { re: "(?<!keyof\\s)\\bany\\b", msg: "Без `any`" },
  as: { re: "\\bas\\s+(?!const\\b)", msg: "Без `as` (кроме `as const`)" },
  nonnull: { re: "[\\w\\)\\]]!(?=[.\\[;,)\\s])", msg: "Без non-null `!`" },
  ignore: { re: "@ts-(ignore|expect-error|nocheck)", msg: "Без `@ts-ignore` и `@ts-expect-error`" },
};

const resolve = (rule: ForbidRule) => (typeof rule === "string" ? PRESETS[rule] : rule);
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

/** Однострочная форма типа из quick info: без `type X =` и `const x:`. */
export function normalizeType(info: string | null): string {
  if (!info) return "";
  return info
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^type\s+[\w$]+(<[^>]*>)?\s*=\s*/, "")
    .replace(/^(const|let|var)\s+[\w$]+\s*:\s*/, "");
}

function findDeclaration(code: string, name: string): number {
  const re = new RegExp(`\\b(type|const|let|var|function)\\s+${name}\\b`, "g");
  let last = -1;
  for (let m = re.exec(code); m; m = re.exec(code)) last = m.index + m[0].length - name.length;
  return last;
}

/** Quick info для объявления `name` в коде. */
export function probeType(engine: Engine, code: string, name: string): string | null {
  engine.set(code);
  const pos = findDeclaration(code, name);
  return pos < 0 ? null : engine.quickInfo(pos);
}

export interface TestFailure {
  line: string;
  code: number;
  msg: string;
}

export interface RuntimeResult {
  expr: string;
  want: string;
  got: string;
  pass: boolean;
}

export interface CodeCheckResult {
  ok: boolean;
  errors: Diagnostic[];
  testFailures: TestFailure[];
  forbidden: string[];
  missing: string[];
  runtime: RuntimeResult[];
}

/** Проверка упражнения: ошибки компиляции, скрытые тесты, запреты и рантайм. */
export function checkCode(engine: Engine, task: CodeTask, code: string): CodeCheckResult {
  const clean = stripComments(code);
  const forbidden = (task.forbid ?? []).map(resolve).filter((f) => new RegExp(f.re, "m").test(clean)).map((f) => f.msg);
  const missing = (task.must ?? []).filter((m) => !clean.includes(m));

  const userLines = code.split("\n").length;
  const testLines = (task.tests ?? "").split("\n");
  engine.set(code + "\n" + (task.tests ?? ""));
  const errors: Diagnostic[] = [];
  const testFailures: TestFailure[] = [];
  for (const d of engine.diagnostics()) {
    if (d.line <= userLines) errors.push(d);
    else testFailures.push({ line: (testLines[d.line - userLines - 1] ?? "").trim(), code: d.code, msg: d.msg });
  }

  const runtime: RuntimeResult[] = [];
  if (!errors.length && !testFailures.length && task.runtime?.length) {
    const js = engine.transpile(code);
    for (const [expr, want] of task.runtime) {
      try {
        const value: unknown = new Function(`${js}\n;return (${expr});`)();
        const got = JSON.stringify(value);
        runtime.push({ expr, want, got, pass: got === want });
      } catch (e) {
        runtime.push({ expr, want, got: `ошибка: ${e instanceof Error ? e.message : String(e)}`, pass: false });
      }
    }
  }

  const ok = !errors.length && !testFailures.length && !forbidden.length && !missing.length && runtime.every((r) => r.pass);
  return { ok, errors, testFailures, forbidden, missing, runtime };
}
