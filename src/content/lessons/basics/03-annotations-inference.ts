import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b3",
  region: 0,
  title: "Аннотации и вывод типов",
  q: "Когда писать аннотации типов, а когда положиться на вывод?",
  answer: "Параметры функций аннотирую всегда, переменные — только если вывод даёт не тот тип. Возвращаемый тип явно пишу на границах модулей и в публичном API, чтобы зафиксировать контракт. Колбэки получают типы из контекста, им аннотации обычно не нужны.",
  theory: {
    p: [
      "Аннотация пишется после имени: `let name: string`. Но чаще она не нужна: TS выводит тип переменной из инициализатора, а тип результата функции — из `return`.",
      "Параметры функций вывести не из чего, поэтому их аннотируют всегда. Исключение — contextual typing: у колбэка в `names.forEach(s => ...)` тип `s` берётся из сигнатуры `forEach`.",
      "Аннотация возвращаемого типа полезна на границах модуля: она фиксирует контракт и не даст случайно вернуть лишнее. Для `async` функции это всегда `Promise<T>`.",
      "`let` расширяет литерал до общего типа, а `const` сохраняет: `let a = \"x\"` — `string`, `const b = \"x\"` — `\"x\"`.",
    ],
    example: `let myName = "Alice";              // string
const names = ["Alice", "Bob"];     // string[]
names.forEach(s => s.toUpperCase()); // s: string из контекста

function double(n: number) {        // результат выведен: number
  return n * 2;
}

async function load(): Promise<number> {
  return 26;
}`,
    keys: ["Параметры аннотируй, переменные — по необходимости.", "Колбэки получают типы из контекста.", "`async` функция возвращает `Promise<T>`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `r`?",
      probe: "r",
      code: `function pick(flag: boolean) {
  if (flag) return "yes";
  return 0;
}
const r = pick(true);`,
      opts: ["string | number", "\"yes\" | 0", "\"yes\"", "any"],
      a: 1,
      why: "Тип результата — union типов всех `return`. Литералы здесь не расширяются, потому что результат сразу становится union двух разных литералов.",
    },
    {
      type: "predict",
      q: "Какой тип у `labels`?",
      probe: "labels",
      code: `const nums = [3, 1, 2];
const labels = nums.map(n => n.toFixed(1));`,
      opts: ["number[]", "string[]", "any[]", "unknown[]"],
      a: 1,
      why: "Параметр `n` получил тип `number` из контекста `map`, а колбэк возвращает `string`, поэтому `map` вернёт `string[]`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Добавь аннотации: `id` — число, а функция должна обещать `Promise<string>`.",
      code: `async function fetchName(id): string {
  return "user-" + id;
}`,
      tests: `type t1 = Expect<Equal<ReturnType<typeof fetchName>, Promise<string>>>;
type t2 = Expect<Equal<Parameters<typeof fetchName>, [id: number]>>;`,
      forbid: ["any", "as", "ignore"],
      hint: "У `async` функции возвращаемый тип всегда оборачивается в `Promise<...>`.",
      solution: `async function fetchName(id: number): Promise<string> {
  return "user-" + id;
}`,
    },
  ],
};
