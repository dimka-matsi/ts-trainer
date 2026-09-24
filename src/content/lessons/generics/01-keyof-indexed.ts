import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g1",
  region: 4,
  title: "keyof и тип поля T[K]",
  q: "Что делают `keyof` и запись `T[\"name\"]` в типах?",
  answer: "`keyof T` даёт union имён свойств типа: для `{ id: number; name: string }` это `\"id\" | \"name\"`. Запись `T[\"name\"]` берёт тип одного поля, а если в скобках union имён, получается union типов этих полей. `T[number]` даёт тип элемента массива или кортежа.",
  theory: {
    p: [
      "`keyof` применяют к типу, и он возвращает union имён его свойств. Для `type User = { id: number; name: string }` запись `keyof User` означает `\"id\" | \"name\"`. В переменную такого типа можно записать только существующее имя поля.",
      "Тип отдельного поля берут в квадратных скобках: `User[\"name\"]` — это `string`. Такая запись называется индексным доступом. Имя пишут в кавычках, потому что это литеральный тип, а не строка в коде. Если в скобках union имён, получится union типов: `User[\"id\" | \"name\"]` — это `number | string`.",
      "Для массивов и кортежей есть `T[number]`: тип элемента. Для `string[]` это `string`, а для кортежа `[string, number]` — `string | number`.",
      "Если попросить поле, которого нет, TypeScript выдаст ошибку. `User[\"email\"]` не скомпилируется, поэтому опечатки в именах полей ловятся уже на уровне типов.",
    ],
    example: `type User = { id: number; name: string; active: boolean };

type Keys = keyof User;               // "id" | "name" | "active"
type Name = User["name"];             // string
type IdOrName = User["id" | "name"];  // number | string

const key: Keys = "name";
const wrong: Keys = "email";          // ошибка: такого поля нет

type Tags = string[];
type Tag = Tags[number];              // string
type Email = User["email"];           // ошибка: такого поля нет`,
    keys: ["`keyof T` — union имён полей.", "`T[\"k\"]` — тип поля, с union имён получается union типов.", "`T[number]` — тип элемента массива или кортежа."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `Cell`?",
      probe: "Cell",
      code: `type Row = [string, number, boolean];
type Cell = Row[number];`,
      opts: ["string | number | boolean", "[string, number, boolean]", "string", "number"],
      a: 0,
      why: "`Row[number]` — тип элемента кортежа на любой позиции. Позиций три, поэтому получается union трёх типов.",
    },
    {
      type: "quiz",
      q: "Есть `type User = { id: number; name: string }`. Какую строку можно записать в переменную типа `keyof User`?",
      opts: ["`\"id\"` или `\"name\"`", "Любую строку", "Только `\"id\"`", "`number` или `string`"],
      a: 0,
      why: "`keyof User` — union имён полей, то есть `\"id\" | \"name\"`. Другие строки не подойдут.",
      example: `type User = { id: number; name: string };
const a: keyof User = "name";
const b: keyof User = "email"; // ошибка: такого поля нет`,
    },
    {
      type: "code",
      kind: "write",
      goal: "`Field` и `ThemeValue` описаны вручную как `string`. Получи их из `Settings`: `Field` — union имён полей, `ThemeValue` — тип поля `theme`. Тогда при изменении `Settings` они обновятся сами.",
      code: `type Settings = { theme: "light" | "dark"; fontSize: number; lang: string };

type Field = string;
type ThemeValue = string;`,
      tests: `type t1 = Expect<Equal<Field, "theme" | "fontSize" | "lang">>;
type t2 = Expect<Equal<ThemeValue, "light" | "dark">>;`,
      forbid: ["any", "ignore"],
      must: ["keyof Settings", "Settings[\"theme\"]"],
      hint: "`type Field = keyof Settings`, а тип поля — `Settings[\"theme\"]`.",
      solution: `type Settings = { theme: "light" | "dark"; fontSize: number; lang: string };

type Field = keyof Settings;
type ThemeValue = Settings["theme"];`,
    },
  ],
};
