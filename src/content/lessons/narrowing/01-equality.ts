import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "n1",
  region: 1,
  title: "Equality и == null",
  q: "Как `x == null` влияет на тип и чем отличается от `x === null`?",
  answer: "`x === null` убирает из типа только `null`, а `x == null` — и `null`, и `undefined`, потому что при нестрогом сравнении они равны друг другу. Поэтому `x != null` — короткая проверка «значение есть», которая не теряет `0` и пустую строку. Сравнение двух переменных через `===` сужает обе до общего типа.",
  theory: {
    p: [
      "Сравнение с литералом сужает тип. После `if (x === \"a\")` внутри ветки у `x` тип `\"a\"`, а в `else` этот литерал вычитается из union.",
      "`x === null` убирает из типа только `null`. `x == null` истинно и для `null`, и для `undefined`, поэтому TypeScript убирает оба. Значит, `x != null` удобно читать как «значение есть». В отличие от `if (x)`, такая проверка не отбрасывает `0` и пустую строку.",
      "Если сравнить две переменные `a === b`, внутри ветки обе сужаются до общей части их типов. Когда общей части нет, TypeScript сообщает, что сравнение всегда ложно (TS2367): так ловятся опечатки в литералах.",
      "`switch` работает как цепочка `===`: каждый `case` сужает тип, а в `default` попадает остаток.",
    ],
    example: `function show(x: string | number | null | undefined) {
  if (x === null) {
    x;        // null
  } else if (x == null) {
    x;        // undefined
  } else {
    x;        // string | number
  }
}

function same(a: string | number, b: string | boolean) {
  if (a === b) {
    a.toUpperCase(); // a и b — string
  }
}

declare const mode: "on" | "off";
if (mode === "of") {} // ошибка: опечатка, сравнение всегда ложно`,
    keys: ["`=== null` убирает только `null`.", "`== null` убирает и `null`, и `undefined`.", "`a === b` сужает обе стороны до общего типа."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (x != null)`?",
      probe: "r",
      code: `function f(x: string | null | undefined) {
  if (x != null) {
    const r = x;
  }
}`,
      opts: ["string", "string | undefined", "string | null", "string | null | undefined"],
      a: 0,
      why: "`x != null` ложно и для `null`, и для `undefined`, поэтому внутри ветки из типа ушли оба.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (a === b)`?",
      probe: "r",
      code: `function f(a: string | number, b: number | boolean) {
  if (a === b) {
    const r = a;
  }
}`,
      opts: ["string | number", "number", "never", "number | boolean"],
      a: 1,
      why: "Строгое равенство возможно, только если значения одного типа. Общая часть `string | number` и `number | boolean` — `number`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`retries` должна вернуть 3, если число попыток не задано (поля нет или там `null`), и само число иначе, в том числе 0. Исправь проверку.",
      code: `type Config = { retries?: number | null };

function retries(c: Config): number {
  if (c.retries === null) return 3;
  return c.retries;
}`,
      runtime: [["retries({})", "3"], ["retries({ retries: null })", "3"], ["retries({ retries: 0 })", "0"], ["retries({ retries: 5 })", "5"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      must: ["return c.retries;"],
      hint: "Нужна одна проверка, которая ловит и `null`, и `undefined`, но не `0`.",
      solution: `type Config = { retries?: number | null };

function retries(c: Config): number {
  if (c.retries == null) return 3;
  return c.retries;
}`,
    },
  ],
};
