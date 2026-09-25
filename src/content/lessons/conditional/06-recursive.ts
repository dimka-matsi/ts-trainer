import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc6",
  region: 6,
  title: "Рекурсивные типы",
  q: "Как описать JSON-значение? Как написать `DeepReadonly` и типизировать пути вида `\"a.b.c\"`?",
  answer: "Тип может ссылаться на себя: `type Json = string | number | boolean | null | Json[] | { [key: string]: Json }` описывает любое JSON-значение. Рекурсивные mapped и conditional types проходят по вложенным объектам: `DeepReadonly<T>` делает `readonly` поля на каждом уровне, если значение — объект. Пути `\"a.b.c\"` собирают рекурсией по ключам с шаблонными строками. У рекурсии есть лимит глубины: слишком глубокие типы дают ошибку «Type instantiation is excessively deep», а хвостовая рекурсия в conditional types с TypeScript 4.5 разрешена намного глубже.",
  theory: {
    p: [
      "Рекурсивный тип ссылается на себя. JSON-значение — это примитив, массив JSON-значений или объект со строковыми ключами и JSON-значениями: так и записывают. Дерево меню, комментарии с ответами, файловая система описываются так же.",
      "Глубокие утилиты: `readonly` и `Partial` действуют только на верхний уровень. `DeepReadonly<T>` проходит по ключам, и если значение — объект, применяет себя к нему: `T[K] extends object ? DeepReadonly<T[K]> : T[K]`. Функции тоже объекты, поэтому в реальных версиях их обрабатывают отдельно.",
      "Пути: `Paths<T>` для каждого ключа возвращает сам ключ и, если значение объект, ключ с точкой плюс пути вложенного объекта. Для `{ a: { b: { c: number } } }` получится `\"a\" | \"a.b\" | \"a.b.c\"`. С таким типом функция `get(obj, path)` подсказывает только существующие пути.",
      "Лимиты. TypeScript ограничивает глубину раскрытия: на слишком глубоких или бесконечных типах будет ошибка «Type instantiation is excessively deep and possibly infinite». С версии 4.5 хвостовая рекурсия в conditional types — когда рекурсивный вызов стоит прямо в ветке — разрешена до 1000 уровней. Рекурсивные типы замедляют проверку, поэтому их не пишут без нужды.",
    ],
    example: `type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
const ok: Json = { a: [1, { b: null }] };
const bad: Json = { d: new Date() };      // ошибка: Date — не JSON

type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };
type Paths<T> = {
  [K in keyof T & string]: T[K] extends object ? K | \`\${K}.\${Paths<T[K]>}\` : K;
}[keyof T & string];

type P = Paths<{ a: { b: { c: number } }; d: string }>; // "a" | "d" | "a.b" | "a.b.c"`,
    keys: ["Тип может ссылаться на себя: так описывают JSON, деревья, вложенные комментарии.", "Глубокие утилиты применяют себя к вложенным объектам: `DeepReadonly`, `DeepPartial`.", "Рекурсия ограничена по глубине; хвостовая рекурсия в conditional types разрешена глубже (TS 4.5)."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      probe: "R",
      code: `type Paths<T> = {
  [K in keyof T & string]: T[K] extends object ? K | \`\${K}.\${Paths<T[K]>}\` : K;
}[keyof T & string];
type R = Paths<{ a: { b: { c: number } }; d: string }>;`,
      opts: ["\"a\" | \"d\" | \"a.b\" | \"a.b.c\"", "\"a\" | \"d\"", "\"a.b.c\" | \"d\"", "string"],
      a: 0,
      why: "Для объекта-значения тип добавляет и сам ключ, и пути глубже через точку.",
    },
    {
      type: "quiz",
      q: "Почему обычный `Readonly<T>` не защищает `user.address.city`?",
      opts: ["Он действует только на верхний уровень, нужен рекурсивный `DeepReadonly`", "Он защищает только строки", "Он работает только с массивами", "Защищает, это ошибка компилятора"],
      a: 0,
      why: "Mapped type проходит по ключам одного уровня. Чтобы дойти до вложенных, тип должен применить себя к значениям-объектам.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `DeepPartial<T>`: все поля необязательные на каждом уровне вложенности.",
      code: `type DeepPartial<T> = T;`,
      tests: `type Config = { server: { host: string; port: number }; debug: boolean };
const a: DeepPartial<Config> = {};
const b: DeepPartial<Config> = { server: { port: 8080 } };
// @ts-expect-error — тип поля всё равно проверяется
const c: DeepPartial<Config> = { server: { port: "8080" } };`,
      forbid: ["any", "ignore"],
      hint: "`{ [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }`.",
      solution: `type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };`,
    },
  ],
};
