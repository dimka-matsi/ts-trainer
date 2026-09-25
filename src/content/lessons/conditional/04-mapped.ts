import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc4",
  region: 6,
  title: "Mapped types и переименование ключей",
  q: "Как устроены mapped types? Что такое модификаторы `+`/`-` и переименование ключей через `as`?",
  answer: "Mapped type проходит по ключам и строит новый объектный тип: `{ [K in keyof T]: T[K] }`. Модификаторы добавляют или снимают `readonly` и `?`: `-readonly` делает поля изменяемыми, `-?` — обязательными. С TypeScript 4.1 ключи можно переименовать через `as`: `[K in keyof T as get${Capitalize<K & string>}]` даёт геттеры, а `as` с `never` выбрасывает ключ — так фильтруют поля по типу значения. Mapped type по `keyof T` сохраняет модификаторы исходного типа.",
  theory: {
    p: [
      "`{ [K in keyof T]: T[K] }` — копия `T`: для каждого ключа `K` поле того же типа. Меняя правую часть, получают новые типы: `boolean` для флагов, `() => T[K]` для геттеров, `T[K] | null` для черновика формы. Когда перебирают `keyof T`, модификаторы `readonly` и `?` исходного типа сохраняются.",
      "Модификаторы: `readonly` и `?` можно добавить (`+readonly`, `+?`, плюс обычно опускают) или снять: `-readonly` делает поля изменяемыми, `-?` — обязательными. Так устроены `Required` и обратная к `Readonly` утилита `Mutable`.",
      "Переименование ключей — `as` после `in`: `[K in keyof T as NewKey]`. Новый ключ можно собрать шаблонной строкой: `as on${Capitalize<K & string>}Changed`. Запись `K & string` нужна, потому что ключи бывают и числами, и символами, а шаблону нужна строка.",
      "Фильтрация: если в `as` получился `never`, ключ выбрасывается. `[K in keyof T as T[K] extends Function ? never : K]` оставляет только поля-данные без методов. Так пишут `PickByType<T, V>` — один из частых вопросов на лайв-кодинге.",
    ],
    example: `type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type M = Mutable<{ readonly a: number; b?: string }>; // { a: number; b?: string | undefined }

type Getters<T> = { [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K] };
type G = Getters<{ name: string; age: number }>;   // { getName: () => string; getAge: () => number }

type DataOnly<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };
type D = DataOnly<{ id: number; save(): void }>;   // { id: number }
const d: D = { id: 1, save() {} };                 // ошибка: save выброшен`,
    keys: ["`{ [K in keyof T]: … }` строит новый тип по ключам и сохраняет модификаторы `T`.", "`-readonly` и `-?` снимают модификаторы, `+` (или без знака) — добавляют.", "`as` переименовывает ключи шаблонной строкой, а `as never` выбрасывает ключ — так фильтруют поля."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `type Getters<T> = { [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K] };
type R = Getters<{ name: string; age: number }>;`,
      opts: ["{ getName: () => string; getAge: () => number; }", "{ name: () => string; age: () => number; }", "{ getname: () => string; getage: () => number; }", "{}"],
      a: 0,
      why: "`as` переименовывает каждый ключ: `name` → `getName`, `Capitalize` поднимает первую букву.",
    },
    {
      type: "quiz",
      q: "Как в mapped type выбросить ключ?",
      opts: ["Вернуть `never` в `as`", "Написать `-K`", "Поставить `?`", "Вернуть `undefined` в значении"],
      a: 0,
      why: "Ключ `never` не существует, поэтому поле пропадает из результата.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `PickByType<T, V>`: оставь только поля `T`, значения которых подходят под `V`.",
      code: `type PickByType<T, V> = T;`,
      tests: `type User = { id: number; name: string; age: number; admin: boolean };
type t1 = Expect<Equal<PickByType<User, number>, { id: number; age: number }>>;
type t2 = Expect<Equal<PickByType<User, string>, { name: string }>>;`,
      forbid: ["any", "ignore", { re: "\\b(Pick|Omit)\\b", msg: "Без Pick и Omit — через mapped type" }],
      hint: "`[K in keyof T as T[K] extends V ? K : never]: T[K]`.",
      solution: `type PickByType<T, V> = { [K in keyof T as T[K] extends V ? K : never]: T[K] };`,
    },
  ],
};
