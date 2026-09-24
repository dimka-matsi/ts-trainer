import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b3",
  region: 0,
  title: "Аннотации и вывод типов",
  q: "Когда писать типы явно, а когда положиться на вывод типов?",
  answer: "Типы параметров функций я пишу всегда: TypeScript не из чего их вывести. У переменных тип выводится из значения, поэтому указываю его, только если вывод даёт не то. Тип результата пишу явно у функций, которые вызывают из других файлов, чтобы случайная правка его не поменяла. Параметры колбэков получают тип из места вызова.",
  theory: {
    p: [
      "Тип указывают после имени через двоеточие: `let name: string`. Такая запись называется аннотацией. Часто она не нужна: TypeScript сам выводит тип переменной из её значения, а тип результата функции — из `return`.",
      "Параметры функции вывести не из чего, поэтому их тип пишут всегда. Исключение — колбэки: в `names.forEach(s => ...)` тип `s` TypeScript берёт из описания метода `forEach`. Это называется контекстной типизацией.",
      "Тип результата полезно писать явно у функций, которые вызывают из других файлов. Тогда правка внутри функции не поменяет её результат незаметно. У `async`-функции результат всегда обёрнут в `Promise`, например `Promise<number>`.",
      "В примерах дальше встречается запись `declare const x: number`. Она говорит компилятору, что такая переменная есть и у неё такой тип, но значения не создаёт. Так удобно показывать работу с типом, не придумывая данные.",
    ],
    example: `let myName = "Alice";                  // string
const names = ["Alice", "Bob"];        // string[]
names.forEach((s) => s.toUpperCase()); // s: string из контекста

function double(n: number) {           // результат выведен: number
  return n * 2;
}

async function load(): Promise<number> {
  return 26;
}

declare const price: number;           // только тип, без значения
double(price);`,
    keys: ["Параметры функций аннотируют всегда.", "Колбэки получают типы из контекста.", "У `async`-функции результат — `Promise<...>`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function isLong(text: string) {
  return text.length > 10;
}
const r = isLong("TypeScript");`,
      opts: ["boolean", "number", "string", "any"],
      a: 0,
      why: "Тип результата выведен из `return`: сравнение через `>` даёт `boolean`. Аннотация результата здесь не нужна.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `labels`?",
      probe: "labels",
      code: `const nums = [3, 1, 2];
const labels = nums.map((n) => n.toFixed(1));`,
      opts: ["number[]", "string[]", "any[]", "string"],
      a: 1,
      why: "Параметр `n` получил тип `number` из описания `map`. Колбэк возвращает строку, поэтому `map` вернёт массив строк.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Укажи типы: параметр `id` — число, а функция должна возвращать промис со строкой.",
      code: `async function fetchName(id): string {
  return "user-" + id;
}`,
      tests: `const p: Promise<string> = fetchName(1);
// @ts-expect-error: id должен быть числом
fetchName("1");`,
      forbid: ["any", "as", "ignore"],
      hint: "У `async`-функции тип результата оборачивается в `Promise<...>`.",
      solution: `async function fetchName(id: number): Promise<string> {
  return "user-" + id;
}`,
    },
  ],
};
