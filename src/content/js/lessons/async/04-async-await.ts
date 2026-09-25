import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "asy4",
  region: 5,
  level: "middle",
  title: "async и await",
  q: "Как работают `async` и `await`? Что происходит с кодом после `await`?",
  answer:
    "`async` функция всегда возвращает промис: `return x` выполняет его значением `x`, а брошенная ошибка отклоняет. `await` приостанавливает только эту функцию, пока промис не выполнится, и отдаёт управление вызывающему коду. Код до первого `await` выполняется синхронно, а продолжение после `await` ставится микрозадачей. Ошибки ловят обычным `try/catch`. Главная ловушка — лишняя последовательность: два независимых `await` подряд ждут друг друга, хотя запросы можно запустить одновременно.",
  theory: {
    p: [
      "`async function` — функция, которая всегда возвращает промис. `return 42` превращается в выполненный промис со значением `42`, `throw` — в отклонённый. Даже если внутри нет ничего асинхронного, результат всё равно придётся получать через `then` или `await`.",
      "`await promise` внутри `async` функции ждёт результат промиса: возвращает значение или бросает ошибку отклонения. Функция при этом не блокирует поток: она приостанавливается, управление возвращается вызывающему коду, а продолжение после `await` выполнится микрозадачей, когда промис будет готов. Код до первого `await` выполняется синхронно, сразу при вызове. `await` не-промиса тоже приостанавливает функцию на одну микрозадачу.",
      "Ошибки ловят `try/catch` вокруг `await` — это замена `.catch`. Если не поймать, отклонится промис, который вернула функция. Частая ошибка — `async` колбэк в `forEach`: `forEach` не ждёт промисы, и код после цикла выполнится раньше, чем закончится хоть одна итерация. Последовательно проходят через `for...of` с `await`.",
      "Последовательно или параллельно. `const a = await getA(); const b = await getB();` — второй запрос стартует только после первого, время складывается. Если запросы независимы, их запускают сразу, а ждут потом: `const pa = getA(); const pb = getB(); const a = await pa; const b = await pb;`. Удобные комбинаторы для этого — в следующем уроке.",
    ],
    code: `async function f() {
  console.log("2: до await — синхронно");
  await null;
  console.log("4: после await — микрозадача");
  return "готово";
}
console.log("1: вызываем f");
f().then((v) => console.log("5:", v));
console.log("3: f вернула промис, скрипт идёт дальше");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function main() {
  let t = Date.now();
  await wait(30);
  await wait(30);                     // последовательно: ~60 мс
  console.log("подряд:", Date.now() - t >= 55);
  t = Date.now();
  const p1 = wait(30);
  const p2 = wait(30);                // оба запущены сразу
  await p1;
  await p2;                           // параллельно: ~30 мс
  console.log("параллельно:", Date.now() - t < 55);
}
main();`,
    keys: [
      "`async` функция всегда возвращает промис. Код до первого `await` синхронный, продолжение — микрозадача.",
      "Ошибки ловят `try/catch`. `forEach` не ждёт `async` колбэки — для последовательного обхода нужен `for...of` с `await`.",
      "Независимые операции запускают сразу, а ждут потом, иначе время складывается.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `async function f() {
  console.log("2");
  await null;
  console.log("4");
}
console.log("1");
f();
console.log("3");`,
      opts: ["1\n2\n3\n4", "1\n3\n2\n4", "1\n2\n4\n3", "2\n1\n3\n4"],
      a: 0,
      why: "Тело `async` функции до первого `await` выполняется сразу при вызове. На `await` функция приостанавливается, а продолжение ждёт в очереди микрозадач, пока не закончится синхронный код.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `async function getValue() {
  return 42;
}
const r = getValue();
console.log(r instanceof Promise);
r.then((v) => console.log(v));
async function fail() {
  throw new Error("упс");
}
fail().catch((e) => console.log("поймали: " + e.message));
console.log("конец");`,
      opts: ["true\nконец\n42\nпоймали: упс", "false\n42\nконец\nпоймали: упс", "true\n42\nпоймали: упс\nконец", "true\nконец\nпоймали: упс\n42"],
      a: 0,
      why: "`async` функция возвращает промис, даже если внутри простой `return`. Обработчики `then` и `catch` — микрозадачи, они выполняются после `конец` в порядке постановки.",
    },
    {
      type: "quiz",
      q: "Два независимых запроса по 1 секунде: `const a = await getA(); const b = await getB();`. Сколько займёт код и как ускорить?",
      opts: [
        "Около 2 секунд. Запустить оба запроса сразу, а ждать потом",
        "Около 1 секунды: `await` сам запускает запросы параллельно",
        "Около 2 секунд, ускорить нельзя",
        "Около 1 секунды, но только в Node.js",
      ],
      a: 0,
      why: "`getB()` вызывается только после того, как первый `await` дождался ответа. Если сначала вызвать обе функции и сохранить промисы, запросы пойдут одновременно.",
    },
    {
      type: "run",
      goal: "Почини `sequential(tasks)`: `tasks` — массив функций, каждая возвращает промис. Нужно запускать их строго по очереди и вернуть массив результатов в том же порядке.",
      code: `async function sequential(tasks) {
  const results = [];
  tasks.forEach(async (task) => {
    results.push(await task());
  });
  return results;
}`,
      tests: [
        ["sequential([async () => 1, async () => 2])", "[1,2]"],
        ["(async () => { const log = []; const mk = (n, ms) => async () => { await sleep(ms); log.push(n); return n; }; const r = await sequential([mk(1, 30), mk(2, 5)]); return [r, log]; })()", "[[1,2],[1,2]]"],
        ["sequential([])", "[]"],
      ],
      solution: `async function sequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}`,
      hint: "`forEach` не ждёт промисы, которые возвращает `async` колбэк, поэтому функция возвращает пустой массив. Замени его на `for...of` с `await` внутри.",
    },
  ],
};
