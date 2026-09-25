import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj5",
  region: 10,
  title: "Библиотека с типами: declaration и skipLibCheck",
  q: "Как опубликовать библиотеку с типами? Что делают `declaration`, поле `types` в package.json и `skipLibCheck`?",
  answer: "`declaration: true` заставляет `tsc` создать рядом с JavaScript файлы `.d.ts` — только типы. В package.json их указывают полем `types` или условием `\"types\"` внутри `exports`, первым в списке, и тогда пользователи получают подсказки и проверку. Для JavaScript без исходников на TypeScript `.d.ts` пишут вручную и кладут рядом. `skipLibCheck` пропускает проверку всех `.d.ts`: сборка быстрее, а конфликты между пакетами `@types` не ломают проект — но ошибки в самих объявлениях тоже не видны. `isolatedDeclarations` (TS 5.5) требует явных типов у экспортов, чтобы `.d.ts` могли генерировать быстрые инструменты.",
  theory: {
    p: [
      "Пользователь библиотеки получает JavaScript, а типы — из `.d.ts`. `declaration: true` создаёт их при сборке, `declarationMap: true` позволяет в редакторе переходить из `.d.ts` к исходнику. В package.json указывают `\"types\": \"./dist/index.d.ts\"`, а для современных пакетов с `exports` — условие `\"types\"`, которое стоит первым в каждом разделе.",
      "Если библиотека написана на JavaScript, `.d.ts` пишут руками и кладут рядом: `math.js` и `math.d.ts`. TypeScript найдёт объявления по имени и будет проверять вызовы. Без них импорт из `.js` — это ошибка «не найден файл объявлений» и неявный `any`.",
      "`skipLibCheck: true` — не проверять `.d.ts` файлы. В `node_modules` их тысячи, и два пакета `@types` могут конфликтовать между собой. Флаг сильно ускоряет проверку и включён почти везде. Цена: ошибки в собственных `.d.ts` тоже пропускаются.",
      "`isolatedDeclarations` (TypeScript 5.5) требует явно писать типы у экспортируемых функций и значений. Тогда `.d.ts` можно создать, не проверяя весь проект, — быстрыми инструментами и параллельно. Это важно для монорепозиториев и больших библиотек.",
    ],
    example: `// @filename: math.js
export function double(x) { return x * 2; }
// @filename: math.d.ts
export declare function double(x: number): number;
// @filename: main.ts
import { double } from "./math";
const r: number = double(2);
double("два");                        // ошибка: объявление требует число`,
    keys: ["`declaration` создаёт `.d.ts`; в package.json — `types` или условие `\"types\"` первым в `exports`.", "Для JavaScript-кода `.d.ts` кладут рядом с `.js` — TypeScript найдёт их по имени.", "`skipLibCheck` ускоряет, пропуская проверку `.d.ts`; `isolatedDeclarations` требует явных типов у экспортов."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Зачем почти все проекты включают `skipLibCheck`?",
      opts: ["Чтобы не проверять тысячи `.d.ts` из node_modules: быстрее и нет конфликтов между пакетами `@types`", "Чтобы не проверять свой код", "Чтобы не создавать `.d.ts`", "Чтобы отключить `strict` для библиотек"],
      a: 0,
      why: "Флаг пропускает проверку объявлений, но не свой код. Использование типов из них по-прежнему проверяется.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `// @filename: math.js
export function double(x) { return x * 2; }
// @filename: math.d.ts
export declare function double(x: number): number;
// @filename: main.ts
import { double } from "./math";
const r = double(2);`,
      opts: ["number", "any", "unknown", "void"],
      a: 0,
      why: "TypeScript нашёл `math.d.ts` рядом с `math.js` и взял тип оттуда.",
    },
    {
      type: "code",
      kind: "write",
      goal: "У модуля `format.js` нет типов. Напиши `format.d.ts`: функция `price` принимает число и необязательную валюту-строку и возвращает строку.",
      code: `// @filename: format.js
export function price(n, currency = "₽") { return n.toFixed(2) + " " + currency; }
// @filename: format.d.ts
export {};
// @filename: main.ts
import { price } from "./format";
const a: string = price(10);
const b: string = price(10, "$");`,
      tests: `// @ts-expect-error — первым аргументом должно быть число
price("10");`,
      forbid: ["any", "ignore"],
      hint: "`export declare function price(n: number, currency?: string): string;`",
      solution: `// @filename: format.js
export function price(n, currency = "₽") { return n.toFixed(2) + " " + currency; }
// @filename: format.d.ts
export declare function price(n: number, currency?: string): string;
// @filename: main.ts
import { price } from "./format";
const a: string = price(10);
const b: string = price(10, "$");`,
    },
  ],
};
