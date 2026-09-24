import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b4",
  region: 0,
  title: "Объектные типы",
  q: "Чем `name?: string` отличается от `name: string | undefined`?",
  answer: "`name?: string` значит, что свойства `name` в объекте может не быть совсем. `name: string | undefined` требует, чтобы свойство было, но разрешает записать в него `undefined`. При чтении оба варианта дают `string | undefined`, поэтому перед использованием значение проверяют.",
  theory: {
    p: [
      "Объектный тип перечисляет свойства и их типы: `{ x: number; y: number }`. Свойства разделяют `;` или `,`. Чтобы не повторять длинный тип, ему дают имя: `type Point = { x: number; y: number }`.",
      "Знак `?` после имени делает свойство необязательным: объект можно создать без него. При чтении такое свойство имеет тип `string | undefined`, поэтому перед использованием его проверяют или читают через `?.`.",
      "`name?: string` и `name: string | undefined` похожи, но различаются при создании объекта. Во втором случае свойство обязательно, пусть и со значением `undefined`.",
    ],
    example: `function printName(obj: { first: string; last?: string }) {
  console.log(obj.last.toUpperCase());  // ошибка: possibly undefined
  console.log(obj.last?.toUpperCase()); // ок
}

printName({ first: "Bob" });             // last можно не передавать

type A = { name?: string };
type B = { name: string | undefined };
const a: A = {};                         // ок
const b: B = {};                         // ошибка: ключ name обязателен`,
    keys: ["`?` — свойства может не быть.", "Необязательное свойство читается как `T | undefined`.", "`?.` читает свойство, только если слева есть значение."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `e`?",
      probe: "e",
      code: `type User = { name: string; email?: string };
declare const u: User;
const e = u.email;`,
      opts: ["string", "string | undefined", "undefined", "any"],
      a: 1,
      why: "Необязательное свойство при чтении даёт `string | undefined`: в объекте его может не быть.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`domain` должна вернуть часть адреса после `@` или строку `\"нет почты\"`, если почты нет. Сейчас код не компилируется, потому что `email` может отсутствовать. Исправь проверкой, без `!` и `as`.",
      code: `type User = { name: string; email?: string };

function domain(u: User): string {
  return u.email.split("@")[1];
}`,
      runtime: [["domain({ name: \"A\", email: \"a@mail.pl\" })", "\"mail.pl\""], ["domain({ name: \"B\" })", "\"нет почты\""]],
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "Сначала проверь `u.email`, а в ветке без почты верни строку.",
      solution: `type User = { name: string; email?: string };

function domain(u: User): string {
  if (!u.email) return "нет почты";
  return u.email.split("@")[1];
}`,
    },
  ],
};
