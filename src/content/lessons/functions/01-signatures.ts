import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f1",
  region: 2,
  title: "Сигнатуры функций",
  q: "Как описать функцию, у которой есть свойство?",
  answer: "Для обычной функции хватает записи `(n: number) => string`. Если у функции есть свойства, пишу объектный тип с call signature: `{ (n: number): string; label: string }`. Для того, что вызывают через `new`, есть construct signature: `new () => Date`.",
  theory: {
    p: [
      "Тип функции чаще всего пишут стрелкой: `(a: number, b: number) => number`. Имена параметров обязательны, но при проверке важны только типы и порядок.",
      "Функция в JS — объект, и у неё бывают свойства. Их описывает объектный тип с call signature: `{ (x: number): string; label: string }`. Внутри объектного типа пишут `:` вместо `=>`.",
      "Construct signature `new () => Date` описывает то, что вызывают через `new`, например класс. Так типизируют параметр, в который передают класс, чтобы создать из него объект.",
      "Функция с меньшим числом параметров подходит туда, где ждут больше: лишние аргументы она игнорирует. Поэтому `arr.forEach(x => ...)` принимает колбэк с одним параметром из трёх.",
    ],
    example: `type BinaryOp = (a: number, b: number) => number;
const add: BinaryOp = (a, b) => a + b;

type Counter = {
  (): number;      // call signature
  reset(): void;   // свойство-метод
};
function makeCounter(): Counter {
  let n = 0;
  return Object.assign(() => ++n, { reset: () => { n = 0; } });
}

type DateMaker = new () => Date;
function create(C: DateMaker) {
  return new C();
}
const d = create(Date); // Date

const onItem: (item: string, index: number) => void = (item) => {}; // ок: index не нужен`,
    keys: ["Стрелка — тип обычной функции.", "Call signature `{ (x: number): string; prop: T }` — функция со свойствами.", "Construct signature `new () => Date` — то, что вызывают через `new`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `d`?",
      probe: "d",
      code: `function make(C: new () => Date) {
  return new C();
}
const d = make(Date);`,
      opts: ["Date", "DateConstructor", "new () => Date", "unknown"],
      a: 0,
      why: "Параметр `C` описан как то, что через `new` создаёт `Date`. Значит, `new C()` даёт `Date`, и функция возвращает `Date`.",
    },
    {
      type: "quiz",
      q: "Можно ли записать функцию типа `(a: string) => void` в переменную типа `(a: string, b: number) => void`?",
      opts: ["Да: лишний аргумент функция проигнорирует", "Нет: разное число параметров", "Только если `b` сделать необязательным", "Только через `as`"],
      a: 0,
      why: "Функции с меньшим числом параметров совместимы: вызывающий передаст `b`, а функция его просто не прочитает. Так работают колбэки `map` и `forEach`.",
      example: `const onPair: (a: string, b: number) => void = (a) => console.log(a); // можно
["x", "y"].forEach((item) => console.log(item)); // index и массив колбэку не нужны`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "У логгера есть свойство `level`, но тип `Logger` его не описывает, и `log.level` не компилируется. Опиши `Logger` так, чтобы это была функция `(msg: string) => void` со свойством `level: \"info\" | \"debug\"`.",
      code: `type Logger = (msg: string) => void;

function makeLogger(level: "info" | "debug"): Logger {
  return Object.assign((msg: string) => console.log(\`[\${level}] \${msg}\`), { level });
}

const log = makeLogger("debug");
const lvl = log.level;`,
      tests: `type t1 = Expect<Equal<typeof lvl, "info" | "debug">>;
log("готово");
// @ts-expect-error: level только из списка
const bad: Logger = Object.assign((m: string) => {}, { level: "warn" });`,
      forbid: ["any", "as", "ignore"],
      must: ["function makeLogger", "const lvl = log.level;"],
      hint: "Объектный тип с call signature: `{ (msg: string): void; level: ... }`.",
      solution: `type Logger = {
  (msg: string): void;
  level: "info" | "debug";
};

function makeLogger(level: "info" | "debug"): Logger {
  return Object.assign((msg: string) => console.log(\`[\${level}] \${msg}\`), { level });
}

const log = makeLogger("debug");
const lvl = log.level;`,
    },
  ],
};
