import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u3",
  region: 5,
  title: "Pick и Omit",
  q: "Как устроены `Pick` и `Omit` и почему `Omit` не проверяет ключи?",
  answer: "`Pick` оставляет указанные ключи, `Omit` убирает. У `Omit` ключи ограничены `keyof any`, поэтому опечатку он не ловит, а на union схлопывает варианты до общих ключей. Для union пишут дистрибутивную версию через conditional type.",
  theory: {
    p: [
      "`Pick<T, K>` оставляет только ключи `K`, `Omit<T, K>` — все, кроме `K`. Это главный способ получать производные типы: превью сущности, данные формы без `id`.",
      "У `Pick` ограничение `K extends keyof T`, поэтому опечатка в ключе — ошибка. У `Omit` ограничение `K extends keyof any`, и `Omit<Todo, \"titel\">` молча вернёт всё. Строгую версию пишут сами.",
      "`Omit` не дистрибутивен: на union `A | B` он оставляет только общие ключи и теряет варианты. Для union используют `T extends unknown ? Omit<T, K> : never`.",
      "Внутри: `Pick<T, K> = { [P in K]: T[P] }` и `Omit<T, K> = Pick<T, Exclude<keyof T, K>>`.",
    ],
    example: `interface Todo { id: number; title: string; done: boolean }

type Preview = Pick<Todo, "title" | "done">;
type NewTodo = Omit<Todo, "id">;

type Oops = Omit<Todo, "titel">;     // без ошибки: опечатка не поймана
type StrictOmit<T, K extends keyof T> = Omit<T, K>;
type Caught = StrictOmit<Todo, "titel">; // ошибка`,
    keys: ["`Pick` ловит опечатки, `Omit` — нет.", "`Omit` ломает discriminated union.", "`Omit` = `Pick` + `Exclude`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `T`?",
      probe: "T",
      code: `interface Todo { id: number; title: string; done: boolean }
type T = Omit<Todo, "id" | "done">;`,
      opts: ["{ title: string; }", "{ id: number; done: boolean; }", "Todo", "{ title?: string; }"],
      a: 0,
      why: "`Omit` оставляет все ключи, кроме перечисленных.",
    },
    {
      type: "predict",
      q: "Какой тип у `R`?",
      probe: "R",
      code: `type A = { kind: "a"; id: number; a: string };
type B = { kind: "b"; id: number; b: boolean };
type R = Omit<A | B, "id">;`,
      opts: ["{ kind: \"a\"; a: string; } | { kind: \"b\"; b: boolean; }", "{ kind: \"a\" | \"b\"; }", "{ kind: \"a\" | \"b\"; a: string; b: boolean; }", "never"],
      a: 1,
      why: "`keyof (A | B)` — только общие ключи `kind` и `id`. После удаления `id` остаётся один `kind`, а поля `a` и `b` теряются.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyPick<T, K>` и `MyOmit<T, K>` без встроенных `Pick`, `Omit` и `Exclude`. `MyPick` должен ругаться на несуществующий ключ.",
      code: `type MyPick<T, K> = unknown;
type MyOmit<T, K> = unknown;`,
      tests: `interface Todo { id: number; title: string; done: boolean }
type t1 = Expect<Equal<MyPick<Todo, "title">, { title: string }>>;
type t2 = Expect<Equal<MyOmit<Todo, "id" | "done">, { title: string }>>;
// @ts-expect-error ключа нет в Todo
type t3 = MyPick<Todo, "nope">;`,
      forbid: ["any", "ignore", {"re": "\\bPick\\b", "msg": "Без встроенного Pick"}, {"re": "\\bOmit\\b", "msg": "Без встроенного Omit"}, {"re": "\\bExclude\\b", "msg": "Без встроенного Exclude"}],
      hint: "Для `MyOmit` пригодится key remapping: `[P in keyof T as P extends K ? never : P]`.",
      solution: `type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `DistributiveOmit<T, K>`, который применяет `Omit` к каждому члену union отдельно.",
      code: `type DistributiveOmit<T, K extends keyof any> = Omit<T, K>;`,
      tests: `type A = { kind: "a"; id: number; a: string };
type B = { kind: "b"; id: number; b: boolean };
type t1 = Expect<Equal<DistributiveOmit<A | B, "id">, { kind: "a"; a: string } | { kind: "b"; b: boolean }>>;`,
      forbid: ["any", "ignore"],
      hint: "Conditional type с голым параметром распределяется по union: `T extends unknown ? ... : never`.",
      solution: `type DistributiveOmit<T, K extends keyof any> =
  T extends unknown ? Omit<T, K> : never;`,
    },
  ],
};
