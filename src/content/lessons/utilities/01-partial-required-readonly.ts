import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u1",
  region: 5,
  title: "Partial, Required, Readonly",
  q: "Что делают `Partial`, `Required` и `Readonly` и как они устроены?",
  answer: "`Partial` делает все поля опциональными, `Required` — обязательными, `Readonly` запрещает запись. Все три — mapped types по `keyof T` с модификаторами `?`, `-?` и `readonly`. `Readonly` не глубокий: вложенные объекты остаются изменяемыми.",
  theory: {
    p: [
      "`Partial<T>` делает все свойства опциональными. Типичный случай — патч: `update(todo, { title: \"...\" })` принимает любое подмножество полей.",
      "`Required<T>` — обратное: снимает `?` со всех свойств. `Readonly<T>` запрещает перезаписывать свойства, как `Object.freeze`, но только на уровне типов и только на первом уровне вложенности.",
      "Все три — mapped types: они проходят по ключам `T` и меняют модификаторы. `?` добавляет опциональность, `-?` снимает, `readonly` запрещает запись, `-readonly` снимает запрет.",
    ],
    example: `interface Todo { title: string; done?: boolean }

function update(todo: Todo, patch: Partial<Todo>): Todo {
  return { ...todo, ...patch };
}

type Full = Required<Todo>;      // done обязателен
const t: Readonly<Todo> = { title: "Read" };
t.title = "Write";               // ошибка: read-only

// так они устроены в lib.es5.d.ts:
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyRequired<T> = { [K in keyof T]-?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };`,
    keys: ["`Partial` — для патчей и форм.", "`Readonly` не глубокий.", "Внутри — mapped types с модификаторами."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `T`?",
      probe: "T",
      code: `interface Todo { title: string; done?: boolean }
type T = Required<Todo>;`,
      opts: ["{ title: string; done?: boolean; }", "{ title: string; done: boolean; }", "{ title: string; done: boolean | undefined; }", "Todo"],
      a: 1,
      why: "`Required` снимает модификатор `?` через `-?`, и вместе с ним уходит `| undefined`.",
    },
    {
      type: "quiz",
      q: "`interface Cfg { db: { host: string } }`, `const c: Readonly<Cfg>`. Скомпилируется ли `c.db.host = \"x\"`?",
      opts: ["Да: `Readonly` не глубокий", "Нет: `host` стал readonly", "Нет: `db` нельзя читать", "Только без `strict`"],
      a: 0,
      why: "`Readonly` добавляет модификатор только свойствам первого уровня. Нельзя перезаписать `c.db`, но `c.db.host` менять можно. Для глубокой защиты пишут `DeepReadonly`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyPartial<T>` и `MyReadonly<T>` без встроенных утилит.",
      code: `type MyPartial<T> = unknown;
type MyReadonly<T> = unknown;`,
      tests: `interface Todo { title: string; done: boolean }
type t1 = Expect<Equal<MyPartial<Todo>, { title?: string; done?: boolean }>>;
type t2 = Expect<Equal<MyReadonly<Todo>, { readonly title: string; readonly done: boolean }>>;`,
      forbid: ["any", "ignore", {"re": "\\bPartial\\b", "msg": "Без встроенного Partial"}, {"re": "\\bReadonly\\b", "msg": "Без встроенного Readonly"}],
      hint: "Mapped type: `{ [K in keyof T]?: T[K] }`.",
      solution: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `Mutable<T>` — обратное к `Readonly`: снимает `readonly` со всех свойств.",
      code: `type Mutable<T> = unknown;`,
      tests: `type RO = { readonly a: number; readonly b: string };
type t1 = Expect<Equal<Mutable<RO>, { a: number; b: string }>>;`,
      forbid: ["any", "ignore"],
      hint: "Модификатор можно снять минусом: `-readonly`.",
      solution: `type Mutable<T> = { -readonly [K in keyof T]: T[K] };`,
    },
  ],
};
