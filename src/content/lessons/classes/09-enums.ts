import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl9",
  region: 7,
  title: "Enum и const enum",
  q: "Как работают `enum` и `const enum`? Почему часто выбирают union и `as const` вместо `enum`?",
  answer: "`enum` — одна из немногих конструкций TypeScript, которая создаёт код: объект во время работы. У числовых enum есть обратное отображение `Dir[0] === \"Up\"`, и в числовой enum можно записать любое число. Строковые enum строгие: `\"a\"` не присвоить в `S` без `S.A`. `const enum` подставляет значения при компиляции и не создаёт объект, но плохо работает с поштучной компиляцией (`isolatedModules`). Поэтому часто выбирают union литералов или объект `as const` с типом из значений: их нет в JavaScript сверх данных, они совместимы с обычными строками и работают с запуском `.ts` без сборки.",
  theory: {
    p: [
      "`enum Dir { Up, Down }` компилируется в объект, где есть и `Dir.Up === 0`, и `Dir[0] === \"Up\"` — обратное отображение, только у числовых enum. Строковый `enum Status { Active = \"active\" }` обратного отображения не имеет.",
      "Особенности. Числовой enum исторически принимал любое число — с TypeScript 5.0 это ограничили известными значениями, но enum всё равно ведёт себя не как обычный тип. Строковый enum номинальный: строку `\"active\"` не присвоить в `Status`, нужно `Status.Active`. Это неудобно на границе с API, где приходят строки.",
      "`const enum` не создаёт объект: компилятор подставляет значения прямо в код. Но для этого ему нужно видеть объявление, а инструменты, которые компилируют файлы по одному — Babel, esbuild, SWC, `isolatedModules`, — этого не умеют. Поэтому `const enum` в библиотеках и больших проектах избегают.",
      "Альтернатива: `const Status = { Active: \"active\", Blocked: \"blocked\" } as const; type Status = (typeof Status)[keyof typeof Status]`. Есть и объект во время работы, и union литералов в типе, строки из API подходят напрямую. Ещё проще — чистый union `\"active\" | \"blocked\"`. Флаг `erasableSyntaxOnly` для запуска `.ts` в Node без сборки запрещает `enum` вовсе.",
    ],
    example: `enum Dir { Up, Down }
const name = Dir[0];                    // "Up" — обратное отображение

enum Status { Active = "active", Blocked = "blocked" }
const s1: Status = Status.Active;
const s2: Status = "active";            // ошибка: строковый enum номинальный

const Role = { Admin: "admin", User: "user" } as const;
type Role = (typeof Role)[keyof typeof Role];   // "admin" | "user"
const r: Role = "admin";                // строка подходит напрямую`,
    keys: ["`enum` создаёт объект во время работы; у числовых есть обратное отображение.", "Строковый enum номинальный: обычная строка в него не присваивается. `const enum` ломается при поштучной компиляции.", "Альтернатива — union литералов или объект `as const` с типом из значений."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `d`?",
      probe: "d",
      code: `enum Dir { Up, Down }
const d = Dir[0];`,
      opts: ["string", "Dir", "\"Up\"", "number"],
      a: 0,
      why: "Обратное отображение числового enum — объект с числовыми ключами и строковыми значениями, поэтому тип `string`.",
    },
    {
      type: "quiz",
      q: "Почему `const enum` избегают в проектах, которые собирают esbuild или SWC?",
      opts: ["Они компилируют файлы по одному и не видят объявление enum в другом файле, чтобы подставить значение", "Они не поддерживают TypeScript", "`const enum` медленнее обычного", "`const enum` удалён из языка"],
      a: 0,
      why: "Подстановка требует знаний о другом файле, а поштучная компиляция их не имеет. Отсюда флаг `isolatedModules`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Замени `enum` на объект `as const` и тип `Status` из его значений, чтобы строка из API `\"active\"` подходила напрямую.",
      code: `enum Status {
  Active = "active",
  Blocked = "blocked",
}

const fromApi: Status = "active";`,
      tests: `type t1 = Expect<Equal<Status, "active" | "blocked">>;
const s: Status = Status.Blocked;`,
      forbid: ["any", "ignore", { re: "\\benum\\b", msg: "Без enum" }],
      hint: "`const Status = { Active: \"active\", Blocked: \"blocked\" } as const;` и `type Status = (typeof Status)[keyof typeof Status];`.",
      solution: `const Status = {
  Active: "active",
  Blocked: "blocked",
} as const;
type Status = (typeof Status)[keyof typeof Status];

const fromApi: Status = "active";`,
    },
  ],
};
