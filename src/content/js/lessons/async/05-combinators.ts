import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "asy5",
  region: 5,
  level: "middle",
  title: "Promise.all, allSettled, race и any",
  q: "Чем отличаются `Promise.all`, `Promise.allSettled`, `Promise.race` и `Promise.any`?",
  answer:
    "Все четыре принимают массив промисов и возвращают один промис. `Promise.all` ждёт все и отдаёт массив значений в исходном порядке, но отклоняется при первой же ошибке. `Promise.allSettled` ждёт все и никогда не отклоняется: отдаёт объекты `{ status, value }` или `{ status, reason }`. `Promise.race` берёт результат первого завершившегося промиса — успешного или нет, на нём делают тайм-ауты. `Promise.any` ждёт первый успешный, а если отклонились все — отклоняется с `AggregateError`.",
  theory: {
    p: [
      "`Promise.all(promises)` — «всё или ничего». Результат — массив значений в том же порядке, что и промисы на входе, независимо от того, кто закончил раньше. Первая ошибка сразу отклоняет общий промис, остальные результаты теряются, хотя сами операции продолжают выполняться — промис нельзя отменить.",
      "`Promise.allSettled(promises)` ждёт все и всегда выполняется. Каждый элемент результата — `{ status: \"fulfilled\", value }` или `{ status: \"rejected\", reason }`. Его берут, когда нужны все ответы, даже если часть упала: например, загрузить виджеты страницы независимо друг от друга.",
      "`Promise.race(promises)` повторяет судьбу первого завершившегося промиса — и успех, и ошибку. Классическое применение — тайм-аут: гонка запроса и таймера, который отклоняется через N секунд. `Promise.any(promises)` ждёт первый успех и игнорирует ошибки, пока есть надежда; если отклонились все, бросает `AggregateError` со списком ошибок в `errors`. Подходит для запроса к нескольким зеркалам.",
      "С пустым массивом: `all` и `allSettled` сразу выполняются пустым массивом, `any` сразу отклоняется, а `race` навсегда остаётся в ожидании. В ES2024 появился `Promise.withResolvers()` — возвращает промис вместе с его `resolve` и `reject`, чтобы не писать обёртку `new Promise` вручную.",
    ],
    code: `const wait = (ms, value, fail) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error(value)) : resolve(value)), ms));

Promise.all([wait(30, "a"), wait(10, "b")])
  .then((r) => console.log("all:", r));                 // порядок входа, не финиша
Promise.race([wait(40, "медленный"), wait(15, "быстрый")])
  .then((r) => console.log("race:", r));
Promise.any([wait(5, "ошибка", true), wait(20, "успех")])
  .then((r) => console.log("any:", r));                 // ошибку пропустил
Promise.allSettled([wait(1, "ok"), wait(2, "нет", true)])
  .then((r) => console.log("allSettled:", r.map((x) => x.status)));

const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("тайм-аут")), ms));
Promise.race([wait(100, "ответ"), timeout(50)])
  .catch((e) => console.log("race с таймером:", e.message));`,
    keys: [
      "`all` — все значения в исходном порядке, отклоняется на первой ошибке. `allSettled` — статусы всех, не отклоняется.",
      "`race` — первый завершившийся, успех или ошибка. На нём строят тайм-ауты.",
      "`any` — первый успешный; если все упали — `AggregateError`. Промисы не отменяются, даже если результат уже не нужен.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
Promise.all([wait(30, "a"), wait(10, "b")]).then((r) => console.log(r));
Promise.race([wait(40, "медленный"), wait(15, "быстрый")]).then((r) => console.log(r));`,
      opts: ["быстрый\n[\"a\", \"b\"]", "[\"b\", \"a\"]\nбыстрый", "быстрый\n[\"b\", \"a\"]", "[\"a\", \"b\"]\nбыстрый"],
      a: 0,
      why: "`race` выполнится через 15 мс, а `all` — только через 30, когда готовы оба. Значения в `all` идут в порядке входного массива, а не в порядке завершения.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `(async () => {
  try {
    const r = await Promise.all([Promise.resolve(1), Promise.reject(new Error("сбой")), Promise.resolve(3)]);
    console.log("результат", r);
  } catch (e) {
    console.log("all:", e.message);
  }
  const settled = await Promise.allSettled([Promise.resolve(1), Promise.reject(new Error("сбой"))]);
  console.log("allSettled:", settled.map((x) => x.status).join(","));
})();`,
      opts: ["all: сбой\nallSettled: fulfilled,rejected", "результат [1, 3]\nallSettled: fulfilled,rejected", "all: сбой\nallSettled: fulfilled", "allSettled: fulfilled,rejected\nрезультат [1, undefined, 3]"],
      a: 0,
      why: "Одна ошибка отклоняет весь `Promise.all`. `allSettled` не отклоняется никогда и сообщает статус каждого промиса.",
    },
    {
      type: "match",
      q: "Сопоставь комбинатор и задачу.",
      pairs: [
        ["`Promise.all`", "загрузить данные страницы, без любого куска она бесполезна"],
        ["`Promise.allSettled`", "загрузить независимые виджеты и показать те, что пришли"],
        ["`Promise.race`", "отменить ожидание, если ответа нет за 5 секунд"],
        ["`Promise.any`", "взять ответ от самого быстрого рабочего зеркала"],
      ],
      why: "`race` реагирует и на ошибку, поэтому годится для тайм-аута. `any` ошибки пропускает, пока жив хоть один промис.",
    },
    {
      type: "run",
      goal: "Напиши `withTimeout(promise, ms)`: возвращает промис с результатом `promise`, а если тот не успел за `ms` миллисекунд — отклоняется с ошибкой `new Error(\"timeout\")`.",
      code: `function withTimeout(promise, ms) {
  return promise;
}`,
      tests: [
        ["withTimeout(sleep(10).then(() => \"ok\"), 100)", "\"ok\""],
        ["withTimeout(sleep(100).then(() => \"поздно\"), 10).catch((e) => e.message)", "\"timeout\""],
        ["withTimeout(Promise.reject(new Error(\"своя\")), 100).catch((e) => e.message)", "\"своя\""],
      ],
      solution: `function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timer]);
}`,
      hint: "Создай промис, который через `ms` отклоняется с `new Error(\"timeout\")`, и устрой гонку `Promise.race([promise, timer])`.",
    },
  ],
};
