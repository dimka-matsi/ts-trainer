import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc1",
  region: 6,
  title: "Conditional types",
  q: "Что такое conditional types и где они нужны?",
  answer: "Conditional type — «если» на уровне типов: `T extends U ? X : Y`. Если `T` подходит под `U`, результат `X`, иначе `Y`. Чаще всего их пишут в дженериках: выбрать тип результата по типу аргумента, отфильтровать union, вытащить часть типа через `infer`. Так устроены `Exclude`, `Extract`, `NonNullable`, `ReturnType`. Они заменяют перегрузки, когда вариантов много: вместо трёх сигнатур — один тип, который вычисляет результат.",
  theory: {
    p: [
      "Запись `T extends U ? X : Y` читается как «если `T` можно присвоить в `U`, то `X`, иначе `Y`». `extends` здесь — не наследование классов, а проверка «подходит ли тип». `IsString<\"hi\">` с условием `T extends string` даёт ветку «да», а `IsString<42>` — «нет».",
      "Сила условий — в дженериках. Функция `createLabel(x)` должна вернуть `IdLabel` для числа и `NameLabel` для строки. Вместо перегрузок на каждый вариант пишут `type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel`, и тип результата вычисляется из аргумента.",
      "Условия можно вкладывать: `T extends string ? \"s\" : T extends number ? \"n\" : \"other\"`. А в ветке «да» TypeScript знает, что `T` подходит под `U`, — это ещё и способ ограничить тип внутри: `T extends { message: unknown } ? T[\"message\"] : never`.",
      "Где встретишь: `Exclude<T, U>` — `T extends U ? never : T`, `NonNullable<T>`, `ReturnType<F>`, типы библиотек, которые вычисляют результат по опциям. На собеседовании просят объяснить `extends` в условии и написать простой тип вроде `IsArray<T>` или `MessageOf<T>`.",
    ],
    example: `type IsString<T> = T extends string ? "да" : "нет";
type A = IsString<"hi">;          // "да"
type B = IsString<42>;            // "нет"

type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
type M1 = MessageOf<{ message: string }>;  // string
type M2 = MessageOf<{ code: number }>;     // never

const wrong: IsString<"hi"> = "нет";       // ошибка: тип — "да"`,
    keys: ["`T extends U ? X : Y` — «если T подходит под U, то X, иначе Y».", "Нужны в дженериках: результат вычисляется из аргумента, это заменяет пачку перегрузок.", "На них построены `Exclude`, `Extract`, `NonNullable`, `ReturnType`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `A`?",
      probe: "A",
      code: `type IsString<T> = T extends string ? "да" : "нет";
type A = IsString<"hi">;`,
      opts: ["\"да\"", "\"нет\"", "\"да\" | \"нет\"", "boolean"],
      a: 0,
      why: "Литерал `\"hi\"` подходит под `string`, поэтому выбирается первая ветка.",
    },
    {
      type: "quiz",
      q: "Что означает `extends` внутри conditional type?",
      opts: ["Проверку «можно ли присвоить T в U»", "Наследование класса", "Расширение интерфейса", "Объединение типов"],
      a: 0,
      why: "Это то же отношение, что проверяется при присваивании: подходит ли один тип под другой.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `IsArray<T>`: `true`, если `T` — массив, иначе `false`.",
      code: `type IsArray<T> = boolean;`,
      tests: `type t1 = Expect<Equal<IsArray<string[]>, true>>;
type t2 = Expect<Equal<IsArray<number>, false>>;
type t3 = Expect<Equal<IsArray<readonly number[]>, true>>;`,
      forbid: ["any", "ignore"],
      hint: "Сравни с `readonly unknown[]`: под него подходят и обычные, и неизменяемые массивы.",
      solution: `type IsArray<T> = T extends readonly unknown[] ? true : false;`,
    },
  ],
};
