import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj2",
  region: 10,
  title: "Запуск .ts в Node: type stripping",
  q: "Как Node запускает `.ts` без сборки? Что запрещает `erasableSyntaxOnly`?",
  answer: "Node умеет запускать `.ts` напрямую: он заменяет аннотации типов пробелами и выполняет получившийся JavaScript, ничего не проверяя. Без флагов это работает с Node 22.18 и 23.6, стабильным стало в 24.12 и 25.2. Стереть можно только синтаксис, который не создаёт код, поэтому `enum`, `namespace` с кодом, parameter properties и `import x = require()` не поддерживаются. Флаг `erasableSyntaxOnly` (TypeScript 5.8) запрещает именно их, чтобы код гарантированно запускался. Ещё нужны расширения в импортах: `import \"./util.ts\"`, а проверка типов всё равно остаётся на `tsc`.",
  theory: {
    p: [
      "Type stripping — «стирание» типов: Node заменяет аннотации, интерфейсы и `type` пробелами и выполняет файл как JavaScript. Номера строк сохраняются, source maps не нужны. Проверки типов нет — это просто быстрый запуск скриптов, тестов и серверов без шага сборки.",
      "Версии: без флага работает с Node 23.6 и 22.18, считается стабильным с 25.2 и 24.12. `.tsx` не поддерживается, импорты пишут с расширением `.ts`, а модульная система определяется как у JavaScript: `package.json`, `.mts`, `.cts`.",
      "Что нельзя стереть: конструкции TypeScript, которые создают код. `enum` становится объектом, `namespace` с кодом — функцией, parameter properties `constructor(private x)` — присваиванием, `import x = require()` — вызовом. Декораторы тоже пока не поддерживаются. На таком файле Node упадёт.",
      "`erasableSyntaxOnly` (TypeScript 5.8) превращает эти конструкции в ошибки компиляции, чтобы узнать о проблеме в редакторе, а не при запуске. Рекомендуемый набор для Node: `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`, `noEmit`. Вместо `enum` — объект `as const`, вместо parameter properties — обычные поля.",
    ],
    example: `// @flags: erasableSyntaxOnly, verbatimModuleSyntax
enum Role { Admin, User }                       // ошибка: enum создаёт код
namespace Utils { export const a = 1; }         // ошибка: namespace с кодом
namespace Types { export type Id = number; }    // можно: только типы
class Point {
  constructor(private x: number) {}             // ошибка: parameter property
}

const ROLE = { Admin: "admin", User: "user" } as const;
type Role2 = (typeof ROLE)[keyof typeof ROLE];  // можно: стирается целиком`,
    keys: ["Node стирает типы и выполняет JavaScript без проверки: без флага с 22.18 и 23.6, стабильно с 24.12 и 25.2.", "`enum`, `namespace` с кодом, parameter properties, `import =` и декораторы стереть нельзя.", "`erasableSyntaxOnly` (TS 5.8) делает их ошибками; импорты — с расширением `.ts`, типы проверяет `tsc`."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Проверяет ли Node типы, когда запускает `.ts` через type stripping?",
      opts: ["Нет: он только стирает аннотации и выполняет JavaScript", "Да, как `tsc`", "Да, но только в режиме `strict`", "Только типы параметров функций"],
      a: 0,
      why: "Type stripping — способ запустить код. Проверка типов по-прежнему задача редактора и `tsc`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для `Role2` в коде, который запускается через type stripping?",
      probe: "Role2",
      code: `// @flags: erasableSyntaxOnly
const ROLE = { Admin: "admin", User: "user" } as const;
type Role2 = (typeof ROLE)[keyof typeof ROLE];`,
      opts: ["\"admin\" | \"user\"", "string", "typeof ROLE", "\"Admin\" | \"User\""],
      a: 0,
      why: "Объект `as const` — обычный JavaScript, а тип стирается целиком. Поэтому это разрешённая замена `enum`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "С `erasableSyntaxOnly` класс не компилируется из-за parameter property. Перепиши его на обычное поле, сохранив поведение.",
      code: `// @flags: erasableSyntaxOnly
class Greeter {
  constructor(private name: string) {}
  greet() {
    return "Привет, " + this.name;
  }
}`,
      runtime: [["new Greeter('Аня').greet()", "\"Привет, Аня\""]],
      forbid: ["any", "ignore"],
      hint: "Объяви поле `private name: string;` и присвой его в конструкторе: `this.name = name;`.",
      solution: `// @flags: erasableSyntaxOnly
class Greeter {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  greet() {
    return "Привет, " + this.name;
  }
}`,
    },
  ],
};
