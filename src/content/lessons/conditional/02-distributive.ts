import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc2",
  region: 6,
  title: "Дистрибутивность",
  q: "Почему `ToArray<string | number>` даёт `string[] | number[]`? Что такое дистрибутивные conditional types и как это отключить?",
  answer: "Если в условии слева стоит голый параметр типа, а на вход пришёл union, условие применяется к каждому члену отдельно, и результаты объединяются: `ToArray<string | number>` — это `ToArray<string> | ToArray<number>`, то есть `string[] | number[]`. На этом держится фильтрация union в `Exclude`. Чтобы отключить распределение, параметр оборачивают в кортеж: `[T] extends [U]`. Отсюда классический подвох: `IsNever<never>` через голый `T` даёт `never`, потому что `never` — пустой union и условие не вызывается ни разу.",
  theory: {
    p: [
      "Дистрибутивность включается, когда слева от `extends` стоит голый параметр типа — просто `T`, без обёрток. Тогда `F<A | B>` превращается в `F<A> | F<B>`. `ToArray<string | number>` с условием `T extends unknown ? T[] : never` даёт `string[] | number[]`, а не `(string | number)[]`.",
      "Именно так работает фильтрация: `Exclude<T, U> = T extends U ? never : T`. Каждый член union проверяется отдельно, неподходящие становятся `never`, а `never` из union исчезает. `boolean` — это `true | false`, поэтому он тоже распределяется.",
      "Отключают обёрткой: `[T] extends [U]`. Кортеж — уже не голый параметр, и union проверяется целиком. `ToArray` с `[T] extends [unknown]` даст `(string | number)[]`.",
      "Подвох с `never`. `never` — пустой union. При распределении условие вызывается для каждого члена, а членов ноль, поэтому результат — `never`, какая бы ни была ветка. `IsNever<T> = T extends never ? true : false` на `never` даёт `never`. Правильно — `[T] extends [never]`.",
    ],
    example: `type ToArray<T> = T extends unknown ? T[] : never;
type A = ToArray<string | number>;        // string[] | number[]

type ToArrayWhole<T> = [T] extends [unknown] ? T[] : never;
type B = ToArrayWhole<string | number>;   // (string | number)[]

type IsNeverBad<T> = T extends never ? true : false;
type C = IsNeverBad<never>;               // never
type IsNever<T> = [T] extends [never] ? true : false;
const ok: IsNever<never> = true;
const no: IsNeverBad<never> = true;       // ошибка: тип — never`,
    keys: ["Голый параметр слева от `extends` + union на входе = условие для каждого члена отдельно.", "На этом держится фильтрация `Exclude`, `boolean` тоже распределяется как `true | false`.", "`[T] extends [U]` отключает распределение. `IsNever` пишут только так."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `type ToArray<T> = T extends unknown ? T[] : never;
type R = ToArray<string | number>;`,
      opts: ["string[] | number[]", "(string | number)[]", "never", "unknown[]"],
      a: 0,
      why: "`T` голый, поэтому условие применяется к `string` и к `number` отдельно.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `type IsNever<T> = T extends never ? true : false;
type R = IsNever<never>;`,
      opts: ["never", "true", "false", "boolean"],
      a: 0,
      why: "`never` — пустой union: распределять нечего, и результат пустой — `never`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`IsUnionOfStrings<T>` должен проверять union целиком: `true`, только если все члены — строки. Сейчас он распределяется и для `string | number` даёт `boolean`. Отключи распределение.",
      code: `type IsUnionOfStrings<T> = T extends string ? true : false;`,
      tests: `type t1 = Expect<Equal<IsUnionOfStrings<"a" | "b">, true>>;
type t2 = Expect<Equal<IsUnionOfStrings<string | number>, false>>;
type t3 = Expect<Equal<IsUnionOfStrings<number>, false>>;`,
      forbid: ["any", "ignore"],
      hint: "Оберни обе стороны в кортеж: `[T] extends [string]`.",
      solution: `type IsUnionOfStrings<T> = [T] extends [string] ? true : false;`,
    },
  ],
};
