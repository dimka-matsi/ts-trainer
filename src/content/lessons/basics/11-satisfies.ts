import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b11",
  region: 0,
  title: "satisfies",
  q: "Чем `satisfies` отличается от аннотации `: T` и от `as T`?",
  answer: "Аннотация `const x: T` проверяет значение, но дальше у `x` ровно тип `T`, и точные значения теряются. `as T` вообще ничего не проверяет. `satisfies T` проверяет значение так же строго, как аннотация, но тип переменной остаётся таким, каким его вывел TypeScript. Получаются и проверка, и точные типы.",
  theory: {
    p: [
      "Связать значение с типом можно тремя способами. Аннотация `const x: T = ...` проверяет значение, и дальше у `x` тип `T`. Утверждение `... as T` ничего не проверяет. Третий способ — оператор `satisfies`, он появился в TypeScript 4.9.",
      "`значение satisfies T` проверяет значение против `T`: нет ли лишних полей, все ли обязательные на месте, подходят ли типы. Но тип переменной остаётся выведенным из самого значения. Точные типы не заменяются на более общие из `T`.",
      "Типичный случай — объект с настройками. С аннотацией `const theme: Theme` поле `mode` получает тип `\"light\" | \"dark\"`, хотя в нём записано `\"dark\"`. С `satisfies Theme` значение проверено, а у поля остаётся точный тип `\"dark\"`.",
      "Точный тип сохраняется, если в `T` для поля указан union литералов, как `\"light\" | \"dark\"`. Если в `T` стоит просто `string`, литерал превратится в `string`. При компиляции `satisfies` удаляется, как и остальные типы.",
    ],
    example: `type Color = string | [number, number, number];
type Palette = { red: Color; green: Color; blue: Color };

// Аннотация: проверка есть, но у green теперь тип Color
const a: Palette = { red: [255, 0, 0], green: "#00ff00", blue: [0, 0, 255] };
a.green.toUpperCase();     // ошибка: у кортежа нет toUpperCase

// satisfies: проверка есть, и у green остаётся тип string
const b = { red: [255, 0, 0], green: "#00ff00", blue: [0, 0, 255] } satisfies Palette;
b.green.toUpperCase();     // можно
b.red.map((c) => c / 255); // можно: red — кортеж чисел

const c = { red: "#f00", green: "#0f0" } satisfies Palette; // ошибка: нет blue

// as: проверки нет, пустой объект считается палитрой
const d = {} as Palette;`,
    keys: [
      "Аннотация проверяет и заменяет тип на `T`.",
      "`satisfies` проверяет и оставляет выведенный тип.",
      "`as` не проверяет ничего.",
    ],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `cfg`?",
      probe: "cfg",
      code: `const cfg = { mode: "dark" } satisfies { mode: "dark" | "light" };`,
      opts: ["{ mode: string; }", "{ mode: \"dark\" | \"light\"; }", "{ mode: \"dark\"; }", "{ readonly mode: \"dark\"; }"],
      a: 2,
      why: "В проверяемом типе для `mode` указан union литералов, поэтому `\"dark\"` не превращается в `string`. Тип переменной берётся из значения, а не из типа после `satisfies`. `readonly` появился бы только с `as const`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `theme`?",
      probe: "theme",
      code: `type Theme = { primary: string; spacing: number | string };
const theme = { primary: "#3178C6", spacing: 8 } satisfies Theme;`,
      opts: [
        "Theme",
        "{ primary: string; spacing: number; }",
        "{ primary: \"#3178C6\"; spacing: 8; }",
        "{ primary: string; spacing: string | number; }",
      ],
      a: 1,
      why: "Тип переменной выведен из значения: у `spacing` число, поэтому `number`, а не `number | string`. Литералы превратились в `string` и `number`, потому что в `Theme` для этих полей нет литеральных типов.",
    },
    {
      type: "quiz",
      q: "Что останется от `satisfies` после компиляции в JavaScript?",
      opts: ["Ничего: он удаляется, как и типы", "Проверка формы объекта", "Вызов `Object.freeze`", "Проверка, что все поля на месте"],
      a: 0,
      why: "`satisfies` нужен только компилятору. Проверка выполняется при компиляции, а в JavaScript остаётся обычный объект.",
      example: `type Theme = { mode: "light" | "dark" };
const theme = { mode: "dark" } satisfies Theme;
// После компиляции: const theme = { mode: "dark" };`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`applyDark` принимает только `\"dark\"`, но вызов `applyDark(theme.mode)` не компилируется: из-за аннотации у `theme.mode` тип `\"light\" | \"dark\"`. Сделай так, чтобы у поля остался точный тип `\"dark\"`, а объект по-прежнему проверялся по типу `Theme`.",
      code: `type Theme = { mode: "light" | "dark"; fontSize: number };

const theme: Theme = { mode: "dark", fontSize: 14 };

function applyDark(mode: "dark") {
  return "тёмная тема";
}

applyDark(theme.mode);`,
      tests: `// @ts-expect-error: fontSize должен быть числом
const bad = { mode: "dark", fontSize: "14" } satisfies Theme;`,
      forbid: ["any", "as", "ignore"],
      must: ["satisfies Theme", "applyDark(theme.mode);"],
      hint: "Убери аннотацию `: Theme` и допиши `satisfies Theme` после объекта.",
      solution: `type Theme = { mode: "light" | "dark"; fontSize: number };

const theme = { mode: "dark", fontSize: 14 } satisfies Theme;

function applyDark(mode: "dark") {
  return "тёмная тема";
}

applyDark(theme.mode);`,
    },
  ],
};
