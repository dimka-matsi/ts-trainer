/**
 * Проверка всего учебного контента настоящим компилятором.
 * Для каждого упражнения:
 *  - predict: тип, который печатает компилятор, совпадает с правильным вариантом, в коде нет ошибок;
 *  - code: стартовый код НЕ проходит проверку, эталонное решение проходит;
 *  - quiz: индекс ответа в пределах вариантов.
 * Для уровней сортировщика эталонное решение компилируется и все выходы получают значения.
 * Запуск: npm run verify
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import ts from "typescript";
import { createEngine } from "../src/engine/engine";
import { buildLib, LIB_FILES } from "../src/engine/lib";
import { checkCode, normalizeType, probeType } from "../src/engine/check";
import { LESSONS } from "../src/content/lessons";
import { LEVELS } from "../src/content/sorter/levels";
import { SORTER_SOLUTIONS } from "../src/content/sorter/solutions";
import { analyze, simulate } from "../src/sorter/logic";

const require = createRequire(import.meta.url);
const libDir = dirname(require.resolve("typescript/lib/lib.es5.d.ts"));
const lib = buildLib(LIB_FILES.map((f) => readFileSync(join(libDir, f), "utf8")));
const engine = createEngine(ts, lib);

let failures = 0;
const fail = (msg: string) => { failures++; console.log(`  ✗ ${msg}`); };

for (const lesson of LESSONS) {
  console.log(`${lesson.id} ${lesson.title}`);
  lesson.tasks.forEach((task, i) => {
    const tag = `[${i + 1}] ${task.type}`;
    if (task.type === "quiz") {
      if (task.a < 0 || task.a >= task.opts.length) fail(`${tag}: индекс ответа вне вариантов`);
    } else if (task.type === "predict") {
      const got = normalizeType(probeType(engine, task.code, task.probe));
      const want = normalizeType(task.opts[task.a] ?? null);
      const diags = engine.diagnostics();
      if (got !== want) fail(`${tag}: компилятор показывает "${got}", а правильный вариант "${want}"`);
      if (diags.length) fail(`${tag}: в коде есть ошибки: ${diags.map((d) => d.msg).join("; ")}`);
    } else {
      if (checkCode(engine, task, task.code).ok) fail(`${tag}: стартовый код уже проходит проверку`);
      const sol = checkCode(engine, task, task.solution);
      if (!sol.ok) fail(`${tag}: эталонное решение не проходит: ${JSON.stringify(sol)}`);
    }
  });
}

LEVELS.forEach((level, i) => {
  console.log(`sorter ${i + 1} ${level.title}`);
  const slots = SORTER_SOLUTIONS[i];
  if (!slots) return fail("нет эталонного решения");
  const a = analyze(level, slots);
  const errors = [...a.gates, ...a.exits, a.final].flatMap((g) => (g && "error" in g && g.error ? [g.error.msg] : []));
  if (errors.length) fail(`решение не компилируется: ${errors.join("; ")}`);
  const sims = simulate(level, slots);
  [...level.exits, level.final].forEach((exit, j) => {
    const dest = j < level.exits.length ? j : "final";
    if (exit.must && !sims.some((s) => s.dest === dest)) fail(`в ${exit.code} не дошло ни одного значения`);
  });
});

console.log(failures ? `\n${failures} проблем` : `\nВсё проверено: ${LESSONS.length} уроков, ${LEVELS.length} уровней`);
process.exit(failures ? 1 : 0);
