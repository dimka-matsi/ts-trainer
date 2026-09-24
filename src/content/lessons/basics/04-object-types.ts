import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b4",
  region: 0,
  title: "Объектные типы",
  q: "Чем `name?: string` отличается от `name: string | undefined`?",
  answer: "`name?: string` означает, что ключа может не быть вовсе. `name: string | undefined` требует ключ, но разрешает значение `undefined`. С `exactOptionalPropertyTypes` в опциональное свойство нельзя явно записать `undefined`.",
  theory: {
    p: [
      "Объектный тип перечисляет свойства и их типы: `{ x: number; y: number }`. Разделять свойства можно `;` или `,`.",
      "Знак `?` делает свойство опциональным: его можно не передавать. При чтении оно имеет тип `T | undefined`, поэтому перед использованием его проверяют или читают через `?.`.",
      "`name?: string` и `name: string | undefined` похожи, но не равны: во втором случае ключ обязан присутствовать, пусть и со значением `undefined`.",
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
    keys: ["`?` — ключа может не быть.", "Опциональное свойство читается как `T | undefined`.", "`?.` безопасно читает цепочку."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `e`?",
      probe: "e",
      code: `type User = { name: string; email?: string };
declare const u: User;
const e = u.email;`,
      opts: ["string", "string | undefined", "string | null", "any"],
      a: 1,
      why: "Опциональное свойство при чтении даёт `T | undefined`: ключа в объекте может не быть.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Функция должна вернуть домен почты или `\"нет почты\"`, если её нет. Исправь без `!` и `as`.",
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
