import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f7",
  region: 2,
  title: "Rest-параметры и кортежи",
  q: "Почему вызов `Math.atan2(...args)` не компилируется, если `args = [1, 2]`?",
  answer: "`const args = [1, 2]` получает тип `number[]`: длина неизвестна, а `atan2` ждёт ровно два аргумента. Spread в вызов требует кортежа, и `as const` делает `readonly [1, 2]`. Rest-параметр с дженериком `...args: A` пробрасывает аргументы из одной функции в другую без потери типов.",
  theory: {
    p: [
      "Rest-параметр `...nums: number[]` собирает все оставшиеся аргументы в массив. Его тип — всегда массив или кортеж.",
      "Spread в вызов проверяется по длине. Массив `number[]` может быть любой длины, поэтому в функцию с двумя параметрами его передать нельзя. Кортеж `[number, number]` или `as const` решают проблему.",
      "Rest-параметр с кортежем задаёт точный список аргументов: `(...args: [name: string, age?: number])` — то же, что два параметра. Если сделать его дженериком `A extends unknown[]`, TypeScript выведет кортеж из аргументов вызова.",
      "Так пишут обёртки над функциями: `logCall(fn, ...args)` принимает ровно те аргументы, которые ждёт `fn`. Если передать меньше или другого типа, будет ошибка.",
    ],
    example: `function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3);

const args = [1, 2];
Math.atan2(...args);        // ошибка: у number[] неизвестная длина
const pair = [1, 2] as const;
Math.atan2(...pair);        // ок

function logCall<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): R {
  console.log("вызов с", args);
  return fn(...args);
}
logCall((s: string, n: number) => s.repeat(n), "ab", 2);
logCall((s: string, n: number) => s.repeat(n), "ab"); // ошибка: не хватает n`,
    keys: ["Rest-параметр — всегда массив или кортеж.", "Spread в вызов требует известной длины.", "`...args: A` с дженериком пробрасывает аргументы без потерь."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function tail<T extends unknown[]>(first: unknown, ...rest: T) {
  return rest;
}
const r = tail(1, "a", true);`,
      opts: ["[string, boolean]", "(string | boolean)[]", "unknown[]", "[number, string, boolean]"],
      a: 0,
      why: "Дженерик-rest выводит кортеж из оставшихся аргументов: первый ушёл в `first`, остались строка и boolean.",
    },
    {
      type: "code",
      kind: "write",
      goal: "`call` принимает функцию и аргументы для неё. Сейчас всё описано через `any`, и ошибки в аргументах не ловятся. Опиши параметры через дженерики, чтобы `call` принимала ровно те аргументы, которые ждёт `fn`, и возвращала её результат.",
      code: `function call(fn: (...args: any[]) => any, ...args: any[]) {
  return fn(...args);
}`,
      tests: `const n = call((a: number, b: number) => a + b, 1, 2);
type t1 = Expect<Equal<typeof n, number>>;
const s = call((x: string) => x.toUpperCase(), "a");
type t2 = Expect<Equal<typeof s, string>>;
// @ts-expect-error: второй аргумент должен быть числом
call((a: number, b: number) => a + b, 1, "2");`,
      runtime: [["call((a, b) => a + b, 1, 2)", "3"]],
      forbid: ["any", "as", "ignore"],
      hint: "Два параметра типа: `A extends unknown[]` для аргументов и `R` для результата.",
      solution: `function call<A extends unknown[], R>(fn: (...args: A) => R, ...args: A): R {
  return fn(...args);
}`,
    },
  ],
};
