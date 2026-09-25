import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj6",
  region: 10,
  title: "JSDoc, checkJs и миграция с JavaScript",
  q: "Как постепенно перевести проект с JavaScript на TypeScript? Как проверять типы в `.js` файлах?",
  answer: "Миграцию делают по шагам, а не одним коммитом. Включают `allowJs`, чтобы `.js` и `.ts` жили в одном проекте, и `checkJs` — или `// @ts-check` в отдельных файлах, — чтобы TypeScript проверял JavaScript. Типы в `.js` пишут в JSDoc-комментариях: `@param`, `@returns`, `@typedef`, `@type`. Потом файлы переименовывают в `.ts` по одному, начиная с листьев — модулей без зависимостей, — и постепенно включают строгие флаги. Для временно неисправимых мест — `@ts-expect-error` с пояснением, а не `@ts-ignore`: первый сообщит, когда ошибка исчезнет.",
  theory: {
    p: [
      "`allowJs` разрешает `.js` файлы в проекте на TypeScript: их можно импортировать из `.ts`, и TypeScript выводит для них типы, насколько может. Без `allowJs` импорт `.js` даёт `any` с ошибкой «нет файла объявлений».",
      "`checkJs` включает проверку типов в `.js` файлах. Точечно — комментарием `// @ts-check` в начале файла, отключить в одном файле — `// @ts-nocheck`. Типы в JavaScript задают JSDoc: `/** @param {number} x */`, `/** @returns {Promise<User>} */`, `/** @typedef {{ id: number }} User */`, `/** @type {string[]} */`.",
      "План миграции: 1) `allowJs` и сборка, которая понимает оба языка; 2) `checkJs` или `@ts-check` и JSDoc там, где много ошибок; 3) переименование в `.ts` от листьев к корню — сначала утилиты без зависимостей, потом те, кто их использует; 4) флаги `strict` по одному: `noImplicitAny`, потом `strictNullChecks`.",
      "Для мест, которые пока не исправить, пишут `// @ts-expect-error причина`. В отличие от `@ts-ignore`, он сам станет ошибкой, когда проблема исчезнет, и не скроет новые ошибки навсегда. Некоторые библиотеки, например Svelte, осознанно пишут исходники на JavaScript с JSDoc и проверяют их TypeScript.",
    ],
    example: `// @flags: allowJs, checkJs
// @filename: cart.js
/**
 * @typedef {{ id: number, price: number }} Item
 * @param {Item[]} items
 * @returns {number}
 */
export function total(items) {
  return items.reduce((s, i) => s + i.price, 0);
}
// @filename: main.ts
import { total } from "./cart";
const t: number = total([{ id: 1, price: 5 }]);
total([{ id: 1 }]);                   // ошибка: JSDoc требует price`,
    keys: ["`allowJs` — `.js` и `.ts` в одном проекте, `checkJs` или `// @ts-check` — проверка JavaScript.", "Типы в `.js` — JSDoc: `@param`, `@returns`, `@typedef`, `@type`.", "Переименовывают от листьев к корню, `strict` включают по флагу; вместо `@ts-ignore` — `@ts-expect-error`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `t`?",
      probe: "t",
      code: `// @flags: allowJs, checkJs
// @filename: cart.js
/**
 * @param {{ price: number }[]} items
 * @returns {number}
 */
export function total(items) { return items.reduce((s, i) => s + i.price, 0); }
// @filename: main.ts
import { total } from "./cart";
const t = total([{ price: 5 }]);`,
      opts: ["number", "any", "unknown", "void"],
      a: 0,
      why: "Тип результата задан в JSDoc `@returns {number}`, и TypeScript использует его.",
    },
    {
      type: "quiz",
      q: "Почему для временного обхода ошибки лучше `@ts-expect-error`, чем `@ts-ignore`?",
      opts: ["Он сам станет ошибкой, когда проблема исчезнет, и не будет навсегда прятать строку", "Он работает быстрее", "`@ts-ignore` удалён", "Разницы нет"],
      a: 0,
      why: "`@ts-ignore` молча скрывает любые ошибки строки, включая новые. `@ts-expect-error` требует, чтобы ошибка была.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Добавь JSDoc к функции `greet` в JavaScript-файле: параметр `name` — строка, результат — строка. Тогда вызов с числом станет ошибкой.",
      code: `// @flags: allowJs, checkJs
// @filename: greet.js
export function greet(name) {
  return "Привет, " + name;
}
// @filename: main.ts
import { greet } from "./greet";
const s: string = greet("Аня");`,
      tests: `// @ts-expect-error — нужна строка
greet(42);`,
      forbid: ["ignore"],
      hint: "Перед функцией: `/** @param {string} name @returns {string} */`.",
      solution: `// @flags: allowJs, checkJs
// @filename: greet.js
/**
 * @param {string} name
 * @returns {string}
 */
export function greet(name) {
  return "Привет, " + name;
}
// @filename: main.ts
import { greet } from "./greet";
const s: string = greet("Аня");`,
    },
  ],
};
