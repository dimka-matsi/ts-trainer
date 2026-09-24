import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u4",
  region: 5,
  title: "Exclude, Extract, NonNullable",
  q: "Чем `Exclude` отличается от `Omit`?",
  answer: "`Exclude` и `Extract` фильтруют члены union, а `Omit` работает с ключами объекта. Они реализованы как дистрибутивные conditional types: `T extends U ? never : T`. `NonNullable` убирает `null` и `undefined`.",
  theory: {
    p: [
      "`Exclude<U, E>` убирает из union члены, которые присваиваются `E`; `Extract<T, U>` оставляет только их. Они работают с union, а не с ключами объекта — частая путаница с `Omit`.",
      "Оба — дистрибутивные conditional types: `Exclude<T, U> = T extends U ? never : T`. Условие применяется к каждому члену union по отдельности, а `never` из результата исчезает.",
      "`NonNullable<T>` убирает `null` и `undefined`. Сейчас он определён как `T & {}`: пересечение с «любым не-nullish значением».",
    ],
    example: `type T0 = Exclude<"a" | "b" | "c", "a">;             // "b" | "c"
type T1 = Extract<string | number | (() => void), Function>;

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; x: number };
type Circle = Extract<Shape, { kind: "circle" }>;

type T2 = NonNullable<string[] | null | undefined>;  // string[]`,
    keys: ["`Exclude`/`Extract` — про union, `Omit` — про ключи.", "Работают дистрибутивно по каждому члену.", "`NonNullable<T> = T & {}`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `T`?",
      probe: "T",
      code: `type Ev = "click" | "focus" | "blur" | "keydown";
type T = Exclude<Ev, "focus" | "blur">;`,
      opts: ["\"focus\" | \"blur\"", "\"click\" | \"keydown\"", "Ev", "never"],
      a: 1,
      why: "Каждый член `Ev` проверяется отдельно: `focus` и `blur` превращаются в `never` и исчезают.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `S`?",
      probe: "S",
      code: `type Shape = { kind: "circle"; r: number } | { kind: "square"; x: number };
type S = Extract<Shape, { kind: "square" }>;`,
      opts: ["{ kind: \"square\"; }", "{ kind: \"square\"; x: number; }", "never", "Shape"],
      a: 1,
      why: "`Extract` оставляет члены union, которые присваиваются `{ kind: \"square\" }`. Квадрат подходит целиком, со всеми своими полями.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyExclude`, `MyExtract` и `MyNonNullable` без встроенных утилит.",
      code: `type MyExclude<T, U> = unknown;
type MyExtract<T, U> = unknown;
type MyNonNullable<T> = unknown;`,
      tests: `type t1 = Expect<Equal<MyExclude<"a" | "b" | "c", "a">, "b" | "c">>;
type t2 = Expect<Equal<MyExtract<string | number | boolean, number | boolean>, number | boolean>>;
type t3 = Expect<Equal<MyNonNullable<string | null | undefined>, string>>;`,
      forbid: ["any", "ignore", {"re": "\\bExclude\\b", "msg": "Без встроенного Exclude"}, {"re": "\\bExtract\\b", "msg": "Без встроенного Extract"}, {"re": "\\bNonNullable\\b", "msg": "Без встроенного NonNullable"}],
      hint: "`T extends U ? never : T` — и компилятор сам разложит union.",
      solution: `type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T & {};`,
    },
  ],
};
