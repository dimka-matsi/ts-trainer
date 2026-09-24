import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g4",
  region: 4,
  title: "Параметры по умолчанию и несколько параметров",
  q: "Зачем параметру типа значение по умолчанию?",
  answer: "Чтобы не указывать тип, который почти всегда одинаковый: в `Result<T, E = Error>` второй параметр можно опустить. Если параметр не указан явно и его не из чего вывести, берётся значение по умолчанию. При вызове функции параметры типа либо выводятся все, либо указываются все обязательные: указать только часть нельзя.",
  theory: {
    p: [
      "У параметра типа может быть значение по умолчанию: `type Result<T, E = Error>`. Тогда `Result<number>` означает `Result<number, Error>`. Параметры со значением по умолчанию пишут после обязательных.",
      "Значение по умолчанию может ссылаться на предыдущий параметр: `type List<T, Items = T[]>`. Для `List<number>` получится `Items = number[]`.",
      "Если у функции несколько параметров типа, TypeScript выводит каждый из своего аргумента: `pair(\"x\", 1)` даёт `[string, number]`. Указать явно только первый нельзя: `pair<string>(\"x\", 1)` даст ошибку, если у второго параметра нет значения по умолчанию.",
      "Когда значение по умолчанию есть, явный вызов `make<number>(1)` работает: остальные параметры берут значения по умолчанию, а не выводятся из аргументов.",
    ],
    example: `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
const r1: Result<number> = { ok: false, error: new Error("нет сети") };
const r2: Result<number, string> = { ok: false, error: "нет сети" };

function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("x", 1);         // [string, number]
const q = pair<string>("x", 1); // ошибка: нужно указать оба параметра или ни одного

type List<T, Items = T[]> = { items: Items };
const l: List<number> = { items: [1, 2] };`,
    keys: ["`<T, E = Error>` — второй параметр можно опустить.", "Параметры со значением по умолчанию идут после обязательных.", "При вызове параметры выводятся все или указываются все обязательные."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `p`?",
      probe: "p",
      code: `function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair(true, "x");`,
      opts: ["[boolean, string]", "(string | boolean)[]", "[true, \"x\"]", "[A, B]"],
      a: 0,
      why: "Каждый параметр выведен из своего аргумента: `A = boolean`, `B = string`. Литералы превратились в общие типы, потому что ограничений на литералы нет.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `m`?",
      probe: "m",
      code: `function make<T, U = string>(x: T): U {
  return String(x) as U;
}
const m = make<number>(1);`,
      opts: ["string", "number", "unknown", "U"],
      a: 0,
      why: "`T` указан явно, а `U` не указан. Раз параметры заданы явно, вывод не работает, и `U` берёт значение по умолчанию `string`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши `ApiResponse` дженериком с двумя параметрами: тип данных `T` и тип ошибки `E`, по умолчанию `string`. При успехе объект `{ ok: true; data: T }`, при ошибке `{ ok: false; error: E }`.",
      code: `type ApiResponse = { ok: boolean; data?: unknown; error?: unknown };`,
      tests: `const a: ApiResponse<number> = { ok: true, data: 1 };
const b: ApiResponse<number> = { ok: false, error: "нет сети" };
const c: ApiResponse<number, Error> = { ok: false, error: new Error("x") };
// @ts-expect-error: по умолчанию ошибка — строка
const d: ApiResponse<number> = { ok: false, error: 404 };
// @ts-expect-error: при успехе нужны данные
const e: ApiResponse<number> = { ok: true };`,
      forbid: ["any", "as", "ignore"],
      hint: "`type ApiResponse<T, E = string> = { ok: true; data: T } | { ok: false; error: E }`.",
      solution: `type ApiResponse<T, E = string> = { ok: true; data: T } | { ok: false; error: E };`,
    },
  ],
};
