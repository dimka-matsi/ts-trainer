import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc11",
  region: 9,
  title: "Ограничение параллельности: пул промисов",
  q: "Нужно загрузить 100 файлов, но не больше 3 одновременно. Напиши `runWithLimit(tasks, limit)`.",
  answer:
    "Запускаем `limit` «работников» — асинхронных циклов. Каждый берёт следующую задачу из общего счётчика, ждёт её и берёт следующую, пока задачи не кончатся. Так одновременно выполняется не больше `limit` задач, и новая начинается сразу, как освободилось место. Результат кладём по индексу задачи, чтобы сохранить порядок, а конец ждём через `Promise.all` по работникам. Простое деление на пачки по `limit` хуже: пачка ждёт самую медленную задачу, пока остальные места простаивают.",
  theory: {
    p: [
      "`Promise.all(tasks.map((t) => t()))` запустит всё сразу: сто запросов одновременно упрутся в лимиты браузера и сервера. Нужно ограничение: не больше N задач в работе. Задачи передаются функциями, чтобы запускать их по мере освобождения мест.",
      "Наивный способ — пачками: взять первые три, дождаться всех, взять следующие три. Минус: если в пачке один медленный файл, два места простаивают, пока он грузится. Лучше пул: как только одна задача закончилась, сразу стартует следующая.",
      "Пул на работниках. Общий счётчик `next` — индекс следующей задачи. Работник — `async` функция с циклом: пока `next < tasks.length`, берёт `const i = next++`, выполняет `await tasks[i]()` и пишет результат в `results[i]`. Запускаем `Math.min(limit, tasks.length)` работников и ждём их всех. Гонки за счётчик нет: код между `await` выполняется без прерываний, поток один.",
    ],
    code: `async function inBatches(tasks, size) {     // наивно: пачками
  const results = [];
  for (let i = 0; i < tasks.length; i += size) {
    const batch = tasks.slice(i, i + size).map((task) => task());
    results.push(...(await Promise.all(batch))); // ждём самую медленную в пачке
  }
  return results;
}

const wait = (ms, v) => () => new Promise((r) => setTimeout(() => r(v), ms));
const start = Date.now();
inBatches([wait(60, 1), wait(10, 2), wait(10, 3), wait(10, 4)], 2).then((r) => {
  console.log(r, "за", Date.now() - start >= 65 ? "≥ 70 мс" : "меньше");
});`,
    keys: [
      "Задачи — функции, чтобы запускать по мере освобождения мест.",
      "Пул: `limit` работников с циклом по общему счётчику, результат — по индексу.",
      "Пачки хуже пула: медленная задача держит всю пачку.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `runWithLimit(tasks, limit)`: `tasks` — функции, возвращающие промисы. Одновременно выполняется не больше `limit` задач, новая стартует сразу, как освободилось место. Результат — массив в порядке задач.",
      code: `async function runWithLimit(tasks, limit) {
  return Promise.all(tasks.map((task) => task()));
}`,
      tests: [
        ["runWithLimit([() => sleep(30).then(() => 1), () => sleep(10).then(() => 2), () => Promise.resolve(3)], 2)", "[1,2,3]"],
        ["(async () => { let active = 0, max = 0; const task = () => async () => { active++; max = Math.max(max, active); await sleep(10); active--; return 1; }; await runWithLimit([task(), task(), task(), task(), task()], 2); return max; })()", "2"],
        ["(async () => { const t = Date.now(); const w = (ms) => () => sleep(ms); await runWithLimit([w(100), w(20), w(20), w(20), w(20), w(20)], 2); return Date.now() - t < 125; })()", "true"],
        ["runWithLimit([], 3)", "[]"],
      ],
      solution: `async function runWithLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const workers = [];
  for (let k = 0; k < Math.min(limit, tasks.length); k++) workers.push(worker());
  await Promise.all(workers);
  return results;
}`,
      hint: "Общий счётчик `next` и функция-работник: `while (next < tasks.length) { const i = next++; results[i] = await tasks[i](); }`. Запусти `limit` работников и дождись их через `Promise.all`.",
    },
    {
      type: "quiz",
      q: "Почему пул быстрее, чем деление задач на пачки по `limit`?",
      opts: [
        "В пуле новая задача стартует, как только освободилось любое место, а пачка ждёт самую медленную задачу",
        "Пул запускает все задачи сразу",
        "Пачки не сохраняют порядок результатов",
        "Пул работает в отдельном потоке",
      ],
      a: 0,
      why: "С пачками места простаивают, пока грузится медленная задача. Пул всё время держит заняты `limit` мест.",
    },
  ],
};
