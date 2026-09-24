import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g3",
  region: 4,
  title: "typeof в позиции типа",
  q: "Как получить тип из существующего значения?",
  answer: "Оператором `typeof` в позиции типа: `type Config = typeof config` берёт тип, который TypeScript вывел для переменной. Так тип не описывают дважды, и он обновляется вместе со значением. Вместе с `as const` и `[number]` из массива-константы получают union его значений.",
  theory: {
    p: [
      "В JavaScript `typeof` проверяет значение во время работы программы и возвращает строку вроде `\"number\"`. В позиции типа тот же оператор делает другое: `type Config = typeof config` берёт тип, который TypeScript вывел для переменной `config`.",
      "Так объект становится единственным источником правды. Если добавить поле в объект, тип обновится сам, и не придётся править два места.",
      "С массивом-константой `typeof` сочетают с `as const` и `[number]`: `(typeof ROLES)[number]` даёт union всех значений массива. Скобки вокруг `typeof ROLES` нужны, чтобы `[number]` относился к типу.",
      "Для функции `typeof fn` даёт её тип целиком, с параметрами и результатом. Для поля объекта можно написать `typeof config.port`.",
    ],
    example: `const config = { port: 8080, host: "localhost", debug: false };
type Config = typeof config;       // { port: number; host: string; debug: boolean }
type Port = typeof config.port;    // number

const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "editor" | "viewer"

const ok: Role = "editor";
const bad: Role = "owner";          // ошибка: такой роли нет в массиве

function greet(name: string) {
  return "Привет, " + name;
}
type Greet = typeof greet;          // (name: string) => string`,
    keys: ["`typeof x` в позиции типа — тип переменной `x`.", "Тип выводится из значения и обновляется вместе с ним.", "`(typeof ARR)[number]` — union значений массива `as const`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `Role`?",
      probe: "Role",
      code: `const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number];`,
      opts: ["\"admin\" | \"editor\" | \"viewer\"", "string", "readonly [\"admin\", \"editor\", \"viewer\"]", "string[]"],
      a: 0,
      why: "`as const` сохранил точные значения в кортеже, а `[number]` берёт тип элемента на любой позиции. Получается union трёх строк.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `Config`?",
      probe: "Config",
      code: `const config = { port: 8080, host: "localhost" };
type Config = typeof config;`,
      opts: ["{ port: number; host: string; }", "{ port: 8080; host: \"localhost\"; }", "object", "{ readonly port: 8080; readonly host: \"localhost\"; }"],
      a: 0,
      why: "`typeof` берёт тот тип, который TypeScript вывел для переменной. Поля объекта без `as const` получают общие типы `number` и `string`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Тип `Settings` описан вручную и уже разошёлся с объектом `defaults`: в нём нет поля `showTips`. Получи `Settings` из `defaults`, чтобы тип обновлялся сам.",
      code: `const defaults = { theme: "light", fontSize: 14, showTips: true };

type Settings = { theme: string; fontSize: number };`,
      tests: `type t1 = Expect<Equal<Settings, { theme: string; fontSize: number; showTips: boolean }>>;`,
      forbid: ["any", "ignore"],
      must: ["typeof defaults"],
      hint: "`type Settings = typeof defaults`.",
      solution: `const defaults = { theme: "light", fontSize: 14, showTips: true };

type Settings = typeof defaults;`,
    },
  ],
};
