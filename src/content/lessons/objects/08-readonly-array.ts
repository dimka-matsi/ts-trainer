import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob8",
  region: 3,
  title: "ReadonlyArray и readonly-кортежи",
  q: "Как запретить изменять массив, который передали в функцию?",
  answer: "Параметр описывают как `readonly T[]` (то же, что `ReadonlyArray<T>`): у такого массива нет `push`, `splice` и присваивания по индексу. Обычный массив можно передать туда, где ждут readonly, а наоборот нельзя: иначе функция смогла бы изменить то, что обещали не трогать. Кортежи из `as const` тоже readonly, поэтому функции, которые не меняют массив, лучше сразу объявлять с `readonly` — они примут и обычные, и неизменяемые массивы.",
  theory: {
    p: [
      "`readonly string[]` и `ReadonlyArray<string>` — одно и то же. У такого массива есть всё для чтения — `map`, `filter`, `slice`, индексы, — но нет методов изменения: `push`, `pop`, `splice`, `sort`, `reverse`, и нельзя присвоить `arr[0] = …`.",
      "Совместимость в одну сторону. Изменяемый `string[]` подходит туда, где ждут `readonly string[]`, — функция просто обещает его не менять. А `readonly string[]` в `string[]` не присвоить: иначе через новую переменную массив можно было бы изменить.",
      "Отсюда правило: параметр функции, которая не меняет массив, объявляют `readonly T[]`. Тогда в неё можно передать и обычный массив, и `as const`-кортеж, и данные из readonly-пропсов. Функция с `string[]` отвергнет неизменяемые массивы.",
      "Методы вроде `map` и `slice` у readonly-массива возвращают новый обычный массив: копию менять можно. Как и `readonly` у полей, это только проверка при компиляции.",
    ],
    example: `function total(nums: readonly number[]) {
  nums.push(4);                      // ошибка: у readonly-массива нет push
  return nums.reduce((a, b) => a + b, 0);
}

const list = [1, 2, 3];
total(list);                         // можно: обычный массив подходит
const frozen: readonly number[] = list;
const back: number[] = frozen;       // ошибка: readonly нельзя сделать изменяемым`,
    keys: ["`readonly T[]` = `ReadonlyArray<T>`: только чтение, без `push`, `splice` и присваивания по индексу.", "Обычный массив подходит к readonly, обратно — нет.", "Функции, которые не меняют массив, объявляют с `readonly T[]` — так они принимают любые массивы."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `ys`?",
      probe: "ys",
      code: `const xs: readonly number[] = [1];
const ys = xs.map((x) => x * 2);`,
      opts: ["number[]", "readonly number[]", "ReadonlyArray<number>", "readonly [number]"],
      a: 0,
      why: "`map` создаёт новый массив, и он обычный: копию можно менять.",
    },
    {
      type: "quiz",
      q: "Можно ли передать `readonly string[]` в функцию с параметром `string[]`?",
      opts: ["Нет: функция могла бы изменить массив, который обещали не трогать", "Да, всегда", "Да, если массив не пустой", "Только через `as const`"],
      a: 0,
      why: "Обратная передача — `string[]` в `readonly string[]` — разрешена. В эту сторону — нет.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`last` не меняет массив, но не принимает неизменяемый список `NAMES`. Исправь тип параметра.",
      code: `function last(items: string[]) {
  return items[items.length - 1];
}

const NAMES = ["Аня", "Борис"] as const;
last(NAMES);`,
      tests: `last(["a", "b"]);`,
      forbid: ["any", "as", "ignore"],
      must: ["last(NAMES)"],
      hint: "Параметр должен принимать массив только для чтения.",
      solution: `function last(items: readonly string[]) {
  return items[items.length - 1];
}

const NAMES = ["Аня", "Борис"] as const;
last(NAMES);`,
    },
  ],
};
