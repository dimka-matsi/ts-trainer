import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl10",
  region: 7,
  title: "Модули и import type",
  q: "Чем ES-модули отличаются от CommonJS? Что такое файл-скрипт без импортов и зачем `import type`?",
  answer: "ES-модули — `import` и `export`, статические связи, которые видны без выполнения кода; CommonJS — `require` и `module.exports` в Node, связи определяются во время работы. Для TypeScript важно: файл без `import` и `export` — не модуль, а скрипт, и всё объявленное в нём попадает в глобальную область, поэтому одинаковые имена в разных файлах конфликтуют. `import type` импортирует только тип: такая строка полностью исчезает из JavaScript, что важно для инструментов, которые компилируют файлы по одному, — с флагом `verbatimModuleSyntax` импорт типа без `type` становится ошибкой.",
  theory: {
    p: [
      "ES-модули (ESM) — стандарт JavaScript: `import { x } from \"./a\"`, `export`. Связи статические, поэтому сборщик выбрасывает неиспользуемое (tree shaking), а импорты поднимаются наверх. CommonJS — система Node до ESM: `const x = require(\"./a\")`, `module.exports`. TypeScript понимает обе и компилирует в нужную по настройке `module`.",
      "Модуль или скрипт. Файл, где есть хотя бы один `import` или `export`, — модуль: его объявления видны только внутри. Файл без них — скрипт: объявления глобальные. Две функции `helper` в двух файлах-скриптах дадут ошибку «повторное объявление». Если нужно сделать файл модулем без экспортов, пишут `export {}`.",
      "`import type { User } from \"./api\"` — импорт только для типов. При компиляции строка исчезает. Можно смешивать: `import { load, type User } from \"./api\"`. Зачем: инструменты, которые компилируют файлы по одному (esbuild, SWC, Babel), не знают, что `User` — тип, и могли бы оставить импорт, которого нет во время работы.",
      "`verbatimModuleSyntax` (TypeScript 5.0) делает правило простым: что написано в импорте, то и останется в JavaScript, а импорты только типов обязаны быть помечены `type`. Поэтому в проектах со сборщиками его включают. В примере ниже песочница делит код на файлы строкой `// @filename:`.",
    ],
    example: `// @flags: verbatimModuleSyntax
// @filename: api.ts
export type User = { id: number; name: string };
export function load(): User {
  return { id: 1, name: "Аня" };
}
// @filename: main.ts
import { type User, load } from "./api";
import { User as U2 } from "./api";   // ошибка: тип без пометки type
const u: User = load();`,
    keys: ["ESM — статические `import`/`export`, CommonJS — `require` и `module.exports` во время работы.", "Файл без `import` и `export` — скрипт с глобальными объявлениями; `export {}` делает его модулем.", "`import type` исчезает при компиляции; `verbatimModuleSyntax` требует помечать импорты только типов."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что будет, если в двух файлах без `import` и `export` объявить функцию `helper`?",
      opts: ["Ошибка: оба файла — скрипты, и функции попадают в одну глобальную область", "Ничего: у каждого файла своя область", "Вторая функция заменит первую без ошибки", "Сборщик переименует одну из них"],
      a: 0,
      why: "Без импортов и экспортов файл — скрипт. Чтобы изолировать объявления, достаточно `export {}`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `u`?",
      probe: "u",
      code: `// @filename: api.ts
export type User = { id: number };
export function load(): User { return { id: 1 }; }
// @filename: main.ts
import { type User, load } from "./api";
const u = load();`,
      opts: ["User", "{ id: number; }", "any", "unknown"],
      a: 0,
      why: "Функция объявлена с результатом `User`, и TypeScript печатает имя типа из другого модуля.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "С флагом `verbatimModuleSyntax` импорт не компилируется: `Order` — только тип. Исправь импорт.",
      code: `// @flags: verbatimModuleSyntax
// @filename: orders.ts
export type Order = { id: number; total: number };
export function fetchOrder(id: number): Order {
  return { id, total: 0 };
}
// @filename: main.ts
import { Order, fetchOrder } from "./orders";
const o: Order = fetchOrder(1);`,
      forbid: ["any", "ignore"],
      must: ["{ type Order"],
      hint: "Пометь тип: `import { type Order, fetchOrder } from \"./orders\";`.",
      solution: `// @flags: verbatimModuleSyntax
// @filename: orders.ts
export type Order = { id: number; total: number };
export function fetchOrder(id: number): Order {
  return { id, total: 0 };
}
// @filename: main.ts
import { type Order, fetchOrder } from "./orders";
const o: Order = fetchOrder(1);`,
    },
  ],
};
