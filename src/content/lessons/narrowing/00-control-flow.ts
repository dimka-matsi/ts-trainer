import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "na",
  region: 1,
  title: "Присваивания и анализ потока",
  q: "Как TypeScript понимает тип переменной после `return`, `throw` и присваивания?",
  answer: "TypeScript следит за ходом выполнения кода. После `if (...) return` или `throw` он знает, какие варианты уже отсеяны, и сужает тип в оставшемся коде. Присваивание тоже сужает тип до типа нового значения, но записать можно только то, что разрешает объявленный тип. Это называется анализом потока управления, control flow analysis.",
  theory: {
    p: [
      "TypeScript смотрит не только на проверки внутри `if`, но и на то, как код выходит из веток. Если ветка заканчивается `return` или `throw`, после неё этого варианта уже быть не может. Так работает анализ потока управления.",
      "Поэтому вместо вложенных `if` удобно сначала отсечь лишнее и выйти: `if (x === null) return;`. Дальше по коду `x` уже без `null`.",
      "Присваивание тоже сужает тип. У `let v: string | number` после `v = 10` тип `number`, после `v = \"a\"` — снова `string`. Объявленный тип при этом остаётся ограничением: записать `true` нельзя.",
      "Если присвоить значение без объявленного типа, `let v = \"a\"`, TypeScript выведет тип из значения, и потом записать туда число не получится. Чтобы переменная принимала несколько типов, их перечисляют при объявлении.",
    ],
    example: `function show(x: string | number | null) {
  if (x === null) return "пусто";
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(2);     // x: number — остальное ушло через return
}

let v: string | number = "a";
v.toUpperCase();           // v: string
v = 42;
v.toFixed(1);              // v: number
v = true;                  // ошибка: boolean не входит в объявленный тип

let w = "a";
w = 1;                     // ошибка: тип выведен из значения как string`,
    keys: ["После `return` и `throw` отсеянные варианты уходят из типа.", "Присваивание сужает тип до нового значения.", "Записать можно только то, что разрешает объявленный тип."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `r` после двух проверок с выходом из функции?",
      probe: "r",
      code: `function f(x: string | number | null) {
  if (x === null) throw new Error("пусто");
  if (typeof x === "string") return 0;
  const r = x;
}`,
      opts: ["number", "string | number", "number | null", "string | number | null"],
      a: 0,
      why: "`null` отсеян через `throw`, строка — через `return`. До строки с `r` доходит только число.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `let v: string | number = "hi";
v = 10;
const r = v;`,
      opts: ["number", "string | number", "string", "10"],
      a: 0,
      why: "После `v = 10` TypeScript знает, что в `v` число, и сужает тип до `number`. Объявленный тип `string | number` при этом не меняется.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`len` должна вернуть 0, если пришёл `null`, и длину строки или массива в остальных случаях. Сейчас код не компилируется. Добавь в начало проверку с ранним выходом.",
      code: `function len(value: string | string[] | null): number {
  return value.length;
}`,
      runtime: [["len(null)", "0"], ["len(\"abc\")", "3"], ["len([\"a\", \"b\"])", "2"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      must: ["return value.length;"],
      hint: "Первой строкой: `if (value === null) return 0;`.",
      solution: `function len(value: string | string[] | null): number {
  if (value === null) return 0;
  return value.length;
}`,
    },
  ],
};
