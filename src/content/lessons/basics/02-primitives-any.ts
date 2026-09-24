import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b2",
  region: 0,
  title: "Примитивы, массивы, any",
  q: "Чем опасен `any` и что делает настройка `noImplicitAny`?",
  answer: "`any` отключает проверку типов: со значением можно делать что угодно, и всё, что из него получено, тоже становится `any`. Такие ошибки проявятся только во время работы программы. `noImplicitAny` запрещает случаи, когда TypeScript подставил `any` сам, например у параметра функции без типа.",
  theory: {
    p: [
      "Основные примитивы: `string` для строк, `number` для чисел (целые и дробные — один тип) и `boolean` для `true` и `false`. Реже встречаются `bigint` и `symbol`. Типы `String` и `Number` с большой буквы означают другое, в коде их не пишут.",
      "Массив чисел записывают как `number[]` или `Array<number>`, это одно и то же. Запись `[number]` означает другое: массив ровно из одного числа. Массивы фиксированной длины называются кортежами.",
      "`any` — тип, который выключает проверку. У такого значения можно вызвать любой метод, и его можно записать в переменную любого типа. Всё, что из него получено, тоже становится `any`, и ошибки расходятся дальше по коду.",
      "Если тип параметра не указан и его не из чего вывести, TypeScript подставляет `any` сам. Настройка `noImplicitAny` превращает это в ошибку. Она входит в `strict`.",
    ],
    example: `let obj: any = { x: 0 };
obj.foo();             // без ошибки, но упадёт при запуске
const n: number = obj; // any записывается куда угодно

function len(s) {      // ошибка: неявный any
  return s.length;
}

const list: number[] = [1, 2];
const same: Array<number> = list;
const pair: [number] = [1];  // кортеж из одного числа`,
    keys: ["Типы примитивов пишут с маленькой буквы: `string`, `number`, `boolean`.", "`number[]` и `Array<number>` — одно и то же, `[number]` — кортеж.", "Всё, что получено из `any`, тоже `any`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `first`?",
      probe: "first",
      code: `let data: any = { list: [1, 2, 3] };
const first = data.list[0];`,
      opts: ["number", "any", "string", "number[]"],
      a: 1,
      why: "Про `data` компилятор ничего не знает, поэтому и про `data.list[0]` тоже. Всё, что получено из `any`, тоже `any`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `prices`?",
      probe: "prices",
      code: `const prices = [10, 20.5, 30];`,
      opts: ["number[]", "[number, number, number]", "any[]", "string[]"],
      a: 0,
      why: "Для массива в квадратных скобках TypeScript выводит массив, а не кортеж: в массив потом можно добавить элементы. Целые и дробные числа — один тип `number`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Функция складывает цены и вычитает скидку, но у её параметров нет типов, а у суммы стоит `any`. Укажи типы параметров и убери `any`, чтобы компилятор проверял вызовы.",
      code: `function total(prices, discount) {
  let sum: any = 0;
  for (const p of prices) sum += p;
  return sum - discount;
}

const t: number = total([10, 20], 5);`,
      runtime: [["total([10, 20], 5)", "25"]],
      forbid: ["any", "as", "ignore"],
      hint: "Цены — это массив чисел `number[]`, скидка — `number`. У `sum` тип выведется из начального значения `0`.",
      solution: `function total(prices: number[], discount: number) {
  let sum = 0;
  for (const p of prices) sum += p;
  return sum - discount;
}

const t: number = total([10, 20], 5);`,
    },
  ],
};
