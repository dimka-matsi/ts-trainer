import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob7",
  region: 3,
  title: "Кортежи и variadic tuples",
  q: "Чем кортеж отличается от массива? Что такое необязательные, rest- и variadic-элементы `[...T, U]`?",
  answer: "Массив `T[]` — любое количество элементов одного типа. Кортеж `[string, number]` — фиксированное число элементов, у каждой позиции свой тип, а длина — литеральный тип. Бывают необязательные элементы `[number, number?]`, rest-элемент `[string, ...number[]]` и подписи `[x: number, y: number]` для читаемости. Variadic-кортежи `[...T, U]` в дженериках позволяют добавлять элементы к кортежу и сохранять точные типы, например в функциях вроде `push` или обёртках аргументов.",
  theory: {
    p: [
      "Кортеж — массив, где известны длина и тип каждой позиции: `type Point = [number, number]`. `p[0]` — число, `p[2]` — ошибка, а `p.length` имеет тип `2`. Кортежи возвращают из функций, которым нужно отдать несколько значений, как `useState` в React.",
      "Необязательный элемент — `[number, number?]`: длина `1 | 2`, а второй элемент `number | undefined`. Rest-элемент — `[string, ...number[]]`: строка, а за ней сколько угодно чисел. Подписи — `[x: number, y: number]`: они не меняют тип, но видны в подсказках редактора.",
      "Variadic-кортежи: запись `...T` внутри кортежа, где `T` — параметр типа, ограниченный массивом. `function push<T extends unknown[]>(arr: [...T], x: number): [...T, number]` сохраняет точный тип: `push([\"a\", true], 1)` даёт `[string, boolean, number]`. Так типизируют функции, которые добавляют или убирают аргументы.",
      "Массив и кортеж легко спутать при выводе: `const a = [1, \"x\"]` — это массив `(string | number)[]`, а не кортеж. Кортеж получают аннотацией, `as const` или дженериком с `[...T]`.",
    ],
    example: `type Point = [x: number, y: number, z?: number];
const p: Point = [1, 2];
const q: Point = [1, 2, 3, 4];     // ошибка: слишком много элементов

type Args = [string, ...number[]];
const args: Args = ["sum", 1, 2, 3];

function push<T extends unknown[]>(arr: [...T], x: number): [...T, number] {
  return [...arr, x];
}
const r = push(["a", true], 1);    // [string, boolean, number]`,
    keys: ["Кортеж — фиксированная длина и свой тип у каждой позиции, длина — литеральный тип.", "`[a, b?]`, `[a, ...b[]]` и подписи `[x: number]` — необязательные, rest-элементы и имена.", "`[...T, U]` в дженериках сохраняет точный тип при добавлении элементов."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `len`?",
      probe: "len",
      code: `type P = [number, number?];
declare const p: P;
const len = p.length;`,
      opts: ["1 | 2", "number", "2", "1"],
      a: 0,
      why: "Второй элемент необязательный, поэтому кортеж бывает длины 1 или 2.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function push<T extends unknown[]>(arr: [...T], x: number): [...T, number] {
  return [...arr, x];
}
const r = push(["a", true], 1);`,
      opts: ["[string, boolean, number]", "(string | number | boolean)[]", "[...unknown[], number]", "unknown[]"],
      a: 0,
      why: "`[...T]` просит вывести аргумент как кортеж, и результат добавляет `number` в конец.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши дженерик-тип `Prepend<T>`: кортеж `T`, к началу которого добавлено `number`.",
      code: `type Prepend<T extends unknown[]> = unknown[];`,
      tests: `type t1 = Expect<Equal<Prepend<[string]>, [number, string]>>;
type t2 = Expect<Equal<Prepend<[]>, [number]>>;
type t3 = Expect<Equal<Prepend<[boolean, string]>, [number, boolean, string]>>;`,
      forbid: ["any", "ignore"],
      hint: "Кортеж с элементом и развёрнутым `T`: `[number, ...T]`.",
      solution: `type Prepend<T extends unknown[]> = [number, ...T];`,
    },
  ],
};
