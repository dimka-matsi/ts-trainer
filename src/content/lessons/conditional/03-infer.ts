import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc3",
  region: 6,
  title: "infer",
  q: "Как работает `infer`? Как устроен `ReturnType` и как написать `ElementType<T>`?",
  answer: "`infer U` внутри условия объявляет переменную типа, которую TypeScript сам находит при сопоставлении: `T extends (infer U)[] ? U : T` вытаскивает тип элемента массива. `ReturnType` устроен так же: `T extends (...args: any) => infer R ? R : any`. С TypeScript 4.7 у `infer` может быть ограничение: `infer H extends string`. Если одна и та же переменная выводится в нескольких местах, в позициях результата получится union, а в позициях параметров — пересечение; на этом построен известный `UnionToIntersection`.",
  theory: {
    p: [
      "`infer` работает только в ветке `extends` conditional type. `T extends Promise<infer V> ? V : T` читается так: «если `T` — промис чего-то, назови это что-то `V` и верни». TypeScript сопоставляет форму и подставляет найденное.",
      "Так вытаскивают любую часть типа: тип элемента массива `(infer U)[]`, тип результата функции `(...args: never[]) => infer R`, аргументы `(...args: infer A) => unknown`, первый элемент кортежа `[infer H, ...unknown[]]`, значение промиса `Promise<infer V>`.",
      "Ограничение у `infer` (TypeScript 4.7): `[infer H extends string, ...unknown[]]` — H выводится, только если он строка, иначе ветка «нет». Это избавляет от вложенного условия.",
      "Несколько мест вывода. Если `U` встречается в двух позициях результата, TypeScript объединит кандидатов в union. Если в позициях параметров функции — в пересечение, потому что параметры противоположны по вариантности. На этом трюке `UnionToIntersection`: union превращают в union функций и выводят общий параметр.",
    ],
    example: `type ElementType<T> = T extends (infer U)[] ? U : T;
type A = ElementType<string[]>;        // string
type B = ElementType<number>;          // number

type First<T> = T extends [infer H extends string, ...unknown[]] ? H : never;
type C = First<["a", 1]>;              // "a"
type D = First<[1, "a"]>;              // never

type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type E = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
const e: E = { a: 1 };                 // ошибка: не хватает b`,
    keys: ["`infer U` в ветке `extends` объявляет тип, который TypeScript находит при сопоставлении формы.", "Так вытаскивают элемент массива, результат и аргументы функции, значение промиса.", "`infer X extends C` ограничивает вывод. Несколько мест: результат — union, параметры — пересечение."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `S`?",
      probe: "S",
      code: `type First<T> = T extends [infer H extends string, ...unknown[]] ? H : never;
type S = First<[1, "a"]>;`,
      opts: ["never", "1", "\"a\"", "string"],
      a: 0,
      why: "Первый элемент — `1`, он не строка, поэтому ограничение `extends string` не выполнено и выбрана ветка `never`.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type R = UnionToIntersection<{ a: 1 } | { b: 2 }>;`,
      opts: ["{ a: 1; } & { b: 2; }", "{ a: 1; } | { b: 2; }", "never", "{ a: 1; b: 2; }"],
      a: 0,
      why: "Union превращается в union функций, а общий параметр для них выводится как пересечение.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `Unpack<T>`: если `T` — промис, вернуть тип его значения, если массив — тип элемента, иначе сам `T`.",
      code: `type Unpack<T> = T;`,
      tests: `type t1 = Expect<Equal<Unpack<Promise<string>>, string>>;
type t2 = Expect<Equal<Unpack<number[]>, number>>;
type t3 = Expect<Equal<Unpack<boolean>, boolean>>;`,
      forbid: ["any", "ignore", { re: "\\bAwaited\\b", msg: "Без встроенного Awaited" }],
      hint: "Два условия подряд: `T extends Promise<infer V> ? V : T extends (infer U)[] ? U : T`.",
      solution: `type Unpack<T> = T extends Promise<infer V> ? V : T extends (infer U)[] ? U : T;`,
    },
  ],
};
