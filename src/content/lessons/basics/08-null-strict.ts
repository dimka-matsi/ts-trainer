import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b9",
  region: 0,
  title: "null и strictNullChecks",
  q: "Что меняет настройка `strictNullChecks` и чем `?.` отличается от `!`?",
  answer: "С `strictNullChecks` значения `null` и `undefined` нельзя использовать где попало: если переменная может быть `null`, это видно в её типе, и перед использованием её надо проверить. `?.` проверяет значение и, если его нет, возвращает `undefined`. `!` ничего не проверяет, а только убирает `null` из типа. Для значения по умолчанию лучше `??`, чем `||`.",
  theory: {
    p: [
      "Без `strictNullChecks` значения `null` и `undefined` можно записать в переменную любого типа, и компилятор не заставит их проверять. Из-за этого программы часто падают с ошибкой «Cannot read properties of null». Поэтому настройка входит в `strict`.",
      "С настройкой `null` и `undefined` становятся отдельными типами. Если значение может отсутствовать, это пишут в типе: `string | null`. Перед использованием такое значение проверяют: `if (x !== null)`, `x ?? \"по умолчанию\"`, `x?.length`.",
      "Проверка `x == null` с двумя знаками равенства срабатывает и для `null`, и для `undefined`. Оператор `??` подставляет значение по умолчанию только для них. `||` срабатывает ещё и на `0` и пустую строку, и настоящий ноль потеряется.",
      "`x?.length` читает свойство, только если `x` не `null` и не `undefined`, иначе возвращает `undefined`. Запись `x!` ничего не проверяет: она только говорит компилятору, что `null` здесь нет. Если он всё-таки есть, программа упадёт.",
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
    keys: ["С `strictNullChecks` `null` и `undefined` видны в типе.", "Для значения по умолчанию — `??`, а не `||`.", "`?.` проверяет значение, `!` не проверяет ничего."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function f(x: string | null | undefined) {
  if (x == null) return;
  return x;
}
const r = f("a");`,
      opts: ["string", "string | undefined", "string | null | undefined", "void | string"],
      a: 1,
      why: "После `x == null` в `x` не осталось ни `null`, ни `undefined`, поэтому второй `return` возвращает `string`. Пустой `return` возвращает `undefined`, и он тоже попадает в тип результата.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `len`?",
      probe: "len",
      code: `declare const input: string | null;
const len = input?.length;`,
      opts: ["number", "number | null", "number | undefined", "number | null | undefined"],
      a: 2,
      why: "Если `input` равен `null`, `?.` вернёт `undefined`, а не `null`. Поэтому к `number` добавляется `undefined`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`null` в массиве означает «цена неизвестна». Посчитай сумму, считая неизвестные цены нулём. Настоящие нули должны остаться нулями. Без `!` и `as`.",
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
