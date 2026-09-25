import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob10",
  region: 3,
  title: "Итераторы и генераторы",
  q: "Как типизировать генератор и что такое `Iterable<T>`?",
  answer: "`Iterable<T>` — любой объект, который можно перебрать в `for…of`: массив, строка, `Set`, `Map`, генератор. Если функции нужно просто пройти по значениям, параметр делают `Iterable<T>`, и она примет любую коллекцию. Генератор — функция со звёздочкой, которая отдаёт значения через `yield`; TypeScript выводит её результат как `Generator<T, TReturn, TNext>`: тип отдаваемых значений, тип `return` и тип значения, которое можно передать в `next()`.",
  theory: {
    p: [
      "Перебираемый объект — тот, у кого есть метод `[Symbol.iterator]()`, возвращающий итератор. Итератор отдаёт значения по одному через `next()`: `{ value, done }`. Так устроены массивы, строки, `Set`, `Map`, и именно это использует `for…of`.",
      "`Iterable<T>` — тип «что угодно, что можно перебрать и получить `T`». Функция `sum(values: Iterable<number>)` примет массив, `Set` и генератор. С параметром `number[]` она приняла бы только массив.",
      "Генератор: `function* range(from, to) { for (…) yield i; }`. Вызов не выполняет тело, а возвращает объект-генератор, который отдаёт значения лениво, по одному. TypeScript выводит тип `Generator<number, void, unknown>`: отдаёт числа, в конце ничего не возвращает, а значение в `next()` не используется.",
      "Явно тип пишут, когда генератор принимает значения через `next(x)` или возвращает итог: `Generator<number, string, boolean>`. В строгом режиме флаг `strictBuiltinIteratorReturn` делает результат `return` у встроенных итераторов `undefined`, а не `any`, — ещё одна причина держать `strict` включённым.",
    ],
    example: `function* range(from: number, to: number) {
  for (let i = from; i < to; i++) yield i;
}

function sum(values: Iterable<number>) {
  let s = 0;
  for (const v of values) s += v;
  return s;
}

sum([1, 2, 3]);
sum(new Set([4, 5]));
sum(range(0, 5));
sum(["1", "2"]);                   // ошибка: нужны числа, а не строки`,
    keys: ["`Iterable<T>` — всё, что перебирается `for…of`: массивы, строки, `Set`, `Map`, генераторы.", "Параметр `Iterable<T>` вместо `T[]` делает функцию универсальнее.", "Генератор `function*` отдаёт значения лениво, его тип — `Generator<T, TReturn, TNext>`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `it`?",
      probe: "it",
      code: `function* range(from: number, to: number) {
  for (let i = from; i < to; i++) yield i;
}
const it = range(0, 3);`,
      opts: ["Generator<number, void, unknown>", "number[]", "Iterable<number>", "IterableIterator<number>"],
      a: 0,
      why: "Функция со звёздочкой возвращает генератор: отдаёт числа, ничего не возвращает в конце, а значения из `next()` не использует.",
    },
    {
      type: "quiz",
      q: "Зачем параметру тип `Iterable<number>`, если можно `number[]`?",
      opts: ["Функция примет любую перебираемую коллекцию: массив, `Set`, генератор", "`Iterable` работает быстрее", "`number[]` нельзя перебрать в `for…of`", "Это одно и то же"],
      a: 0,
      why: "Функции, которой нужен только перебор, неважно, какая это коллекция.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`first` должна принимать любую коллекцию чисел — массив, `Set` или генератор, — а сейчас принимает только массив. Поменяй тип параметра и реализацию.",
      code: `function first(values: number[]) {
  return values[0];
}`,
      tests: `first([5, 6]);
first(new Set([7, 8]));`,
      runtime: [["first(new Set([7, 8]))", "7"], ["first([5, 6])", "5"]],
      forbid: ["any", "as", "ignore"],
      hint: "Параметр — `Iterable<number>`, а первое значение возьми в `for…of` и сразу верни.",
      solution: `function first(values: Iterable<number>) {
  for (const v of values) return v;
  return undefined;
}`,
    },
  ],
};
