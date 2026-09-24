import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u6",
  region: 5,
  title: "Awaited и NoInfer",
  q: "Что делает `Awaited` и зачем появился `NoInfer`?",
  answer: "`Awaited` рекурсивно разворачивает промисы, как `await`; его часто комбинируют с `ReturnType` для асинхронных функций. `NoInfer` (TS 5.4) блокирует вывод параметра типа из конкретной позиции, чтобы вторичный аргумент не расширял тип.",
  theory: {
    p: [
      "`Awaited<T>` повторяет поведение `await`: рекурсивно разворачивает промисы. `Awaited<Promise<Promise<number>>>` — `number`, а не-промисы остаются как есть.",
      "Главное применение — тип результата асинхронной функции: `Awaited<ReturnType<typeof load>>`.",
      "`NoInfer<T>` (TS 5.4) запрещает выводить параметр типа из конкретного аргумента. Без него TS может расширить `T` за счёт опечатки во «вторичном» параметре; с ним опечатка становится ошибкой.",
    ],
    example: `async function load() { return { id: 1, tags: ["a"] }; }
type Data = Awaited<ReturnType<typeof load>>;

type B = Awaited<boolean | Promise<number>>;  // number | boolean

function light<C extends string>(colors: C[], initial?: NoInfer<C>) {}
light(["red", "green"], "red");   // ок
light(["red", "green"], "blue");  // ошибка благодаря NoInfer`,
    keys: ["`Awaited` разворачивает промисы рекурсивно.", "`Awaited<ReturnType<typeof fn>>` — данные async-функции.", "`NoInfer` отключает вывод в одной позиции."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `D`?",
      probe: "D",
      code: `async function load() { return [1, 2, 3]; }
type D = Awaited<ReturnType<typeof load>>;`,
      opts: ["Promise<number[]>", "number[]", "number", "unknown"],
      a: 1,
      why: "`ReturnType` даёт `Promise<number[]>`, а `Awaited` снимает обёртку.",
    },
    {
      type: "predict",
      q: "Без `NoInfer`: какой тип у `r`?",
      probe: "r",
      code: `function pick<T extends string>(all: T[], def: T) { return def; }
const r = pick(["a", "b"], "c");`,
      opts: ["\"a\" | \"b\"", "\"a\" | \"b\" | \"c\"", "string", "Ошибка компиляции"],
      a: 1,
      why: "`T` выводится из обоих аргументов, и опечатка `\"c\"` просто расширяет union. Именно эту проблему решает `NoInfer`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyAwaited<T>`, который рекурсивно разворачивает `Promise`.",
      code: `type MyAwaited<T> = unknown;`,
      tests: `type t1 = Expect<Equal<MyAwaited<Promise<string>>, string>>;
type t2 = Expect<Equal<MyAwaited<Promise<Promise<number>>>, number>>;
type t3 = Expect<Equal<MyAwaited<boolean>, boolean>>;`,
      forbid: ["any", "ignore", {"re": "\\bAwaited\\b", "msg": "Без встроенного Awaited"}],
      hint: "`T extends Promise<infer U> ? MyAwaited<U> : T`.",
      solution: `type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "Добавь `NoInfer`, чтобы опечатка в `fallback` стала ошибкой.",
      code: `function getSetting<K extends string>(keys: K[], fallback: K): K {
  return keys.includes(fallback) ? fallback : keys[0];
}

getSetting(["dark", "light"], "dark");`,
      tests: `// @ts-expect-error опечатка должна быть ошибкой
getSetting(["dark", "light"], "drak");`,
      forbid: ["any", "ignore"],
      must: ["NoInfer"],
      hint: "Оберни тип второго параметра: `fallback: NoInfer<K>`.",
      solution: `function getSetting<K extends string>(keys: K[], fallback: NoInfer<K>): K {
  return keys.includes(fallback) ? fallback : keys[0];
}

getSetting(["dark", "light"], "dark");`,
    },
  ],
};
