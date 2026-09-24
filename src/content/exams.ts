import { LESSONS } from "./lessons";
import type { PredictTask, QuizTask } from "./types";

export type ExamTask = PredictTask | QuizTask;

/** Сколько вопросов в одном экзамене и сколько процентов нужно, чтобы сдать. */
export const EXAM_SIZE = 12;
export const EXAM_PASS = 80;

/**
 * Вопросы, которых нет в уроках: только для экзамена. Ключ — индекс региона.
 * Для регионов с уроками к ним добавляются «predict» и «quiz» из самих уроков.
 */
const EXAM_ONLY: Record<number, ExamTask[]> = {
  0: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `arr`?",
      code: `const arr = [1, "a"];`,
      probe: "arr",
      opts: ["[number, string]", "(string | number)[]", "readonly [1, \"a\"]", "any[]"],
      a: 1,
      why: "Для массива в квадратных скобках TypeScript выводит массив, а не кортеж. Тип элемента — union типов всех элементов, а `1` и `\"a\"` превращаются в `number` и `string`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `t`?",
      code: `const t = [1, "a"] as const;`,
      probe: "t",
      opts: ["(1 | \"a\")[]", "[number, string]", "readonly [1, \"a\"]", "readonly (string | number)[]"],
      a: 2,
      why: "`as const` превращает массив в кортеж, который нельзя менять, и сохраняет точное значение каждого элемента.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `p`?",
      code: `type A = { a: string } & { a: number };
declare const x: A;
const p = x.a;`,
      probe: "p",
      opts: ["string | number", "string", "never", "unknown"],
      a: 2,
      why: "Пересечение объединяет требования: поле должно быть одновременно строкой и числом. Таких значений нет, поэтому у поля тип `never`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      code: `function first(x?: number) {
  return x;
}
const r = first();`,
      probe: "r",
      opts: ["number", "number | undefined", "undefined", "number | null"],
      a: 1,
      why: "Необязательный параметр внутри функции имеет тип `number | undefined`: его могли не передать. Результат выведен из `return`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `m`?",
      code: `type Theme = { mode: "light" | "dark" };
