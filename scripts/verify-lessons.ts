/**
 * Проверка всего учебного контента настоящим компилятором.
 * Для примера теории: ошибки компиляции ровно на строках с комментарием «// ошибка».
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
import { buildLib, LIB_FILES, reactExtras } from "../src/engine/lib";
import { checkCode, normalizeType, probeType } from "../src/engine/check";
import { LESSONS } from "../src/content/lessons";
import { checkOrder } from "./verify-order";
import { checkWeb } from "./verify-web";
import { HANDBOOK } from "../src/content/handbook";
import { REGIONS } from "../src/content/regions";
import { EXAM_ONLY_TASKS } from "../src/content/exams";
import { FLASHCARDS } from "../src/content/flashcards";
import type { Task } from "../src/content/types";
import { LEVELS } from "../src/content/sorter/levels";
import { SORTER_SOLUTIONS } from "../src/content/sorter/solutions";
import { analyze, simulate } from "../src/sorter/logic";

const require = createRequire(import.meta.url);
const libDir = dirname(require.resolve("typescript/lib/lib.es5.d.ts"));
const lib = buildLib(LIB_FILES.map((f) => readFileSync(join(libDir, f), "utf8")));
const reactDir = dirname(require.resolve("@types/react/package.json"));
const engine = createEngine(ts, lib, reactExtras((f) => readFileSync(join(reactDir, f), "utf8")));

let failures = 0;
const fail = (msg: string) => { failures++; console.log(`  ✗ ${msg}`); };

function checkTask(task: Task, tag: string) {
  if (task.type === "quiz") {
    if (task.a < 0 || task.a >= task.opts.length) fail(`${tag}: индекс ответа вне вариантов`);
    if (task.example) checkExample(task.example, `${tag}, пример`);
  } else if (task.type === "predict") {
    const got = normalizeType(probeType(engine, task.code, task.probe));
    const want = normalizeType(task.opts[task.a] ?? null);
    const diags = engine.diagnostics();
    if (got !== want) fail(`${tag}: компилятор показывает "${got}", а правильный вариант "${want}"`);
    if (diags.length) fail(`${tag}: в коде есть ошибки: ${diags.map((d) => d.msg).join("; ")}`);
    if (new Set(task.opts.map(normalizeType)).size !== task.opts.length) fail(`${tag}: варианты повторяются`);
  } else {
    if (checkCode(engine, task, task.code).ok) fail(`${tag}: стартовый код уже проходит проверку`);
    const sol = checkCode(engine, task, task.solution);
    if (!sol.ok) fail(`${tag}: эталонное решение не проходит: ${JSON.stringify(sol)}`);
  }
}

/** Пример теории: ошибки должны быть ровно на строках, помеченных «// ошибка», и больше нигде. */
function checkExample(code: string, where = "пример") {
  engine.set(code);
  const lines = code.split("\n");
  const errors = new Map<number, string>();
  for (const d of engine.diagnostics()) errors.set(d.line, d.msg);
  lines.forEach((text, i) => {
    const marked = /\/\/ ошибка/.test(text);
    const msg = errors.get(i + 1);
    if (marked && !msg) fail(`${where}, строка ${i + 1}: помечена «ошибка», но компилятор молчит`);
    if (!marked && msg) fail(`${where}, строка ${i + 1}: ошибка без пометки: ${msg}`);
  });
}

for (const lesson of LESSONS) {
  console.log(`${lesson.id} ${lesson.title}`);
  checkExample(lesson.theory.example);
  lesson.tasks.forEach((task, i) => checkTask(task, `[${i + 1}] ${task.type}`));
}

console.log("exams");
EXAM_ONLY_TASKS.forEach(({ region, task }, i) => checkTask(task, `регион ${region + 1}, вопрос ${i + 1}: ${task.q}`));

console.log("flashcards");
{
  const ids = new Set<string>();
  const questions = new Set<string>();
  for (const card of FLASHCARDS) {
    if (ids.has(card.id)) fail(`карточка ${card.id}: id повторяется`);
    if (questions.has(card.q)) fail(`карточка ${card.id}: такой вопрос уже есть`);
    ids.add(card.id);
    questions.add(card.q);
    if (!card.q.trim() || !card.a.trim()) fail(`карточка ${card.id}: пустой вопрос или ответ`);
    if (!card.code) fail(`карточка ${card.id}: нет примера кода`);
    else checkExample(card.code, `карточка ${card.id}`);
  }
}

console.log("сверка с Handbook");
{
  const lessonIds = new Set(LESSONS.map((l) => l.id));
  const cardIds = new Set(FLASHCARDS.map((c) => c.id));
  let built = 0, planned = 0, skipped = 0;
  for (const h of HANDBOOK) {
    const where = `Handbook «${h.page}» → ${h.section}`;
    if (!h.covered.length) fail(`${where}: раздел ни к чему не привязан`);
    for (const c of h.covered) {
      if ("lesson" in c && !lessonIds.has(c.lesson)) fail(`${where}: нет урока ${c.lesson}`);
      if ("level" in c && !LEVELS[c.level]) fail(`${where}: нет уровня ${c.level + 1}`);
      if ("card" in c && !cardIds.has(c.card)) fail(`${where}: нет карточки ${c.card}`);
      if ("skip" in c && c.skip.trim().length < 10) fail(`${where}: у пропуска нет понятной причины`);
      if ("topic" in c) {
        const [ri, title] = c.topic;
        if (!(REGIONS[ri]?.topics ?? []).some((t) => t.t === title)) fail(`${where}: в регионе ${ri + 1} нет темы «${title}»`);
      }
    }
    if (h.covered.some((c) => "lesson" in c || "level" in c)) built++;
    else if (h.covered.some((c) => "topic" in c || "card" in c)) planned++;
    else skipped++;
  }
  console.log(`  разделов: ${HANDBOOK.length}, в уроках: ${built}, в плане: ${planned}, пропущено с причиной: ${skipped}`);
}

console.log("порядок тем");
checkOrder(fail);

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

console.log("\nкурсы без кода");
const courses = checkWeb(fail);

console.log(failures ? `\n${failures} проблем` : `\nВсё проверено: ${LESSONS.length} уроков, ${LEVELS.length} уровней, ${EXAM_ONLY_TASKS.length} вопросов экзаменов, ${FLASHCARDS.length} карточек; ${courses.map((c) => `«${c.name}»: ${c.lessons} уроков, ${c.cards} карточек`).join("; ")}`);
process.exit(failures ? 1 : 0);
