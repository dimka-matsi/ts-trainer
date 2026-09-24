import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f5",
  region: 2,
  title: "void, never и колбэки",
  q: "Колбэк `forEach` должен возвращать `void`. Почему тогда `forEach(x => arr.push(x))` компилируется?",
  answer: "Тип функции с результатом `void` принимает функции, которые что-то возвращают: вызывающий обещает не использовать результат. Поэтому короткие колбэки вроде `x => arr.push(x)` подходят в `forEach`. Но если у объявления функции явно написано `: void`, вернуть значение нельзя. Результат `never` означает другое: функция вообще не завершается нормально.",
  theory: {
    p: [
      "`void` в типе результата значит «результат не используют». Функция без `return` возвращает `undefined`, и TypeScript выводит для неё `void`.",
      "Тип `() => void` принимает функцию с любым результатом, результат просто игнорируется. Правило сделано ради колбэков: `arr.forEach(x => out.push(x))` компилируется, хотя `push` возвращает число.",
      "Явная аннотация `function f(): void` запрещает `return 1`. Правило «любой результат» работает только при присваивании функции в тип с `void`.",
      "`never` — функция не завершается: бросает исключение или работает бесконечно. Код после такого вызова TypeScript считает недостижимым. Стрелка, которая только бросает, получает `never` автоматически, а объявление `function` — `void`: там `never` пишут явно.",
    ],
    example: `const out: number[] = [];
[1, 2, 3].forEach((x) => out.push(x)); // ок: push возвращает number

type Handler = () => void;
const h: Handler = () => 42;           // ок
const r = h();                         // r: void, 42 использовать нельзя

function log(msg: string): void {
  return msg.length;                   // ошибка: явный void
}

function fail(msg: string): never {
  throw new Error(msg);
}
function toNumber(s: string): number {
  const n = Number(s);
  if (Number.isNaN(n)) fail("не число");
  return n;
}`,
    keys: ["`() => void` принимает функции с любым результатом.", "Явный `: void` у объявления запрещает возвращать значение.", "`never` — функция не завершается нормально."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `type Handler = () => void;
const h: Handler = () => 42;
const r = h();`,
      opts: ["number", "void", "undefined", "42"],
      a: 1,
      why: "Тип переменной `h` — `Handler`, и результат её вызова `void`, какой бы функцией её ни заполнили.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `boom`?",
      probe: "boom",
      code: `const boom = () => {
  throw new Error("boom");
};`,
      opts: ["() => void", "() => never", "() => undefined", "() => Error"],
      a: 1,
      why: "У стрелки и функционального выражения без достижимого конца TypeScript выводит `never`. У объявления `function` с тем же телом было бы `void`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`label` не компилируется: TypeScript считает, что после `assertNever(s)` функция может закончиться без `return`. Исправь тип `assertNever`, не трогая `label`.",
      code: `function assertNever(x: never): void {
  throw new Error("Неизвестное значение: " + x);
}

type Status = "ok" | "fail";

function label(s: Status): string {
  if (s === "ok") return "Готово";
  if (s === "fail") return "Ошибка";
  assertNever(s);
}`,
      runtime: [["label(\"ok\")", "\"Готово\""], ["label(\"fail\")", "\"Ошибка\""]],
      forbid: ["any", "as", "ignore"],
      must: ["function label(s: Status): string {", "  assertNever(s);\n}"],
      hint: "Функция, которая всегда бросает исключение, должна возвращать `never`.",
      solution: `function assertNever(x: never): never {
  throw new Error("Неизвестное значение: " + x);
}

type Status = "ok" | "fail";

function label(s: Status): string {
  if (s === "ok") return "Готово";
  if (s === "fail") return "Ошибка";
  assertNever(s);
}`,
    },
  ],
};
