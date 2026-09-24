import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f3",
  region: 2,
  title: "Перегрузки",
  q: "Когда лучше взять union в параметре, а когда перегрузки?",
  answer: "Если тип результата не зависит от типа аргумента, хватает union в параметре. Перегрузки нужны, когда разные входы дают разные выходы и это важно вызывающему. Сигнатура реализации снаружи не видна, а перегрузки проверяются сверху вниз, поэтому узкие пишут первыми.",
  theory: {
    p: [
      "Перегрузки — несколько сигнатур над одной реализацией. Вызывающий видит только сигнатуры перегрузок, а сигнатура реализации скрыта.",
      "Реализация должна быть совместима со всеми перегрузками. Параметры в ней описаны широко, и внутри тип сужают вручную.",
      "TypeScript выбирает первую подходящую перегрузку сверху вниз, поэтому узкие сигнатуры ставят раньше общих. Аргумент-union не подойдёт ни к одной перегрузке, если каждая принимает только один член union.",
      "Если результат не зависит от входа, достаточно union. Если зависит, иногда проще дженерик. Перегрузки хороши для двух-трёх явно разных вариантов вызова.",
    ],
    example: `function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) {
  return typeof x === "string" ? Number(x) : String(x);
}

const n = parse("42"); // number
const s = parse(42);   // string

declare const v: string | number;
parse(v); // ошибка: ни одна перегрузка не принимает union

// Результат не зависит от входа — хватит union
function len(x: string | unknown[]) {
  return x.length;
}`,
    keys: ["Снаружи видны только перегрузки, не реализация.", "Проверка идёт сверху вниз: узкие первыми.", "Union-аргумент не пройдёт через перегрузки для отдельных типов."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function wrap(x: string): string[];
function wrap(x: number): number[];
function wrap(x: string | number) {
  return [x];
}
const r = wrap(1);`,
      opts: ["number[]", "(string | number)[]", "string[]", "unknown[]"],
      a: 0,
      why: "Вызывающий видит только перегрузки. Для числа подходит вторая, она возвращает `number[]`.",
    },
    {
      type: "quiz",
      q: "Перегрузки `wrap(x: string)` и `wrap(x: number)`. Почему `wrap(v)` с `v: string | number` не компилируется?",
      opts: [
        "Ни одна перегрузка не принимает union целиком",
        "Сигнатура реализации не совпадает с перегрузками",
        "Перегрузки запрещены с union",
        "Нужно явно указать дженерик",
      ],
      a: 0,
      why: "TypeScript проверяет перегрузки по одной. `string | number` не присваивается ни в `string`, ни в `number`, а сигнатура реализации снаружи не видна.",
      example: `function wrap(x: string): string[];
function wrap(x: number): number[];
function wrap(x: string | number) {
  return [x];
}
declare const v: string | number;
wrap(v); // ошибка: ни одна перегрузка не принимает string | number`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`normalize` не компилируется: перегрузки `toArray` не принимают union. Результат всегда `string[]`, так что перегрузки тут не нужны. Упрости `toArray`.",
      code: `function toArray(x: string): string[];
function toArray(x: string[]): string[];
function toArray(x: string | string[]) {
  return Array.isArray(x) ? x : [x];
}

function normalize(input: string | string[]) {
  return toArray(input);
}`,
      tests: `type t1 = Expect<Equal<ReturnType<typeof normalize>, string[]>>;`,
      runtime: [["normalize(\"a\")", "[\"a\"]"], ["normalize([\"a\", \"b\"])", "[\"a\",\"b\"]"]],
      forbid: ["any", "as", "ignore"],
      must: ["function normalize(input: string | string[])", "return toArray(input);"],
      hint: "Оставь одну сигнатуру: `function toArray(x: string | string[]): string[]`.",
      solution: `function toArray(x: string | string[]): string[] {
  return Array.isArray(x) ? x : [x];
}

function normalize(input: string | string[]) {
  return toArray(input);
}`,
    },
  ],
};
