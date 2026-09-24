import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u5",
  region: 5,
  title: "ReturnType, Parameters и классы",
  q: "Как получить тип результата функции, не описывая его вручную?",
  answer: "Через `ReturnType<typeof fn>`: утилита достаёт результат с помощью `infer`. Аналогично `Parameters` даёт кортеж параметров, а для классов есть `ConstructorParameters` и `InstanceType`. У перегрузок берётся последняя сигнатура.",
  theory: {
    p: [
      "`ReturnType<F>` и `Parameters<F>` достают из типа функции результат и кортеж параметров. Им нужен тип функции, а не сама функция. Его получают через `typeof`: в позиции типа `typeof createStore` означает «тип функции `createStore`». Так не приходится описывать типы дважды: `ReturnType<typeof createStore>`.",
      "Для перегруженной функции обе утилиты берут последнюю сигнатуру. `Parameters` возвращает именованный кортеж, его можно индексировать: `Parameters<typeof f>[0]`.",
      "`ConstructorParameters<C>` и `InstanceType<C>` делают то же для классов: параметры конструктора и тип экземпляра. Применяются к `typeof MyClass`.",
      "Внутри все четыре построены на `infer`: `ReturnType<T> = T extends (...args: any) => infer R ? R : any`.",
    ],
    example: `function createUser(name: string, age?: number) {
  return { id: Math.random(), name, age };
}

type User = ReturnType<typeof createUser>;
type Args = Parameters<typeof createUser>; // [name: string, age?: number]

class Api { constructor(public base: string) {} }
type ApiArgs = ConstructorParameters<typeof Api>; // [base: string]
type ApiInst = InstanceType<typeof Api>;          // Api`,
    keys: ["Применяй к `typeof fn`, а не к самой функции.", "У перегрузок — последняя сигнатура.", "Внутри — conditional type с `infer`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `function f(a: string, b = 1) { return [a, b] as const; }
type R = ReturnType<typeof f>;`,
      opts: ["(string | number)[]", "readonly [string, number]", "[string, number]", "readonly [string, 1]"],
      a: 1,
      why: "`as const` делает результат readonly-кортежем. `b` — параметр типа `number`, поэтому второй элемент — `number`, а не литерал `1`.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `P`?",
      probe: "P",
      code: `declare function g(id: number, opts?: { force: boolean }): void;
type P = Parameters<typeof g>[1];`,
      opts: ["{ force: boolean; }", "{ force: boolean; } | undefined", "number", "never"],
      a: 1,
      why: "Второй параметр необязательный, поэтому элемент кортежа при чтении даёт `{ force: boolean } | undefined`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyReturnType<F>` и `MyParameters<F>` через `infer`, без встроенных утилит.",
      code: `type MyReturnType<F> = unknown;
type MyParameters<F> = unknown;`,
      tests: `declare function f(a: string, b?: number): boolean;
type t1 = Expect<Equal<MyReturnType<typeof f>, boolean>>;
type t2 = Expect<Equal<MyParameters<typeof f>, [a: string, b?: number]>>;
type t3 = Expect<Equal<MyReturnType<() => Promise<string>>, Promise<string>>>;`,
      forbid: ["ignore", {"re": "\\bReturnType\\b", "msg": "Без встроенного ReturnType"}, {"re": "\\bParameters\\b", "msg": "Без встроенного Parameters"}],
      hint: "`F extends (...args: any[]) => infer R ? R : never`.",
      solution: `type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;
type MyParameters<F> = F extends (...args: infer P) => any ? P : never;`,
    },
  ],
};
