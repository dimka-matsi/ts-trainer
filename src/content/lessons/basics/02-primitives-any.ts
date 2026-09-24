import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b2",
  region: 0,
  title: "Примитивы, массивы, any",
  q: "Чем опасен `any` и что делает `noImplicitAny`?",
  answer: "`any` отключает проверку типов для значения и всего, что из него получено, поэтому ошибки уходят в рантайм. `noImplicitAny` запрещает неявный `any`, например у параметров без аннотации. Для неизвестных данных вместо `any` используют `unknown`.",
  theory: {
    p: [
      "Три основных примитива: `string`, `number` (отдельных целых и дробных нет) и `boolean`. Реже встречаются `bigint` и `symbol`. `String` или `Number` с большой буквы — это типы объектов-обёрток, в аннотациях их не используют.",
      "Массив записывается как `number[]` или `Array<number>` — это одно и то же. `[number]` — уже кортеж из одного элемента, другой тип.",
      "`any` выключает проверку: у такого значения можно вызвать что угодно, и оно присваивается куда угодно. Хуже того, `any` расползается: всё, что из него получено, тоже `any`.",
      "Если TS не может вывести тип параметра, он подставляет `any`. Флаг `noImplicitAny` (входит в `strict`) превращает это в ошибку.",
    ],
    example: `let obj: any = { x: 0 };
obj.foo();             // без ошибки, но упадёт в рантайме
const n: number = obj; // any присваивается куда угодно

function len(s) {      // ошибка: неявный any
  return s.length;
}

const list: number[] = [1, 2];
const same: Array<number> = list;
const pair: [number] = [1];  // кортеж, не массив`,
    keys: ["Используй `string`, `number`, `boolean` с маленькой буквы.", "`T[]` и `Array<T>` — одно и то же, `[T]` — кортеж.", "`any` отключает проверку и заражает всё вокруг."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `first`?",
      probe: "first",
      code: `let data: any = { list: [1, 2, 3] };
const first = data.list[0];`,
      opts: ["number", "any", "unknown", "number | undefined"],
      a: 1,
      why: "Всё, что достаётся из `any`, тоже `any`: компилятор уже ничего не знает о структуре. Так `any` расползается по коду.",
    },
    {
      type: "predict",
      q: "Какой тип у `items`?",
      probe: "items",
      code: `const items = [1, "two", 3];`,
      opts: ["[number, string, number]", "(string | number)[]", "any[]", "number[] | string[]"],
      a: 1,
      why: "Для литерала массива TS выводит массив из union типов элементов, а не кортеж. Кортеж получится с `as const` или явной аннотацией.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Убери явный и неявные `any`: дай типы параметрам, чтобы функция складывала цены и вычитала скидку.",
      code: `function total(prices, discount) {
  let sum: any = 0;
  for (const p of prices) sum += p;
  return sum - discount;
}

const t: number = total([10, 20], 5);`,
      runtime: [["total([10, 20], 5)", "25"]],
      forbid: ["any", "as", "ignore"],
      hint: "Параметрам нужны типы `number[]` и `number`, а `sum` получит тип из инициализатора.",
      solution: `function total(prices: number[], discount: number) {
  let sum = 0;
  for (const p of prices) sum += p;
  return sum - discount;
}

const t: number = total([10, 20], 5);`,
    },
  ],
};
