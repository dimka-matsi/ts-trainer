import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b9",
  region: 0,
  title: "null и strictNullChecks",
  q: "Что даёт `strictNullChecks` и чем `?.` отличается от `!`?",
  answer: "С `strictNullChecks` `null` и `undefined` — отдельные типы, и перед использованием значение нужно сузить. `?.` безопасно прерывает цепочку и возвращает `undefined`, а `!` ничего не проверяет и просто убирает `null` из типа. Для значений по умолчанию лучше `??`, чем `||`.",
  theory: {
    p: [
      "Без `strictNullChecks` значения `null` и `undefined` можно присвоить куда угодно и обращаться к ним без проверок. Это главный источник падений, поэтому флаг входит в `strict`.",
      "С флагом `null` и `undefined` становятся отдельными типами. Перед использованием значение нужно сузить: `if (x !== null)`, `if (x)`, `x ?? default`, `x?.prop`.",
      "`x == null` ловит сразу и `null`, и `undefined`. `??` подставляет значение только для них, в отличие от `||`, который срабатывает и на `0`, и на `\"\"`.",
      "`?.` безопасно прерывает цепочку и возвращает `undefined`. `!` ничего не проверяет, а просто убирает `null` из типа.",
    ],
    example: `function greet(name: string | null) {
  console.log(name.toUpperCase());   // ошибка: possibly null
  if (name !== null) {
    console.log(name.toUpperCase()); // name: string
  }
}

function withDefault(count: number | null) {
  const a = count || 10;   // 0 превратится в 10 — баг
  const b = count ?? 10;   // 0 останется 0
  return [a, b];
}`,
    keys: ["`null` и `undefined` — отдельные типы при `strict`.", "`??` вместо `||` для значений по умолчанию.", "`?.` проверяет, `!` — нет."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `r`?",
      probe: "r",
      code: `function f(x: string | null | undefined) {
  if (x == null) return;
  return x;
}
const r = f("a");`,
      opts: ["string", "string | undefined", "string | null | undefined", "void | string"],
      a: 1,
      why: "`x == null` убирает и `null`, и `undefined`, поэтому второй `return` даёт `string`. Пустой `return` добавляет `undefined`.",
    },
    {
      type: "predict",
      q: "Какой тип у `len`?",
      probe: "len",
      code: `declare const input: string | null;
const len = input?.length;`,
      opts: ["number", "number | null", "number | undefined", "number | null | undefined"],
      a: 2,
      why: "`?.` возвращает `undefined`, когда слева `null` или `undefined`. Поэтому к `number` добавляется именно `undefined`, а не `null`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`null` в массиве означает «цена неизвестна». Считай такие цены как 0, но не теряй настоящие нули. Без `!` и `as`.",
      code: `function total(prices: (number | null)[]): number {
  let sum = 0;
  for (const p of prices) {
    sum += p;
  }
  return sum;
}`,
      runtime: [["total([1, null, 2])", "3"], ["total([0, null])", "0"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "Оператор `??` подставит 0 только вместо `null`.",
      solution: `function total(prices: (number | null)[]): number {
  let sum = 0;
  for (const p of prices) {
    sum += p ?? 0;
  }
  return sum;
}`,
    },
  ],
};
