import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "n2",
  region: 1,
  title: "Type predicates",
  q: "Что такое `x is T` и в чём его риск?",
  answer: "Type predicate — возвращаемый тип `x is T` у функции-проверки. Если она вернула `true`, TypeScript считает аргумент типом `T`, а в ветке `else` вычитает `T` из union. Тело функции компилятор с предикатом не сверяет, поэтому ошибка в проверке превращается в ложные типы. С TypeScript 5.5 простые предикаты выводятся сами, например в `filter`.",
  theory: {
    p: [
      "Сужение через `typeof` или `in` работает только в том месте, где стоит проверка. Чтобы вынести проверку в отдельную функцию, ей пишут возвращаемый тип `value is User`. Это type predicate.",
      "Если функция вернула `true`, в ветке `if` аргумент получает тип `User`. В ветке `else` тип `User` вычитается из union.",
      "TypeScript не проверяет, что тело функции соответствует предикату. `return true` скомпилируется, и дальше тип будет считаться проверенным, хотя проверки не было. Поэтому такие функции делают маленькими и покрывают тестами.",
      "С TypeScript 5.5 компилятор сам выводит предикат у простых функций вроде `x => x !== null`. Поэтому `arr.filter(x => x !== null)` возвращает массив уже без `null`.",
    ],
    example: `type User = { name: string };

function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null && "name" in x && typeof x.name === "string";
}

declare const data: unknown;
if (isUser(data)) {
  data.name.toUpperCase(); // data: User
}

// Проверка неверная, но ошибки нет
function isNumber(x: unknown): x is number {
  return true;
}

const ids = [1, null, 3].filter((x) => x !== null); // number[] (TS 5.5+)`,
    keys: ["`x is T` переносит сужение в отдельную функцию.", "В ветке `else` тип `T` вычитается.", "Тело предиката TS не проверяет."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `clean`?",
      probe: "clean",
      code: `const values = ["a", null, "b", undefined];
const clean = values.filter((v) => v != null);`,
      opts: ["string[]", "(string | null | undefined)[]", "(string | undefined)[]", "unknown[]"],
      a: 0,
      why: "С TypeScript 5.5 компилятор сам понимает, что колбэк проверяет `v is string`. У `filter` есть вариант для таких колбэков, и он возвращает массив уже без `null` и `undefined`.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (!isString(x))`?",
      probe: "r",
      code: `function isString(x: unknown): x is string {
  return typeof x === "string";
}
function f(x: string | number | boolean) {
  if (!isString(x)) {
    const r = x;
  }
}`,
      opts: ["string | number | boolean", "number | boolean", "string", "never"],
      a: 1,
      why: "Предикат работает в обе стороны: в ветке, где он вернул `false`, `string` вычитается из union.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`perms` не компилируется: после `isAdmin(p)` TypeScript не знает, что `p` — `Admin`. Сделай `isAdmin` предикатом.",
      code: `type Admin = { role: "admin"; permissions: string[] };
type Guest = { role: "guest" };
type Person = Admin | Guest;

function isAdmin(p: Person): boolean {
  return p.role === "admin";
}

function perms(p: Person): string[] {
  return isAdmin(p) ? p.permissions : [];
}`,
      tests: `declare const someone: Person;
if (isAdmin(someone)) {
  const a: Admin = someone;
} else {
  const g: Guest = someone;
}`,
      runtime: [["perms({ role: \"admin\", permissions: [\"x\"] })", "[\"x\"]"], ["perms({ role: \"guest\" })", "[]"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      must: ["isAdmin(p) ? p.permissions : []"],
      hint: "Поменяй возвращаемый тип `boolean` на `p is ...`.",
      solution: `type Admin = { role: "admin"; permissions: string[] };
type Guest = { role: "guest" };
type Person = Admin | Guest;

function isAdmin(p: Person): p is Admin {
  return p.role === "admin";
}

function perms(p: Person): string[] {
  return isAdmin(p) ? p.permissions : [];
}`,
    },
  ],
};
