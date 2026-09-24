import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "fg",
  region: 2,
  title: "Дженерик-функции",
  q: "Зачем нужны дженерик-функции и откуда TypeScript берёт их параметр типа?",
  answer: "Дженерик-функция связывает типы входа и выхода через параметр типа. `first<T>(arr: T[])` для массива строк вернёт строку, для массива чисел — число, а с `any` результат был бы `any`. При вызове параметр типа обычно не пишут: TypeScript выводит его из аргументов. Ограничение `T extends { length: number }` разрешает передавать только типы с полем `length` и пользоваться им внутри функции.",
  theory: {
    p: [
      "Функция `first(arr: any[]): any` принимает любой массив, но её результат — `any`, и дальше проверок нет. Дженерик-функция решает это параметром типа: `function first<T>(arr: T[]): T | undefined`. `T` — переменная для типа, вместо неё при вызове подставится конкретный тип.",
      "При вызове параметр типа обычно не пишут, TypeScript выводит его из аргументов. Для `first([\"a\", \"b\"])` он подставит `T = string`, и результат будет `string | undefined`. Указать тип явно тоже можно: `first<number>([1, 2])`.",
      "Параметров типа может быть несколько: `function map<T, R>(arr: T[], fn: (x: T) => R): R[]`. Здесь `T` выводится из массива, а `R` — из того, что возвращает колбэк. Так связываются вход, колбэк и результат.",
      "Если внутри функции нужно свойство, которого нет у произвольного типа, пишут ограничение: `T extends { length: number }`. Тогда в функцию можно передать только значение с полем `length`, и внутри им можно пользоваться. Параметр типа бывает и у объявления типа: `type Box<T> = { value: T }`.",
    ],
    example: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const s = first(["a", "b"]); // string | undefined
const n = first([1, 2]);     // number | undefined

function map<T, R>(arr: T[], fn: (x: T) => R): R[] {
  return arr.map(fn);
}
const lengths = map(["ab", "c"], (w) => w.length); // number[]

function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("ab", "abc");
longest(10, 20); // ошибка: у number нет length

type Box<T> = { value: T };
const box: Box<string> = { value: "hi" };`,
    keys: ["Параметр типа связывает вход и выход функции.", "Тип обычно выводится из аргументов, писать его не нужно.", "`T extends ...` ограничивает, какие типы можно передать."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function wrap<T>(value: T) {
  return { value };
}
const r = wrap(42);`,
      opts: ["{ value: number; }", "{ value: 42; }", "{ value: T; }", "{ value: any; }"],
      a: 0,
      why: "`T` выведен из аргумента как `number`. Литерал `42` превратился в `number`, потому что попал в поле объекта.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}
const r = last([1, "a"]);`,
      opts: ["string | number | undefined", "number | undefined", "string | undefined", "undefined"],
      a: 0,
      why: "Массив `[1, \"a\"]` имеет тип `(string | number)[]`, поэтому `T = string | number`. К нему добавляется `undefined` из типа результата.",
    },
    {
      type: "code",
      kind: "write",
      goal: "`firstOr` возвращает первый элемент массива или значение по умолчанию, если массив пустой. Сейчас всё описано через `any`. Сделай функцию дженериком: результат должен иметь тип элементов, а значение по умолчанию — быть того же типа.",
      code: `function firstOr(arr: any[], fallback: any): any {
  return arr.length ? arr[0] : fallback;
}`,
      tests: `const a = firstOr([1, 2], 0);
type t1 = Expect<Equal<typeof a, number>>;
const b = firstOr(["x"], "нет");
type t2 = Expect<Equal<typeof b, string>>;
// @ts-expect-error: значение по умолчанию должно быть числом
firstOr([1, 2], "ноль");`,
      runtime: [["firstOr([], 5)", "5"], ["firstOr([1], 5)", "1"]],
      forbid: ["any", "as", "ignore"],
      hint: "Один параметр типа `T`: массив `T[]`, значение по умолчанию `T`, результат `T`.",
      solution: `function firstOr<T>(arr: T[], fallback: T): T {
  return arr.length ? arr[0] : fallback;
}`,
    },
  ],
};