const theme = { mode: "light" } satisfies Theme;
const m = theme.mode;`,
      probe: "m",
      opts: ["\"light\" | \"dark\"", "\"light\"", "string", "Theme"],
      a: 1,
      why: "`satisfies` проверяет объект, но тип переменной берёт из значения. В `Theme` для `mode` указан union литералов, поэтому `\"light\"` не превращается в `string`. С аннотацией `: Theme` получилось бы `\"light\" | \"dark\"`.",
    },
    {
      type: "quiz",
      q: "Что сделает `tsc` с настройками по умолчанию, если в коде есть ошибки типов?",
      opts: ["Сообщит об ошибках и всё равно создаст `.js`-файлы", "Не создаст ни одного файла", "Удалит строки с ошибками", "Заменит ошибочные типы на `any`"],
      a: 0,
      why: "Проверка типов и создание `.js`-файлов в `tsc` независимы. Чтобы при ошибках файлы не создавались, включают настройку `noEmitOnError`.",
      example: `// tsconfig.json
// { "compilerOptions": { "noEmitOnError": true } }
const n: number = "42"; // ошибка есть, но без noEmitOnError файл app.js всё равно появится`,
    },
    {
      type: "quiz",
      q: "Какой тип выбрать для данных, про которые ничего не известно, чтобы компилятор заставил их проверить?",
      opts: ["`any`", "`unknown`", "`never`", "`object`"],
      a: 1,
      why: "`unknown` принимает любое значение, но пользоваться им можно только после проверки типа. `any` проверки выключает.",
      example: `const data: unknown = JSON.parse('{"name":"Ann"}');
data.name;                     // ошибка: сначала проверь тип
if (typeof data === "string") data.toUpperCase();`,
    },
    {
      type: "quiz",
      q: "Какая строка не скомпилируется, если `type Point = { x: number; y: number }`?",
      opts: [
        "`const p: Point = { x: 1, y: 2, z: 3 };`",
        "`const raw = { x: 1, y: 2, z: 3 }; const p: Point = raw;`",
        "`const p: Point = { x: 1, y: 2 };`",
        "Все три скомпилируются",
      ],
      a: 0,
      why: "Лишнее поле считается ошибкой, только если объект написан прямо в месте присваивания. Через переменную лишние поля проходят: типы сравниваются по набору свойств.",
      example: `type Point = { x: number; y: number };
const a: Point = { x: 1, y: 2, z: 3 }; // ошибка: лишнее поле z
const raw = { x: 1, y: 2, z: 3 };
const b: Point = raw;                  // можно`,
    },
  ],
  1: [
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (!x)`?",
      code: `function f(x: string | null) {
  if (!x) {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["null", "string | null", "\"\" | null", "never"],
      a: 1,
      why: "Пустая строка тоже считается ложным значением, поэтому `string` из типа не уходит. `if (!x)` ловит не только `null`.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` после проверки `Array.isArray(x)` с `return`?",
      code: `function f(x: Date | string[]) {
  if (Array.isArray(x)) {
    return;
  }
  const r = x;
}`,
      probe: "r",
      opts: ["Date", "Date | string[]", "string[]", "object"],
      a: 0,
      why: "`Array.isArray` сужает до массива, а после `return` остаётся всё остальное — `Date`.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (s.kind === \"b\")`?",
      code: `type S = { kind: "a"; a: number } | { kind: "b"; b: string };
function f(s: S) {
  if (s.kind === "b") {
    const r = s;
  }
}`,
      probe: "r",
      opts: ["S", "{ kind: \"b\"; b: string; }", "{ kind: \"a\"; a: number; }", "never"],
      a: 1,
      why: "Это discriminated union: у вариантов есть общее поле `kind` с разными значениями. Проверка этого поля оставляет один вариант.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (typeof x === \"object\" && x !== null)`?",
      code: `function f(x: unknown) {
  if (typeof x === "object" && x !== null) {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["object | null", "{}", "object", "unknown"],
      a: 2,
      why: "`typeof x === \"object\"` даёт `object | null`, потому что `typeof null` тоже `\"object\"`. Проверка `x !== null` убирает `null`.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (x == null)`?",
      code: `function f(x: number | undefined) {
  if (x == null) {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["null", "undefined", "null | undefined", "number | undefined"],
      a: 1,
      why: "`== null` ловит и `null`, и `undefined`. В типе был только `undefined`, он и остался.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (\"a\" in x)`?",
      code: `function f(x: { a: number } | { b: string }) {
  if ("a" in x) {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["{ a: number; }", "{ a: number; } | { b: string; }", "{ b: string; }", "object"],
      a: 0,
      why: "Оператор `in` оставляет в union только варианты, у которых есть такое свойство.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (!isStr(x))`?",
      code: `function isStr(x: unknown): x is string {
  return typeof x === "string";
}
function f(x: string | number) {
  if (!isStr(x)) {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["string | number", "number", "string", "never"],
      a: 1,
      why: "Type predicate работает в обе стороны: в ветке, где функция вернула `false`, из типа убирается `string`.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (typeof x === \"object\")`?",
      code: `function f(x: string | number | boolean) {
  if (typeof x === "object") {
    const r = x;
  }
}`,
      probe: "r",
      opts: ["object", "never", "null", "string | number | boolean"],
      a: 1,
      why: "Ни у строки, ни у числа, ни у boolean `typeof` не равен `\"object\"`. В эту ветку попасть нельзя, поэтому тип `never`.",
    },
    {
      type: "quiz",
      q: "Что вернёт `typeof null` в JavaScript?",
      opts: ["`\"null\"`", "`\"undefined\"`", "`\"object\"`", "Бросит TypeError"],
      a: 2,
      why: "Так сложилось исторически в JavaScript. Поэтому проверка `typeof x === \"object\"` не исключает `null`.",
      example: `function f(x: string[] | null) {
  if (typeof x === "object") {
    x; // string[] | null: null тоже проходит эту проверку
  }
}`,
    },
    {
      type: "quiz",
      q: "Зачем в `default` пишут `const _exhaustive: never = value`?",
      opts: [
        "Чтобы компилятор выдал ошибку, когда в union добавят новый вариант",
        "Чтобы во время работы бросилось исключение",
        "Чтобы ускорить сужение",
        "Чтобы выключить проверку `switch`",
      ],
      a: 0,
      why: "Если все варианты обработаны, в `default` остаётся `never`. Новый вариант не присвоится в `never`, и компилятор покажет, где его забыли.",
      example: `type Status = "ok" | "fail" | "retry";
function label(s: Status): string {
  switch (s) {
    case "ok": return "Готово";
    case "fail": return "Ошибка";
    default: {
      const rest: never = s; // ошибка: забыли обработать "retry"
      return rest;
    }
  }
}`,
    },
  ],
  5: [
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = Exclude<"a" | "b" | "c", "a" | "c">;`,
      probe: "R",
      opts: ["\"a\" | \"c\"", "\"b\"", "never", "\"a\" | \"b\" | \"c\""],
      a: 1,
      why: "`Exclude` дистрибутивно проходит по union и убирает члены, которые присваиваются во второй аргумент.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = NonNullable<string | null | undefined>;`,
      probe: "R",
      opts: ["string", "string | undefined", "string | null", "{}"],
      a: 0,
      why: "`NonNullable<T>` устроен как `T & {}`: пересечение с `{}` убирает `null` и `undefined`.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = Awaited<Promise<Promise<string>>>;`,
      probe: "R",
      opts: ["Promise<string>", "string", "Promise<Promise<string>>", "unknown"],
      a: 1,
      why: "`Awaited` разворачивает промисы рекурсивно, как `await` во время работы программы.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = ReturnType<() => Promise<number>>;`,
      probe: "R",
      opts: ["number", "Promise<number>", "Promise<unknown>", "() => Promise<number>"],
      a: 1,
      why: "`ReturnType` берёт тип результата как есть. Чтобы получить `number`, нужен ещё `Awaited`.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = Omit<{ a: 1; b: 2 }, "a" | "zzz">;`,
      probe: "R",
      opts: ["{ b: 2; }", "never", "{ a: 1; b: 2; }", "{ b: 2; zzz: unknown; }"],
      a: 0,
      why: "Ключи у `Omit` ограничены `keyof any`, а не `keyof T`, поэтому несуществующий `\"zzz\"` молча игнорируется.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = Capitalize<"hello world">;`,
      probe: "R",
      opts: ["\"Hello World\"", "\"Hello world\"", "\"HELLO WORLD\"", "string"],
      a: 1,
      why: "`Capitalize` меняет только первый символ всей строки, а не каждого слова.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `R`?",
      code: `type R = Extract<string | number | (() => void), Function>;`,
      probe: "R",
      opts: ["() => void", "Function", "never", "string | number"],
      a: 0,
      why: "`Extract` оставляет члены union, которые присваиваются во второй аргумент. Функция присваивается в `Function`.",
    },
    {
      type: "quiz",
      q: "Как `Readonly<T>` защищает вложенные объекты?",
      opts: ["Никак: `readonly` только на верхнем уровне", "Делает readonly все уровни", "Замораживает объект во время работы", "Только массивы внутри"],
      a: 0,
      why: "`Readonly` — mapped type по ключам верхнего уровня. Для глубокой защиты пишут свой `DeepReadonly`.",
      example: `type Cfg = { db: { host: string } };
declare const c: Readonly<Cfg>;
c.db.host = "x";      // можно
c.db = { host: "y" }; // ошибка: db только для чтения`,
    },
  ],
};

/** Все вопросы для экзамена по региону. */
export function examPool(region: number): ExamTask[] {
  const fromLessons = LESSONS.filter((l) => l.region === region)
    .flatMap((l) => l.tasks.filter((t): t is ExamTask => t.type !== "code"));
  return [...fromLessons, ...(EXAM_ONLY[region] ?? [])];
}

/** Вопросы, которые есть только в экзаменах, — для проверки в verify. */
export const EXAM_ONLY_TASKS = Object.entries(EXAM_ONLY).flatMap(([r, tasks]) => tasks.map((task) => ({ region: Number(r), task })));

export const hasExam = (region: number) => examPool(region).length >= 6;
