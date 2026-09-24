/**
 * Проверка раздела «Браузер» в jsdom:
 *  - пример теории и примеры карточек запускаются без ошибок;
 *  - «что выведется»: строки console.log, склеенные через ", ", совпадают с правильным вариантом;
 *  - задание на DOM: стартовый код не проходит тесты, эталонное решение проходит;
 *  - порядок тем: конструкция не встречается раньше урока, где её проходят.
 */
import { WEB_FLASHCARDS, WEB_LESSONS, WEB_REGIONS } from "../src/content/web";
import type { WebTask } from "../src/content/web/types";
import { runInJsdom } from "./web-run";

const CONCEPTS: { name: string; re: RegExp; at: string }[] = [
  { name: "capture", re: /capture: true/, at: "w2" },
  { name: "stopPropagation", re: /stopPropagation|stopImmediatePropagation/, at: "w2" },
  { name: "closest", re: /\.closest\(/, at: "w3" },
  { name: "dataset", re: /\.dataset\b|data-\w+=/, at: "w3" },
  { name: "preventDefault", re: /preventDefault|defaultPrevented/, at: "w4" },
  { name: "passive", re: /passive/, at: "w4" },
  { name: "CustomEvent", re: /CustomEvent|dispatchEvent/, at: "w5" },
  { name: "снятие обработчиков", re: /removeEventListener|AbortController|signal/, at: "w6" },
  { name: "focusin/focusout", re: /focusin|focusout/, at: "w7" },
];

const taskText = (t: WebTask) =>
  t.type === "dom" ? [t.goal, t.code, t.tests, t.hint, t.solution].join("\n")
    : t.type === "output" ? [t.q, t.code, ...t.opts, t.why].join("\n")
    : [t.q, ...t.opts, t.why, t.example ?? ""].join("\n");

export async function checkWeb(fail: (msg: string) => void) {
  const order = WEB_LESSONS.map((l) => l.id);
  for (const lesson of WEB_LESSONS) {
    console.log(`${lesson.id} ${lesson.title}`);
    const ex = await runInJsdom(lesson.theory.html, lesson.theory.example);
    if (ex.errors.length) fail(`${lesson.id} пример: ${ex.errors[0]}`);

    const pos = order.indexOf(lesson.id);
    const texts = [[lesson.q, lesson.answer, ...lesson.theory.p, ...lesson.theory.keys, lesson.theory.example].join("\n"), ...lesson.tasks.map(taskText)];
    for (const c of CONCEPTS) {
      if (order.indexOf(c.at) <= pos) continue;
      for (const text of texts) {
        const m = c.re.exec(text);
        if (m) { fail(`${lesson.id}: «${c.name}» встречается раньше урока ${c.at}: …${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ")}…`); break; }
      }
    }

    for (const [i, task] of lesson.tasks.entries()) {
      const tag = `${lesson.id} [${i + 1}] ${task.type}`;
      if (task.type === "quiz") {
        if (task.a < 0 || task.a >= task.opts.length) fail(`${tag}: индекс ответа вне вариантов`);
        if (task.example) {
          const r = await runInJsdom("", task.example);
          if (r.errors.length) fail(`${tag}, пример: ${r.errors[0]}`);
        }
      } else if (task.type === "output") {
        const r = await runInJsdom(task.html ?? "", task.code);
        const got = r.logs.join(", ");
        if (r.errors.length) fail(`${tag}: ошибка при запуске: ${r.errors[0]}`);
        if (got !== task.opts[task.a]) fail(`${tag}: код выводит «${got}», а правильный вариант «${task.opts[task.a]}»`);
        if (new Set(task.opts).size !== task.opts.length) fail(`${tag}: варианты повторяются`);
      } else {
        const start = await runInJsdom(task.html, task.code, task.tests);
        if (!start.test) fail(`${tag}: тесты стартового кода не завершились`);
        else if (start.test.ok) fail(`${tag}: стартовый код уже проходит тесты`);
        const sol = await runInJsdom(task.html, task.solution, task.tests);
        if (!sol.test?.ok) fail(`${tag}: эталонное решение не проходит: ${sol.test?.text ?? sol.errors[0] ?? "тесты не завершились"}`);
        if (sol.errors.length) fail(`${tag}: в решении ошибка: ${sol.errors[0]}`);
        for (const m of task.must ?? []) {
          if (!task.code.includes(m) && !task.solution.includes(m)) fail(`${tag}: фрагмента «${m}» нет ни в коде, ни в решении`);
          if (!task.solution.includes(m)) fail(`${tag}: в решении нет обязательного фрагмента «${m}»`);
        }
      }
    }
  }

  console.log("карточки «Браузера»");
  const ids = new Set<string>();
  const questions = new Set<string>();
  for (const card of WEB_FLASHCARDS) {
    if (ids.has(card.id) || questions.has(card.q)) fail(`карточка ${card.id}: повторяется id или вопрос`);
    ids.add(card.id);
    questions.add(card.q);
    if (!card.code) { fail(`карточка ${card.id}: нет примера кода`); continue; }
    if (!WEB_REGIONS[card.region]) fail(`карточка ${card.id}: нет региона ${card.region}`);
    const html = WEB_LESSONS.find((l) => `w-lesson-${l.id}` === card.id)?.theory.html ?? "";
    const r = await runInJsdom(html, card.code);
    if (r.errors.length) fail(`карточка ${card.id}: ${r.errors[0]}`);
  }
  return { lessons: WEB_LESSONS.length, cards: WEB_FLASHCARDS.length };
}
