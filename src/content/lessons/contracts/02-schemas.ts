import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct2",
  region: 8,
  title: "Схема как единственный источник правды",
  q: "Зачем нужны библиотеки валидации вроде zod? Как из схемы получить тип?",
  answer: "Писать тип и проверку отдельно — значит держать два описания одних данных, которые рано или поздно разойдутся. Библиотеки схем — zod, valibot, arktype — решают это: описываешь схему один раз, она проверяет данные во время работы программы, а тип выводится из неё: `type User = z.infer<typeof UserSchema>`. Работает это на тех же механизмах, что мы прошли: дженерики, mapped и conditional types с `infer`. Схемы ставят на границах — ответы API, формы, переменные окружения.",
  theory: {
    p: [
      "Проблема ручной проверки: тип `User` и функция `isUser` — два описания одних данных. Добавили поле в тип, забыли в проверке — и предикат снова «врёт». Нужен один источник правды.",
      "Схема — объект, который знает и форму данных, и как их проверить. Из него тип выводится автоматически: в zod это `z.infer<typeof UserSchema>`. Изменил схему — изменились и проверка, и тип.",
      "Как это устроено: схема — значение с дженерик-типом, например `Check<T>`. Функция `object(shape)` собирает из схем полей схему объекта, а mapped type с `infer` вычисляет тип результата. В примере — упрощённая версия того, что делает zod.",
      "Практика: схемы ставят на границах — ответы API, данные форм, `process.env`, сообщения между окнами. Метод вроде `safeParse` возвращает результат с ошибками по полям, их удобно показывать пользователю. Проверка стоит времени, поэтому внутри приложения данные повторно не проверяют.",
    ],
    example: `type Check<T> = (x: unknown) => x is T;
const str: Check<string> = (x): x is string => typeof x === "string";
const num: Check<number> = (x): x is number => typeof x === "number";

type Shape<S> = { [K in keyof S]: S[K] extends Check<infer T> ? T : never };
function object<S extends { [key: string]: Check<unknown> }>(shape: S): Check<Shape<S>> {
  return (x): x is Shape<S> =>
    typeof x === "object" && x !== null
    && Object.keys(shape).every((k) => shape[k]!((x as { [key: string]: unknown })[k]));
}

type Infer<C> = C extends Check<infer T> ? T : never;

const UserSchema = object({ id: num, name: str });
type User = Infer<typeof UserSchema>;       // { id: number; name: string }
const u: User = { id: 1, name: 42 };        // ошибка: тип выведен из схемы`,
    keys: ["Тип и ручная проверка — два описания, которые расходятся. Схема — один источник правды.", "Из схемы выводится тип: `z.infer<typeof Schema>` в zod, `Infer<typeof Schema>` в примере.", "Схемы ставят на границах: API, формы, переменные окружения. Внутри не проверяют повторно."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `User`?",
      probe: "User",
      code: `type Check<T> = (x: unknown) => x is T;
declare const str: Check<string>;
declare const num: Check<number>;
type Shape<S> = { [K in keyof S]: S[K] extends Check<infer T> ? T : never };
declare function object<S extends { [key: string]: Check<unknown> }>(shape: S): Check<Shape<S>>;
type Infer<C> = C extends Check<infer T> ? T : never;
const UserSchema = object({ id: num, name: str });
type User = Infer<typeof UserSchema>;`,
      opts: ["{ id: number; name: string; }", "unknown", "Check<Shape<{ id: Check<number>; name: Check<string>; }>>", "{ id: Check<number>; name: Check<string>; }"],
      a: 0,
      why: "`Infer` достаёт `T` из `Check<T>`, а `Shape` превращает схему каждого поля в его тип.",
    },
    {
      type: "quiz",
      q: "Какую главную проблему решает схема валидации по сравнению с типом плюс ручным предикатом?",
      opts: ["Одно описание данных: проверка и тип не могут разойтись", "Ускоряет проверку типов", "Убирает необходимость в TypeScript", "Позволяет не проверять данные на границе"],
      a: 0,
      why: "Тип выводится из той же схемы, которая проверяет данные. Изменил одно — изменилось и другое.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `Infer<C>`: достань тип `T` из схемы `Check<T>`.",
      code: `type Check<T> = (x: unknown) => x is T;
type Infer<C> = unknown;`,
      tests: `type t1 = Expect<Equal<Infer<Check<string>>, string>>;
type t2 = Expect<Equal<Infer<Check<{ id: number }>>, { id: number }>>;`,
      forbid: ["any", "ignore"],
      hint: "`C extends Check<infer T> ? T : never`.",
      solution: `type Check<T> = (x: unknown) => x is T;
type Infer<C> = C extends Check<infer T> ? T : never;`,
    },
  ],
};
